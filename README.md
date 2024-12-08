# Property Appraisal Analysis System

A comprehensive web application for analyzing New Zealand property valuations, featuring data processing, analysis, and visualization capabilities.

## Project Overview

This project provides a full-stack solution for processing and analyzing New Zealand's national district valuation roll data. It combines powerful backend processing with an interactive frontend interface to make property valuation data more accessible and insightful.

## Project Structure

```
property_appraisal/
├── back-end/               # FastAPI backend server
│   ├── llm/               # Language model integration
│   ├── main.py            # Main application entry
│   ├── database.py        # Database configuration
│   ├── models.py          # Database models
│   └── schemas.py         # Pydantic schemas
├── front-end/             # React TypeScript frontend
│   ├── src/              # Source code
│   └── public/           # Public assets
└── data_process/         # Data processing scripts and raw data
    └── nz-properties-national-district-valuation-roll.csv
```

## Technologies Used

### Backend
- FastAPI (v0.109.2)
- SQLAlchemy (v2.0.27)
- PostgreSQL
- Python 3.x
- LangChain + Anthropic for AI-powered analysis

### Frontend
- React 18
- TypeScript
- React Router DOM
- Modern UI components
- PDF Generation (jsPDF)

## Setup and Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd back-end
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure your database and API credentials

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- Property data processing and analysis
- Interactive data visualization
- AI-powered property insights
- PDF report generation
- Responsive web interface
- Secure database integration

## Data Sources

This demo project utilizes property data from various authoritative sources in New Zealand:

### Primary Data Sources
- **LINZ (Land Information New Zealand)**: The primary dataset used in this demo is sourced from LINZ's national district valuation roll
- **REINZ (Real Estate Institute of New Zealand)**: Property market data and trends (not included in demo)
- **Property Suite**: Comprehensive property information and analytics (not included in demo)

The demo version currently uses a subset of LINZ data with added data dictionary in the `data_process` folder. For a production environment, it's recommended to integrate with all mentioned data sources through their official APIs.

## Screenshots and Features

### 1. Homepage
![Homepage](screenshots/1.png)
Landing page showcasing the property analysis dashboard with key metrics and navigation options.

### 2. Generate Comprehensive Reports
![Generate comprehensive reports](screenshots/2.png)
Interface for generating detailed property reports with customizable parameters and filters.

### 3. Sale Methods Selection
![Sale Methods Selection](screenshots/3.png)
Selection interface for different property sale methods and analysis options.

### 4. Preview Report
![Preview Report](screenshots/4.png)
Preview interface showing the generated report before final download.

### 5. Report Generation
![Report Generation](screenshots/5.png)
Final report generation step with additional customization options.

### 6. Downloaded Property PDF
![Downloaded Property PDF](screenshots/6.png)
Example of the final PDF report with comprehensive property analysis and insights.

## Data Processing

The system processes the New Zealand property data, which includes:
- Property valuations
- Location data
- Property characteristics
- Historical valuation trends

## Generated Reports

The system can generate comprehensive property valuation reports (`property-valuation-report.pdf`) that include:
- Detailed property analysis
- Comparative market analysis
- Historical valuation trends
- AI-generated insights
- Location-based analytics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. Unauthorized copying or distribution of this project's files, via any medium, is strictly prohibited.

## Contact

For any queries regarding this project, please reach out to the project maintainers.
