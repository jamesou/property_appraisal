import React from 'react';
import { FaHome, FaDollarSign, FaInfoCircle, FaChartLine, FaMapMarkerAlt, FaRulerCombined } from 'react-icons/fa';
import './ValuationReport.css';

interface ValuationResult {
  address: {
    address_id: string;
    full_address: string;
    town_city: string;
    suburb_locality: string;
    territorial_authority: string;
  };
  valuation: {
    unit_of_property_id: string;
    valuation_no_roll: string;
    capital_value: string;
    improvements_value: string;
    land_value: string;
    no_of_bedrooms: string;
    improvements_description: string;
    building_total_floor_area: string;
    property_category: string;
    actual_property_use: string;
    legal_description: string;
  };
  AI_content: {
    property_description: string;
    client_letter: string;
  };
}

interface ValuationReportProps {
  valuationResult: ValuationResult;
  onGenerateReport: () => void;
}

const ValuationReport: React.FC<ValuationReportProps> = ({ valuationResult, onGenerateReport }) => {
  const formatCurrency = (value: string) => {
    return parseInt(value).toLocaleString('en-NZ', {
      style: 'currency',
      currency: 'NZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const getPropertySizeCategory = (size: string) => {
    const area = parseInt(size);
    if (area < 120) return 'compact';
    if (area < 200) return 'medium-sized';
    return 'spacious';
  };

  const getLandValuePercentage = () => {
    const landValue = parseInt(valuationResult.valuation.land_value);
    const totalValue = parseInt(valuationResult.valuation.capital_value);
    return Math.round((landValue / totalValue) * 100);
  };

  return (
    <div className="valuation-report">
      <div className="report-header">
        <h2>Property Valuation Report</h2>
        <div className="report-date">
          Generated on {new Date().toLocaleDateString('en-NZ', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="report-content">
        <div className="report-section property-details">
          <div className="section-header">
            <FaHome className="section-icon" />
            <h3>Property Details</h3>
          </div>
          <div className="section-content">
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <label>Address</label>
                <p>{valuationResult.address.full_address}</p>
                <p>{valuationResult.address.suburb_locality}, {valuationResult.address.town_city}</p>
              </div>
            </div>
            <div className="detail-item">
              <FaRulerCombined className="detail-icon" />
              <div>
                <label>Property Specifications</label>
                <p>Building Area: {valuationResult.valuation.building_total_floor_area} m²</p>
                {valuationResult.valuation.no_of_bedrooms && valuationResult.valuation.no_of_bedrooms !== 'nan' && (
                  <p>Bedrooms: {valuationResult.valuation.no_of_bedrooms}</p>
                )}
                <p>Category: {valuationResult.valuation.property_category}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="report-section valuation-details">
          <div className="section-header">
            <FaDollarSign className="section-icon" />
            <h3>Valuation Details</h3>
          </div>
          <div className="section-content">
            <div className="estimated-value">
              <label>Estimated Value</label>
              <p>{formatCurrency(valuationResult.valuation.capital_value)}</p>
            </div>
            <div className="value-breakdown">
              <div className="detail-item">
                <div>
                  <label>Land Value</label>
                  <p>{formatCurrency(valuationResult.valuation.land_value)}</p>
                </div>
              </div>
              <div className="detail-item">
                <div>
                  <label>Improvements Value</label>
                  <p>{formatCurrency(valuationResult.valuation.improvements_value)}</p>
                </div>
              </div>
            </div>
            {valuationResult.valuation.improvements_description && (
              <div className="detail-item improvements">
                <div>
                  <label>Improvements</label>
                  <p>{valuationResult.valuation.improvements_description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="report-section additional-info">
          <div className="section-header">
            <FaInfoCircle className="section-icon" />
            <h3>Additional Information</h3>
          </div>
          <div className="section-content">
            <div className="detail-item">
              <div>
                <label>Property Information</label>
                <p>ID: {valuationResult.valuation.unit_of_property_id}</p>
                <p>Roll Number: {valuationResult.valuation.valuation_no_roll}</p>
                <p>Use: {valuationResult.valuation.actual_property_use}</p>
              </div>
            </div>
            <div className="market-analysis">
              <div className="analysis-header">
                <FaChartLine className="section-icon" />
                <h4>Market Analysis</h4>
              </div>
              <ul>
                <li>Located in {valuationResult.address.suburb_locality}, {valuationResult.address.town_city}</li>
                <li>{getPropertySizeCategory(valuationResult.valuation.building_total_floor_area)} property ({valuationResult.valuation.building_total_floor_area} m²)</li>
                <li>Land value: {getLandValuePercentage()}% of total value</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button className="generate-report-button" onClick={onGenerateReport}>
        Download Comprehensive Report
      </button>
    </div>
  );
};

export default ValuationReport;
