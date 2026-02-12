# DataFuel Application Analysis

## Overview
DataFuel is a comprehensive Amazon seller and advertising analytics platform that integrates with Amazon MWS API and Amazon Advertising API to provide detailed performance insights and automation tools.

## Authentication & Account Management

### Login System
- Email/password authentication
- User: rohanpatil7972@gmail.com
- Secure session management
- User profile: "Rohan Lotan Ahire"

### Account Management
- **URL**: `/accounts`
- **Connected Account**: "Freshdcart" (India marketplace)
- **Account Type**: Seller
- **Status**: Synced, Active
- **Permissions**: 
  - ADS (Amazon Advertising) ✓
  - SELLER/VENDOR (Amazon MWS) ✓
  - Shared permissions
- **Features**:
  - "Scan for New Accounts" functionality
  - "Connect New Account" dropdown
  - Account filtering (Type, Marketplace, Sync Status, Active Status)
  - Search functionality

## Navigation Structure

### Main Navigation Menu
1. **Dashboard** (`/dashboard/ads`) - Main performance overview
2. **Daily Report** (`/dashboard/total`) - Daily performance metrics
3. **Opportunity Keywords** (`/dashboard/duplicate-keywords`) - Keyword optimization
4. **SQP** (`/dashboard/search-query-performance`) - Search Query Performance
5. **N-gram Analysis** (`/dashboard/n-gram-analysis`) - Keyword analysis
6. **Automation** (expandable)
   - Automation (`/dashboard/automation`)
   - Advanced (`/dashboard/automation/advanced`)
7. **Smart Labels** (`/dashboard/smart-labels`) - Product categorization
8. **Synopsis** (expandable)
   - Dashboard (`/dashboard/synopsis/live`) - Live performance synopsis
   - Reports (`/dashboard/synopsis/reports`) - Historical reports
9. **Campaign X** (`/dashboard/campaign-creator`) - Campaign creation tool
10. **Day Parting** (`/dashboard/day-parting`) - Time-based optimization
11. **Keyword Tracker** (expandable menu)
12. **Alerts** (`/dashboard/alerts`) - Performance alerts
13. **Account Settings** (`/dashboard/account-settings`) - Configuration

## Core Features Analysis

### 1. Main Dashboard (`/dashboard/ads`)

#### Key Performance Metrics (Top Cards)
- **Total Sales**: ₹1,299,945.55 (+6.32%)
- **Total Orders**: 4,330 (+5.76%)
- **Units Sold**: 4,834 (+6.13%)
- **AOV (Average Order Value)**: ₹300.22 (+0.53%)
- **CVR (Conversion Rate)**: 9.06% (+0.15%)

#### Advertising Metrics
- **Ad Spend**: ₹116,184.71 (+9.20%)
- **ACoS (Advertising Cost of Sales)**: 27.09% (-7.48%)
- **TACoS (Total Advertising Cost of Sales)**: 8.94% (-1.53%)
- **RoAS (Return on Ad Spend)**: 3.69 (+27.68%)
- **Impressions**: 2,563,376 (+12.26%)
- **Clicks**: 17,390 (+8.83%)
- **CPC (Cost Per Click)**: ₹6.68 (-16.60%)
- **CTR (Click Through Rate)**: 0.68% (-0.02%)
- **CPA (Cost Per Acquisition)**: ₹73.72 (-15.24%)

#### Order Distribution
- **Total Orders**: 4,330
- **Ad Orders**: 1,576 (+7.14%)
- **Organic Orders**: 2,754 (+4.99%)
- Visual donut chart representation

#### Performance Trend Chart
- Line chart showing daily trends
- Toggle between "Total Sales" and "Ad Sales"
- Date range: Nov 29 - Dec 5, 2025

#### Product Level Analysis Table
- Comprehensive product performance data
- **Columns**: Rank, Product Name, Revenue (Total/Ad/Organic), Spend, Orders, Units, CR%, CTR%, AOV, ROAS, ACOS, TACOS, CPC
- **Features**:
  - Product images and ASINs
  - Percentage change indicators
  - Pagination (Page 1 of 16)
  - "Group by Parent" toggle
  - Export functionality
  - Search functionality
  - Sortable columns

