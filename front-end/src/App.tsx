import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import About from './components/About';
import ReportModal from './components/ReportModal';
import ValuationReport from './components/ValuationReport';
import './App.css';
import { FaSearch, FaSpinner } from 'react-icons/fa';

interface FormData {
  address: string;
  propertyType: string;
  size: string;
  bedrooms: string;
}

interface ValuationResult {
  address: {
    full_address: string;
    suburb_locality: string;
    town_city: string;
    territorial_authority: string;
  };
  valuation: {
    capital_value: string;
    land_value: string;
    improvements_value: string;
    improvements_description: string;
    building_total_floor_area: string;
    property_category: string;
    unit_of_property_id: string;
    valuation_no_roll: string;
    no_of_bedrooms: string;
    actual_property_use: string;
  };
  AI_content: {
    property_description: string;
    client_letter: string;
  };
}

interface ReportOptions {
  salesMethod: string;
  advertisement: string;
  targetBuyer: string;
}

const MainContent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    address: '',
    propertyType: '',
    size: '',
    bedrooms: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setValuationResult(null);

    try {
      const response = await fetch('http://localhost:8000/properties/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch valuation data');
      }

      const data = await response.json();
      
      // Check if data is an array and has at least one result
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No property found with the given criteria');
      }

      const result = data[0]; // Take the first result

      // Validate the response data structure
      if (!result || !result.address || !result.valuation) {
        throw new Error('Invalid response data structure');
      }

      // Validate required fields
      if (!result.address.full_address || !result.valuation.capital_value) {
        throw new Error('Missing required valuation data');
      }

      setValuationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setValuationResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <section className="search-section">
        <h1>Property Appraisal</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address" className="required">Address</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                placeholder="Enter property address"
              />
            </div>
            <div className="form-group">
              <label htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
              >
                <option value="">Select type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="size">Size (m²)</label>
              <input
                type="number"
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                placeholder="Size"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bedrooms">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                placeholder="Beds"
                min="0"
              />
            </div>
            <button type="submit" className="submit-button primary-button">
              Get Valuation
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <span className="loading-pulse">Analyzing property data</span>
            <span className="loading-dots"></span>
          </div>
        </div>
      )}

      {valuationResult && valuationResult.address && valuationResult.valuation && (
        <>
          <ValuationReport 
            valuationResult={valuationResult}
            onGenerateReport={() => setShowReportModal(true)}
          />

          {showReportModal && (
            <ReportModal
              onClose={() => setShowReportModal(false)}
              valuationResult={valuationResult}
            />
          )}
        </>
      )}
    </main>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/" element={<MainContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
