from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import logging
from sqlalchemy import event, text
from sqlalchemy.engine import Engine
import time
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

import models
import schemas
from database import engine, get_db
from llm.client_letter import ClientLetterGenerator
from llm.property_description import PropertyDescriptionGenerator

# Initialize LLM generators
client_letter_gen = ClientLetterGenerator()
property_desc_gen = PropertyDescriptionGenerator()

# Log SQL queries
@event.listens_for(Engine, "before_cursor_execute")
def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    conn.info.setdefault('query_start_time', []).append(time.time())
    logger.info(f"SQL Query: {statement}")
    logger.info(f"Parameters: {parameters}")

@event.listens_for(Engine, "after_cursor_execute")
def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    total = time.time() - conn.info['query_start_time'].pop(-1)
    logger.info(f"Total Time: {total:.3f}s")

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test_endpoint():
    return {"message": "API is working"}

@app.post("/properties/search")
def search_properties(search_criteria: schemas.PropertySearch, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received search criteria: {search_criteria.dict()}")

        # Use raw SQL query
        sql = text("""
            SELECT 
                a.unit_of_property_id,
                a.valuation_no_roll,
                a.capital_value,
                a.improvements_value,
                a.land_value,
                a.no_of_bedrooms,
                a.improvements_description,
                a.building_total_floor_area,
                a.property_category,
                a.actual_property_use,
                a.legal_description,
                c.address_id,
                c.full_address,
                c.town_city,
                c.suburb_locality,
                c.territorial_authority,
                c.full_road_name,
                c.address_number
            FROM nz_valuation_roll a
            INNER JOIN nz_property_address_ref b ON a.unit_of_property_id = b.unit_of_property_id
            INNER JOIN nz_addresses c ON b.address_id = c.address_id
            WHERE c.full_address LIKE :address
        """)
        
        # Execute the query with parameters
        search_term = f"%{search_criteria.address}%"
        logger.info(f"Executing search with term: {search_term}")
        
        result = db.execute(sql, {"address": search_term})
        
        # Get column names
        columns = result.keys()
        logger.info(f"Query columns: {columns}")
        
        # Convert results to list of dictionaries
        response_data = []
        for row in result:
            # Convert row to dictionary with column names
            row_dict = dict(zip(columns, row))
            logger.info(f"Processing row: {row_dict}")
            
            # Create property data dictionary
            property_data = {
                "valuation": {
                    "unit_of_property_id": row_dict["unit_of_property_id"],
                    "valuation_no_roll": row_dict["valuation_no_roll"],
                    "capital_value": row_dict["capital_value"],
                    "improvements_value": row_dict["improvements_value"],
                    "land_value": row_dict["land_value"],
                    "no_of_bedrooms": row_dict["no_of_bedrooms"],
                    "improvements_description": row_dict["improvements_description"],
                    "building_total_floor_area": row_dict["building_total_floor_area"],
                    "property_category": row_dict["property_category"],
                    "actual_property_use": row_dict["actual_property_use"],
                    "legal_description": row_dict["legal_description"]
                },
                "address": {
                    "address_id": row_dict["address_id"],
                    "full_address": row_dict["full_address"],
                    "town_city": row_dict["town_city"],
                    "suburb_locality": row_dict["suburb_locality"],
                    "territorial_authority": row_dict["territorial_authority"],
                    "full_road_name": row_dict["full_road_name"],
                    "address_number": row_dict["address_number"]
                }
            }

            try:
                # Generate property description
                property_description = property_desc_gen.generate_description(property_data)
                
                # Generate client letter (using default values for client name and purpose)
                client_letter = client_letter_gen.generate_client_letter(
                    property_data,
                    client_name="Property Owner",
                    purpose="Valuation Report"
                )

                # Add AI content to response
                property_data["AI_content"] = {
                    "property_description": property_description,
                    "client_letter": client_letter
                }
            except Exception as e:
                logger.error(f"Error generating LLM content: {str(e)}")
                property_data["AI_content"] = {
                    "error": f"Failed to generate content: {str(e)}"
                }

            response_data.append(property_data)

        logger.info(f"Found {len(response_data)} matching properties")
        return response_data

    except Exception as e:
        logger.error(f"Error during search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
