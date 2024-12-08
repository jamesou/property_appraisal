from langchain_anthropic import ChatAnthropic
from langchain.prompts import ChatPromptTemplate
from typing import Dict
import logging
from .config import ANTHROPIC_API_KEY, CLAUDE_MODEL

logger = logging.getLogger(__name__)

class PropertyDescriptionGenerator:
    def __init__(self):
        self.model = ChatAnthropic(
            anthropic_api_key=ANTHROPIC_API_KEY,
            model_name=CLAUDE_MODEL,
            max_tokens=1000,
            temperature=0.7
        )

    def generate_description(self, property_data: Dict) -> str:
        """
        Generate a detailed property description using Claude through LangChain.
        
        Args:
            property_data: Dictionary containing property details
            
        Returns:
            str: Generated property description
        """
        try:
            # Create a prompt template
            prompt = ChatPromptTemplate.from_template("""
Generate a professional property description for a valuation report using these details:

Property Information:
- Address: {address}
- Location: {location}, {suburb}
- Category: {category}
- Actual Use: {actual_use}
- Bedrooms: {bedrooms}
- Building Area: {building_area} sqm
- Improvements: {improvements}

Please write a detailed description that:
1. Describes the property location and surroundings
2. Details the property type and construction
3. Lists key features and improvements
4. Highlights any unique characteristics
5. Uses professional real estate terminology

The description should be factual and objective, suitable for a valuation report.
""")

            # Format the prompt with property data
            formatted_prompt = prompt.format_messages(
                address=property_data['address']['full_address'],
                location=property_data['address']['town_city'],
                suburb=property_data['address']['suburb_locality'],
                category=property_data['valuation']['property_category'],
                actual_use=property_data['valuation']['actual_property_use'],
                bedrooms=property_data['valuation']['no_of_bedrooms'],
                building_area=property_data['valuation']['building_total_floor_area'],
                improvements=property_data['valuation']['improvements_description']
            )

            # Generate the description using Claude through LangChain
            response = self.model.invoke(formatted_prompt)
            
            return response.content

        except Exception as e:
            logger.error(f"Error generating property description: {str(e)}")
            raise Exception(f"Failed to generate property description: {str(e)}")

    def generate_market_analysis(self, property_data: Dict, market_trends: Dict) -> str:
        """
        Generate a market analysis section for the property using LangChain.
        
        Args:
            property_data: Dictionary containing property details
            market_trends: Dictionary containing local market data
            
        Returns:
            str: Generated market analysis
        """
        try:
            prompt = ChatPromptTemplate.from_template("""
Generate a market analysis section for this property:

Property Details:
- Location: {location}, {suburb}
- Property Type: {property_type}
- Current Value: ${current_value}

Market Information:
- Area Median Price: ${median_price}
- Price Trends: {price_trend}
- Market Activity: {market_activity}

Please provide a concise market analysis that:
1. Analyzes the local property market
2. Compares the property to similar properties
3. Discusses relevant market trends
4. Considers location-specific factors
5. Provides a market outlook

Keep the analysis factual and evidence-based.
""")

            # Format the prompt with property data
            formatted_prompt = prompt.format_messages(
                location=property_data['address']['town_city'],
                suburb=property_data['address']['suburb_locality'],
                property_type=property_data['valuation']['property_category'],
                current_value=property_data['valuation']['capital_value'],
                median_price=market_trends.get('median_price', 'N/A'),
                price_trend=market_trends.get('price_trend', 'N/A'),
                market_activity=market_trends.get('market_activity', 'N/A')
            )

            # Generate the analysis using Claude through LangChain
            response = self.model.invoke(formatted_prompt)
            
            return response.content

        except Exception as e:
            logger.error(f"Error generating market analysis: {str(e)}")
            raise Exception(f"Failed to generate market analysis: {str(e)}")
