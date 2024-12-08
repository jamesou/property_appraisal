from langchain_anthropic import ChatAnthropic
from langchain.prompts import ChatPromptTemplate
from typing import Dict
import logging
from .config import ANTHROPIC_API_KEY, CLAUDE_MODEL

logger = logging.getLogger(__name__)

class ClientLetterGenerator:
    def __init__(self):
        self.model = ChatAnthropic(
            anthropic_api_key=ANTHROPIC_API_KEY,
            model_name=CLAUDE_MODEL,
            max_tokens=1500,
            temperature=0.7
        )

    def generate_client_letter(self, property_data: Dict, client_name: str, purpose: str) -> str:
        """
        Generate a professional client letter for property valuation.
        
        Args:
            property_data: Dictionary containing property details
            client_name: Name of the client
            purpose: Purpose of the valuation (e.g., "mortgage", "sale", "insurance")
            
        Returns:
            str: Generated client letter
        """
        try:
            # Create a prompt template
            prompt = ChatPromptTemplate.from_template("""
Please write a professional client letter for a property valuation report with the following details:

Client Name: {client_name}
Purpose: {purpose}

Property Details:
Address: {address}
Town/City: {town_city}
Property Category: {property_category}
Capital Value: ${capital_value}
Land Value: ${land_value}
Improvements Value: ${improvements_value}
Number of Bedrooms: {bedrooms}
Building Area: {building_area} sqm

Please write a formal letter that:
1. Introduces the purpose of the valuation
2. Summarizes the key property details
3. Explains the valuation approach
4. States any assumptions or limitations
5. Concludes with next steps
6. Uses a professional tone throughout

The letter should be formatted with proper paragraphs and structure.
""")

            # Format the prompt with property data
            formatted_prompt = prompt.format_messages(
                client_name=client_name,
                purpose=purpose,
                address=property_data['address']['full_address'],
                town_city=property_data['address']['town_city'],
                property_category=property_data['valuation']['property_category'],
                capital_value=property_data['valuation']['capital_value'],
                land_value=property_data['valuation']['land_value'],
                improvements_value=property_data['valuation']['improvements_value'],
                bedrooms=property_data['valuation']['no_of_bedrooms'],
                building_area=property_data['valuation']['building_total_floor_area']
            )

            # Generate the letter using Claude through LangChain
            response = self.model.invoke(formatted_prompt)
            
            return response.content

        except Exception as e:
            logger.error(f"Error generating client letter: {str(e)}")
            raise Exception(f"Failed to generate client letter: {str(e)}")
