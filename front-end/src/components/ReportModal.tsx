import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

interface ReportOptions {
  salesMethod: string;
  advertisement: string;
  targetBuyer: string;
}

interface ValuationResult {
  address: {
    address_id: string;
    full_address: string;
    town_city: string;
    suburb_locality: string;
    territorial_authority: string;
  };
  valuation: {
    capital_value: string;
    improvements_value: string;
    land_value: string;
    building_total_floor_area: string;
    improvements_description: string;
    property_category: string;
    unit_of_property_id: string;
    valuation_no_roll: string;
  };
  AI_content: {
    property_description: string;
    client_letter: string;
  };
}

interface ReportModalProps {
  onClose: () => void;
  valuationResult: ValuationResult;
}

const ReportModal: React.FC<ReportModalProps> = ({ onClose, valuationResult }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    salesMethod: '',
    advertisement: '',
    targetBuyer: '',
  });

  const handleReportOptionChange = (name: keyof ReportOptions, value: string) => {
    setReportOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const formatCurrency = (value: string) => {
    return `$${parseInt(value).toLocaleString()}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let currentY = 20;

    // Helper function to check and add new page if needed
    const checkAndAddPage = (requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - margin) {
        doc.addPage();
        currentY = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with page break handling
    const addText = (text: string, fontSize: number, color: number[], isHeader: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setTextColor(...color);
      
      if (isHeader) {
        checkAndAddPage(20);
        currentY += 20;
      } else {
        checkAndAddPage(10);
        currentY += 10;
      }
      
      if (Array.isArray(text)) {
        text.forEach((line) => {
          if (checkAndAddPage(7)) {
            // Reset text properties after new page
            doc.setFontSize(fontSize);
            doc.setTextColor(...color);
          }
          doc.text(line, margin, currentY);
          currentY += 7;
        });
      } else {
        doc.text(text, margin, currentY);
      }
    };

    // Title
    doc.setFontSize(20);
    doc.setTextColor(43, 108, 176);
    doc.text('Property Valuation Report', pageWidth / 2, currentY, { align: 'center' });
    currentY += 20;

    // Property Details
    addText('Property Details', 16, [43, 108, 176], true);
    addText([
      `Address: ${valuationResult.address.full_address}`,
      `Location: ${valuationResult.address.suburb_locality}, ${valuationResult.address.town_city}`,
      `Property Type: ${valuationResult.valuation.property_category}`,
      `Building Area: ${valuationResult.valuation.building_total_floor_area} m²`
    ], 12, [0, 0, 0]);

    // Valuation Details
    addText('Valuation Details', 16, [43, 108, 176], true);
    addText([
      `Estimated Value: ${formatCurrency(valuationResult.valuation.capital_value)}`,
      `Land Value: ${formatCurrency(valuationResult.valuation.land_value)}`,
      `Improvements Value: ${formatCurrency(valuationResult.valuation.improvements_value)}`
    ], 12, [0, 0, 0]);

    // AI Analysis
    addText('AI Market Analysis', 16, [43, 108, 176], true);
    
    // Property Description
    addText('Property Description:', 14, [0, 0, 0], true);
    const propertyDesc = doc.splitTextToSize(valuationResult.AI_content.property_description, contentWidth);
    addText(propertyDesc, 12, [0, 0, 0]);

    // Client Letter
    addText('Client Letter:', 14, [0, 0, 0], true);
    const clientLetter = doc.splitTextToSize(valuationResult.AI_content.client_letter, contentWidth);
    addText(clientLetter, 12, [0, 0, 0]);

    // Additional Information
    addText('Additional Information', 16, [43, 108, 176], true);
    addText([
      `Property ID: ${valuationResult.valuation.unit_of_property_id}`,
      `Roll Number: ${valuationResult.valuation.valuation_no_roll}`
    ], 12, [0, 0, 0]);

    // Sales Strategy
    if (reportOptions.salesMethod || reportOptions.targetBuyer) {
      addText('Sales Strategy', 16, [43, 108, 176], true);
      const salesInfo = [];
      if (reportOptions.salesMethod) {
        salesInfo.push(`Recommended Sales Method: ${reportOptions.salesMethod}`);
      }
      if (reportOptions.targetBuyer) {
        salesInfo.push(`Target Market: ${reportOptions.targetBuyer}`);
      }
      addText(salesInfo, 12, [0, 0, 0]);
    }

    // Footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    const today = new Date().toLocaleDateString();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated on ${today} - Page ${i} of ${pageCount}`, margin, pageHeight - 20);
    }

    // Save the PDF
    doc.save('property-valuation-report.pdf');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>

        {!showPreview ? (
          <div className="report-options">
            <h2>Generate Comprehensive Report</h2>
            <div className="step-indicator">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
            </div>

            {currentStep === 1 && (
              <div className="step-content">
                <h3>Select Sales Method</h3>
                <div className="option-group">
                  <label>
                    <input
                      type="radio"
                      name="salesMethod"
                      value="auction"
                      checked={reportOptions.salesMethod === 'auction'}
                      onChange={(e) => handleReportOptionChange('salesMethod', e.target.value)}
                    />
                    Auction
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="salesMethod"
                      value="negotiation"
                      checked={reportOptions.salesMethod === 'negotiation'}
                      onChange={(e) => handleReportOptionChange('salesMethod', e.target.value)}
                    />
                    Negotiation
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="salesMethod"
                      value="tender"
                      checked={reportOptions.salesMethod === 'tender'}
                      onChange={(e) => handleReportOptionChange('salesMethod', e.target.value)}
                    />
                    Tender
                  </label>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h3>Advertisement Preferences</h3>
                <div className="option-group">
                  <label>
                    <input
                      type="radio"
                      name="advertisement"
                      value="premium"
                      checked={reportOptions.advertisement === 'premium'}
                      onChange={(e) => handleReportOptionChange('advertisement', e.target.value)}
                    />
                    Premium Package
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="advertisement"
                      value="standard"
                      checked={reportOptions.advertisement === 'standard'}
                      onChange={(e) => handleReportOptionChange('advertisement', e.target.value)}
                    />
                    Standard Package
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="advertisement"
                      value="basic"
                      checked={reportOptions.advertisement === 'basic'}
                      onChange={(e) => handleReportOptionChange('advertisement', e.target.value)}
                    />
                    Basic Package
                  </label>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h3>Target Buyer Group</h3>
                <div className="option-group">
                  <label>
                    <input
                      type="radio"
                      name="targetBuyer"
                      value="firstHome"
                      checked={reportOptions.targetBuyer === 'firstHome'}
                      onChange={(e) => handleReportOptionChange('targetBuyer', e.target.value)}
                    />
                    First Home Buyers
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="targetBuyer"
                      value="investors"
                      checked={reportOptions.targetBuyer === 'investors'}
                      onChange={(e) => handleReportOptionChange('targetBuyer', e.target.value)}
                    />
                    Property Investors
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="targetBuyer"
                      value="families"
                      checked={reportOptions.targetBuyer === 'families'}
                      onChange={(e) => handleReportOptionChange('targetBuyer', e.target.value)}
                    />
                    Growing Families
                  </label>
                </div>
              </div>
            )}

            <div className="modal-actions">
              {currentStep > 1 && (
                <button onClick={handlePrevStep} className="secondary-button">
                  Previous
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="primary-button"
                disabled={
                  (currentStep === 1 && !reportOptions.salesMethod) ||
                  (currentStep === 2 && !reportOptions.advertisement) ||
                  (currentStep === 3 && !reportOptions.targetBuyer)
                }
              >
                {currentStep === 3 ? 'Preview Report' : 'Next'}
              </button>
            </div>
          </div>
        ) : (
          <div className="report-preview">
            <h2>Report Preview</h2>
            <div className="preview-content">
              <h3>Selected Options</h3>
              <p><strong>Sales Method:</strong> {reportOptions.salesMethod}</p>
              <p><strong>Advertisement Package:</strong> {reportOptions.advertisement}</p>
              <p><strong>Target Buyer Group:</strong> {reportOptions.targetBuyer}</p>

              <h3>Property Details</h3>
              <p><strong>Address:</strong> {valuationResult.address.full_address}</p>
              <p><strong>Estimated Value:</strong> ${parseInt(valuationResult.valuation.capital_value).toLocaleString()}</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowPreview(false)} className="secondary-button">
                Back to Options
              </button>
              <button onClick={generatePDF} className="primary-button">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
