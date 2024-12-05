from pydantic import BaseModel, Field
from typing import Optional

class PropertySearch(BaseModel):
    address: str = Field(..., description="Address to search for", min_length=1)

    class Config:
        json_schema_extra = {
            "example": {
                "address": "292 Yaldhurst"
            }
        }

class Address(BaseModel):
    address_id: str
    full_address: str
    town_city: Optional[str]
    suburb_locality: Optional[str]
    territorial_authority: Optional[str]
    full_road_name: Optional[str]
    address_number: Optional[str]

class ValuationRoll(BaseModel):
    unit_of_property_id: str
    valuation_no_roll: Optional[str]
    capital_value: Optional[str]
    improvements_value: Optional[str]
    land_value: Optional[str]
    no_of_bedrooms: Optional[str]
    improvements_description: Optional[str]
    building_total_floor_area: Optional[str]
    property_category: Optional[str]
    actual_property_use: Optional[str]
    legal_description: Optional[str]
    address: Optional[Address] = None

class PropertyResponse(BaseModel):
    valuation: ValuationRoll
    address: Address

    class Config:
        from_attributes = True