### 2. Synopsis Dashboard (`/dashboard/synopsis/live`)

#### Performance Overview Cards
- **Total Sales**: ₹1,299,945.55 (+6.32%)
- **Organic Sales**: ₹871,070.04 (+2.17%)
- **Ad Sales**: ₹428,875.51 (+15.88%)
- **Total Orders**: 4,330 (+5.76%)
- **Organic Orders**: 2,754 (+4.99%)
- **Ad Orders**: 1,576 (+7.14%)
- **TACoS**: 8.94% (-1.53%)
- **ACoS**: 27.09% (-7.48%)

#### Additional Metrics
- **Spend**: ₹116,184.71 (-9.20%)
- **RoAS**: 3.69 (+0.80%)
- **Clicks**: 17,390 (+8.83%)
- **CTR**: 0.68% (-0.02%)
- **Impressions**: 2,563,376 (+12.26%)
- **CPC**: ₹6.68 (-16.56%)
- **CPO**: ₹73.72 (-15.25%)
- **Conversion Rate**: 9.06% (-0.14%)

#### Detailed Analysis Tables

##### Ad Type Synopsis
- **SP (Sponsored Products)**: Dominant ad type
  - Impressions: 1,821,763 (+11.50%)
  - Clicks: 13,753 (+5.96%)
  - CTR: 0.75%
  - Spend: ₹96,728.22 (+20.63%)
  - CPC: ₹7.03
  - CR: 10.01%
  - Orders: 1,376
  - Sales: ₹358,915.58 (+5.66%)
  - ACoS: 26.95%
  - RoAS: 3.71

- **SB (Sponsored Brands)**: Secondary ad type
  - Impressions: 544,584 (+219.24%)
  - Clicks: 2,985 (+151.69%)
  - CTR: 0.55%
  - Spend: ₹15,849.31 (+197.72%)
  - CPC: ₹5.31
  - CR: 3.92%
  - Orders: 117 (+51.95%)
  - Sales: ₹43,846.59 (+70.79%)
  - ACoS: 36.15%
  - RoAS: 2.77

- **SD (Sponsored Display)**: Smallest ad type
  - Impressions: 197,029 (+262.57%)
  - Clicks: 652 (+288.10%)
  - CTR: 0.33%
  - Spend: ₹3,607.18 (+370.61%)
  - CPC: ₹5.53
  - CR: 12.73%
  - Orders: 83 (+388.24%)
  - Sales: ₹26,113.34 (+453.17%)
  - ACoS: 13.81%
  - RoAS: 7.24

##### Additional Analysis Sections
1. **Targeting Type Breakdown** (Loading...)
2. **Match Type Performance** (Loading...)
3. **Placement Performance** (Loading...)
4. **Portfolio Level Performance** (Loading...)
5. **Campaign Level Performance** (Loading...)
6. **Ad Group Level Performance** - Shows detailed ad group data with 10 visible entries, pagination (Page 1 of 21)
7. **Keyword Level Performance** (Loading...)
8. **Search Term Level** (Loading...)
9. **Advertised Product Level** (Loading...)

### 3. Synopsis Reports (`/dashboard/synopsis/reports`)

#### Performance Trend Chart
- Interactive line chart with date range Nov 5 - Dec 5, 2025
- **Selectable Metrics**:
  - Sales ✓ (currently selected)
  - Spend, Clicks, Impressions, RoAS, ACoS, CPC, CVR, Orders, Units Sold, CTR, CPO, AOV, Top Of Search IS

#### Campaign Report Table
- **Columns**: Campaign Name, Type, Status, Spend, Sales, Orders, ACoS, RoAS, Impressions, Clicks, CTR, CPC, CVR, CPO, AOV
- **Sample Campaigns**:
  - "Frehsdcart-Inventory ASINS-Catch alls" (SP, ENABLED)
  - "Freshdcart-High Inventory-Defensive" (SP, ENABLED)
  - "SP-FreshDcart-M-(BPE)-tally counter" (SP, ENABLED)
  - And more...
