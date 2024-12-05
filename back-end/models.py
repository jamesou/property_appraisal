from sqlalchemy import Column, String, Integer, Text
from database import Base

class ValuationRoll(Base):
    __tablename__ = "nz_valuation_roll"

    unit_of_property_id = Column(String, primary_key=True)
    valuation_no_roll = Column(String)
    capital_value = Column(String)
    improvements_value = Column(String)
    land_value = Column(String)
    no_of_bedrooms = Column(String)
    improvements_description = Column(String)
    building_total_floor_area = Column(String)
    property_category = Column(String)
    actual_property_use = Column(String)
    legal_description = Column(String)

class PropertyAddressRef(Base):
    __tablename__ = "nz_property_address_ref"

    id = Column(String, primary_key=True)
    unit_of_property_id = Column(String)
    address_id = Column(String)

class Address(Base):
    __tablename__ = "nz_addresses"

    id = Column(Integer, primary_key=True)
    address_id = Column(String)
    full_address = Column(Text)
    town_city = Column(Text)
    suburb_locality = Column(Text)
    territorial_authority = Column(Text)
    full_road_name = Column(Text)
    address_number = Column(Text)