- **Features**:
  - Performance change indicators (↑/↓ with percentages)
  - Pagination (Page 1 of 26)
  - Filter campaigns functionality
  - View and Filters options

#### Additional Report Tabs
1. **Campaigns** (currently active)
2. **Keywords**
3. **Search Terms**
4. **Products**

#### Visualization Components
1. **Campaign Type Breakdown** - Pie chart showing SD, SP, SB distribution
2. **Top Performing Campaigns** - Performance categorization with Target ACoS setting (30%)

## Amazon API Integration Points

### Amazon MWS API (Seller API)
- **Account Connection**: Seller/Vendor permissions enabled
- **Data Retrieved**:
  - Product catalog information
  - Sales data (organic sales, orders, units sold)
  - Inventory levels
  - Product ASINs and details
  - Marketplace information (India)

### Amazon Advertising API (Partner API)
- **Account Connection**: ADS permissions enabled
- **Data Retrieved**:
  - Campaign performance data (SP, SB, SD)
  - Ad group performance
  - Keyword performance and bidding
  - Search term reports
  - Targeting data
  - Placement performance
  - Portfolio management
  - Budget and bid management

### Data Synchronization
- **Status**: "synced, active"
- **Real-time Updates**: Performance metrics with percentage changes
- **Historical Data**: Date range selections and trend analysis
- **Account Scanning**: "Scan for New Accounts" functionality

## Technical Architecture Observations

### Frontend Technology
- Modern React-based SPA (Single Page Application)
- Responsive design with sidebar navigation
- Interactive charts and data visualizations
- Real-time data updates
- Advanced filtering and search capabilities

### Data Processing
- **Metrics Calculation**: Complex KPI calculations (ACoS, TACoS, RoAS, etc.)
- **Performance Comparisons**: Period-over-period analysis with percentage changes
- **Data Aggregation**: Multiple levels (account, campaign, ad group, keyword, product)
- **Export Functionality**: Data export capabilities

### User Experience Features
- **Date Range Selection**: Flexible date range picker
- **Interactive Tables**: Sortable columns, pagination, search
- **Visual Analytics**: Charts, graphs, and performance indicators
- **Filtering**: Advanced filtering options across multiple dimensions
- **Responsive Design**: Works across different screen sizes

## Key Business Intelligence Features

### Performance Monitoring
1. **Multi-level Analytics**: Account → Campaign → Ad Group → Keyword → Product
2. **Cross-channel Insights**: Organic vs. Paid performance comparison
3. **Trend Analysis**: Historical performance tracking with visual charts
4. **Anomaly Detection**: Performance change indicators

### Optimization Tools
1. **Keyword Analysis**: Opportunity keywords, duplicate detection, N-gram analysis
2. **Campaign Management**: Campaign creator, day parting
3. **Automation**: Bid management and optimization rules
4. **Smart Labels**: Product categorization and management

### Reporting & Analytics
1. **Synopsis Dashboard**: Real-time performance overview
2. **Detailed Reports**: Historical analysis with multiple dimensions
3. **Export Capabilities**: Data export for further analysis
4. **Custom Filtering**: Advanced filtering across all data dimensions

## Data Flow Architecture

### Data Sources
1. **Amazon MWS API** → Seller/Vendor data (sales, inventory, products)
2. **Amazon Advertising API** → Advertising data (campaigns, keywords, performance)

### Data Processing
1. **Data Ingestion** → API calls and data synchronization
2. **Data Transformation** → Metric calculations and aggregations
3. **Data Storage** → Processed data storage for quick retrieval
4. **Real-time Updates** → Continuous data refresh and change tracking

### User Interface
1. **Dashboard Views** → Multiple specialized dashboards
2. **Interactive Reports** → Flexible reporting with filtering
3. **Export Functions** → Data export capabilities
4. **Alert System** → Performance monitoring and notifications

This analysis provides a comprehensive overview of the DataFuel application's functionality, architecture, and integration with Amazon's APIs.