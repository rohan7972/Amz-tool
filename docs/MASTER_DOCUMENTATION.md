# Amazon FDC Tool - Master Documentation

## Project Overview

**Project Name**: Amazon FDC Tool (Fulfillment Data Center Tool)
**Purpose**: A comprehensive Amazon seller and advertising analytics platform that replicates DataFuel's functionality
**Target**: Amazon sellers who need detailed performance insights, automation tools, and business intelligence

## Application Analysis Summary

### DataFuel Application Structure
Based on our analysis of https://app.datafuel.tech, the application consists of:

#### Core Features Identified:
1. **Multi-account Amazon integration** (MWS API + Advertising API)
2. **Real-time performance dashboards** with KPI cards and trend charts
3. **Comprehensive reporting system** with multiple data dimensions
4. **Advanced filtering and search capabilities**
5. **Data export functionality**
6. **Automation tools** for bid management and optimization
7. **Alert system** for performance monitoring

#### User Account Analyzed:
- **Email**: rohanpatil7972@gmail.com
- **Connected Account**: "Freshdcart" (India marketplace)
- **Account Type**: Seller with advertising permissions
- **Status**: Active, synced

## Complete Page Structure & UI Designs

### 1. Authentication Pages

#### Login Page (`/login`)
```
UI Layout:
┌─────────────────────────────────────────┐
│                DataFuel                 │
│                  Logo                   │
├─────────────────────────────────────────┤
│                                         │
│     ┌─────────────────────────────┐     │
│     │        Login Form           │     │
│     │                             │     │
│     │  Email: [________________]  │     │
│     │                             │     │
│     │  Password: [_____________]  │     │
│     │                             │     │
│     │  [ ] Remember me            │     │
│     │                             │     │
│     │     [    Login Button   ]   │     │
│     │                             │     │
│     │  Forgot Password? | Sign Up │     │
│     └─────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘

Components:
- Centered login form with email/password fields
- Remember me checkbox
- Login button with loading state
- Links to forgot password and sign up
- Clean, minimal design with DataFuel branding
```

### 2. Account Management Page (`/accounts`)

#### Accounts Overview
```
UI Layout:
┌─────────────────────────────────────────────────────────────────┐
│  DataFuel    [Account Dropdown ▼]  [Notifications] [User Menu]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Manage Accounts                                                │
│                                                                 │
│  [Scan for New Accounts] [Connect New Account ▼]               │
│                                                                 │
│  Filters: [Type ▼] [Marketplace ▼] [Sync Status ▼] [Active ▼]  │
│  Search: [_________________________] [🔍]                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Account Cards Grid                                      │   │
│  │                                                         │   │
│  │ ┌─────────────────┐  ┌─────────────────┐               │   │
│  │ │   Freshdcart    │  │   [Add New]     │               │   │
│  │ │     India       │  │     Account     │               │   │
│  │ │                 │  │                 │               │   │
│  │ │ Type: Seller    │  │      [+]        │               │   │
│  │ │ Status: ✓ Synced│  │                 │               │   │
│  │ │ Permissions:    │  │                 │               │   │
│  │ │ ✓ ADS ✓ SELLER  │  │                 │               │   │
│  │ │                 │  │                 │               │   │
│  │ │ [Manage] [Edit] │  │   [Connect]     │               │   │
│  │ └─────────────────┘  └─────────────────┘               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Components:
- Header with account selector and user menu
- Action buttons for scanning and connecting accounts
- Filter bar with multiple filter options
- Search functionality
- Grid layout of account cards showing:
  - Account name and marketplace
  - Account type (Seller/Vendor)
  - Sync status with visual indicators
  - Permissions (ADS, SELLER/VENDOR)
  - Action buttons (Manage, Edit)
- Add new account card with connection flow
```

### 3. Main Dashboard (`/dashboard/ads`)

#### Primary Dashboard Layout
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ DataFuel  [Freshdcart India ▼]     Navigation Menu     [Notifications] [User ▼]    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ Dashboard                                    [Nov 29 - Dec 5, 2025 ▼]              │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                           KPI Metrics Cards (4x2 Grid)                         │ │
│ │                                                                                 │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │Total Sales  │ │Total Orders │ │Units Sold   │ │    AOV      │               │ │
│ │ │₹1,299,945.55│ │    4,330    │ │   4,834     │ │  ₹300.22    │               │ │
│ │ │  ↑ 6.32%    │ │  ↑ 5.76%    │ │  ↑ 6.13%    │ │  ↑ 0.53%    │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ │                                                                                 │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │ Ad Spend    │ │    ACoS     │ │    RoAS     │ │Impressions  │               │ │
│ │ │₹116,184.71  │ │   27.09%    │ │    3.69     │ │ 2,563,376   │               │ │
│ │ │  ↑ 9.20%    │ │  ↓ 7.48%    │ │ ↑ 27.68%    │ │ ↑ 12.26%    │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                              Charts Section                                     │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────┐ ┌─────────────────────────────────────┐ │ │
│ │ │        Performance Trend            │ │      Order Distribution             │ │ │
│ │ │                                     │ │                                     │ │ │
│ │ │ [Total Sales ▼] [Ad Sales]          │ │     Total Orders: 4,330             │ │ │
│ │ │                                     │ │                                     │ │ │
│ │ │     ╭─╮                             │ │        ┌─────────────┐               │ │ │
│ │ │    ╱   ╲     ╭─╮                    │ │        │             │               │ │ │
│ │ │   ╱     ╲   ╱   ╲                   │ │        │  Ad Orders  │               │ │ │
│ │ │  ╱       ╲ ╱     ╲                  │ │        │    1,576    │               │ │ │
│ │ │ ╱         ╲       ╲                 │ │        │             │               │ │ │
│ │ │╱           ╲       ╲                │ │        └─────────────┘               │ │ │
│ │ │             ╲       ╲               │ │                                     │ │ │
│ │ │              ╲       ╲              │ │      Organic Orders: 2,754          │ │ │
│ │ │               ╲       ╲             │ │                                     │ │ │
│ │ │                ╲       ╲            │ │                                     │ │ │
│ │ │                 ╲_______╲___        │ │                                     │ │ │
│ │ │ Nov29  Nov30  Dec1  Dec2  Dec3     │ │                                     │ │ │
│ │ └─────────────────────────────────────┘ └─────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                        Product Level Analysis                                   │ │
│ │                                                                                 │ │
│ │ [Group by Parent ☐] [Export ▼] [Search: ________________] [Filters ▼]          │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │Rank│Product Name    │Revenue│Spend │Orders│Units│CR%│CTR%│AOV  │ROAS│ACoS│  │ │ │
│ │ ├────┼────────────────┼───────┼──────┼──────┼─────┼───┼────┼─────┼────┼────┤  │ │ │
│ │ │ 1  │[IMG] Product A │₹50K   │₹10K  │ 150  │ 200 │8.5│0.6 │₹333 │5.0 │20% │  │ │ │
│ │ │    │B07NY4W7RL      │↑15%   │↑5%   │↑12%  │↑8%  │   │    │     │    │    │  │ │ │
│ │ ├────┼────────────────┼───────┼──────┼──────┼─────┼───┼────┼─────┼────┼────┤  │ │ │
│ │ │ 2  │[IMG] Product B │₹45K   │₹12K  │ 120  │ 180 │7.2│0.8 │₹375 │3.8 │27% │  │ │ │
│ │ │    │B08XYZ123AB     │↓3%    │↑8%   │↓5%   │↓2%  │   │    │     │    │    │  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│ │                                                                                 │ │
│ │ Page 1 of 16    [< Previous] [1] [2] [3] ... [16] [Next >]                     │ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

Components:
- Header with account selector and date range picker
- 8 KPI metric cards in 4x2 grid with values and change indicators
- Performance trend chart with metric selector
- Order distribution donut chart
- Product performance table with:
  - Product images and ASINs
  - Revenue, spend, orders, units data
  - Performance metrics (CR%, CTR%, AOV, ROAS, ACoS)
  - Change indicators (↑/↓ with percentages)
  - Pagination controls
  - Search and filter functionality
```

### 4. Synopsis Dashboard (`/dashboard/synopsis/live`)

#### Synopsis Live Dashboard
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ DataFuel  [Freshdcart India ▼]     Navigation Menu     [Notifications] [User ▼]    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ Synopsis Dashboard                           [Nov 29 - Dec 5, 2025 ▼]              │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                        Performance Overview Cards                               │ │
│ │                                                                                 │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │Total Sales  │ │Organic Sales│ │ Ad Sales    │ │Total Orders │               │ │
│ │ │₹1,299,945.55│ │₹871,070.04  │ │₹428,875.51  │ │    4,330    │               │ │
│ │ │  ↑ 6.32%    │ │  ↑ 2.17%    │ │ ↑ 15.88%    │ │  ↑ 5.76%    │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ │                                                                                 │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │Organic Orders│ │ Ad Orders   │ │   TACoS     │ │    ACoS     │               │ │
│ │ │    2,754     │ │    1,576    │ │   8.94%     │ │   27.09%    │               │ │
│ │ │  ↑ 4.99%     │ │  ↑ 7.14%    │ │  ↓ 1.53%    │ │  ↓ 7.48%    │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                           Ad Type Synopsis                                      │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │Campaign Type│Impressions │Clicks│CTR │Spend    │CPC │CR  │Orders│Sales    │  │ │ │
│ │ ├─────────────┼────────────┼──────┼────┼─────────┼────┼────┼──────┼─────────┤  │ │ │
│ │ │SP           │1,821,763   │13,753│0.75│₹96,728  │₹7.03│10.01│1,376 │₹358,915│  │ │ │
│ │ │             │↑11.50%     │↑5.96%│    │↑20.63%  │    │    │      │↑5.66%  │  │ │ │
│ │ ├─────────────┼────────────┼──────┼────┼─────────┼────┼────┼──────┼─────────┤  │ │ │
│ │ │SB           │544,584     │2,985 │0.55│₹15,849  │₹5.31│3.92│117   │₹43,846 │  │ │ │
│ │ │             │↑219.24%    │↑151% │    │↑197.72% │    │    │↑51.95│↑70.79% │  │ │ │
│ │ ├─────────────┼────────────┼──────┼────┼─────────┼────┼────┼──────┼─────────┤  │ │ │
│ │ │SD           │197,029     │652   │0.33│₹3,607   │₹5.53│12.73│83   │₹26,113 │  │ │ │
│ │ │             │↑262.57%    │↑288% │    │↑370.61% │    │    │↑388% │↑453.17%│  │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                        Detailed Analysis Sections                              │ │
│ │                                                                                 │ │
│ │ [Targeting Type ▼] [Match Type ▼] [Placement ▼] [Portfolio ▼] [Campaign ▼]     │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │                        Ad Group Level Performance                           │ │ │
│ │ │                                                                             │ │ │
│ │ │ [Search: ________________] [Filters ▼] [Export ▼]                           │ │ │
│ │ │                                                                             │ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │Ad Group Name    │Campaign│Impressions│Clicks│Spend │Sales │ACoS │RoAS │ │ │ │ │
│ │ │ ├─────────────────┼────────┼───────────┼──────┼──────┼──────┼─────┼─────┤ │ │ │ │
│ │ │ │Counter-Exact    │Camp-A  │45,234     │1,234 │₹5,678│₹12,345│46% │2.17│ │ │ │ │
│ │ │ │Thermometer-BM   │Camp-B  │32,156     │987   │₹4,321│₹9,876 │44% │2.28│ │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────────────────┘ │ │ │
│ │ │                                                                             │ │ │
│ │ │ Page 1 of 21    [< Previous] [1] [2] [3] ... [21] [Next >]                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

Components:
- Enhanced KPI cards with organic vs paid breakdown
- Ad type performance table (SP, SB, SD) with detailed metrics
- Expandable analysis sections for different data dimensions
- Ad group level performance table with pagination
- Advanced filtering and search capabilities
- Export functionality for all data tables
```

### 5. Synopsis Reports (`/dashboard/synopsis/reports`)

#### Reports Dashboard
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ DataFuel  [Freshdcart India ▼]     Navigation Menu     [Notifications] [User ▼]    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│ Synopsis Reports                             [Nov 5 - Dec 5, 2025 ▼]               │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                        Performance Trend Chart                                  │ │
│ │                                                                                 │ │
│ │ Metrics: [☑Sales] [☐Spend] [☐Clicks] [☐Impressions] [☐RoAS] [☐ACoS] [☐CPC]    │ │
│ │          [☐CVR] [☐Orders] [☐Units Sold] [☐CTR] [☐CPO] [☐AOV] [☐Top Of Search]  │ │
│ │                                                                                 │ │
│ │     ₹1,00,000 ┌─────────────────────────────────────────────────────────────┐  │ │
│ │               │                                                             │  │ │
│ │     ₹75,000   │     ╭─╮                                                     │  │ │
│ │               │    ╱   ╲     ╭─╮                                            │  │ │
│ │     ₹50,000   │   ╱     ╲   ╱   ╲                                           │  │ │
│ │               │  ╱       ╲ ╱     ╲                                          │  │ │
│ │     ₹25,000   │ ╱         ╲       ╲                                         │  │ │
│ │               │╱           ╲       ╲                                        │  │ │
│ │     ₹0        │             ╲       ╲_______                               │  │ │
│ │               └─────────────────────────────────────────────────────────────┘  │ │
│ │                Nov5  Nov10  Nov15  Nov20  Nov25  Nov30  Dec5                  │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                           Report Tabs                                          │ │
│ │                                                                                 │ │
│ │ [Campaigns] [Keywords] [Search Terms] [Products]                               │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────────────────────┐ │ │
│ │ │                        Campaign Report                                      │ │ │
│ │ │                                                                             │ │ │
│ │ │ [Filter campaigns...] [View ▼] [Filters ▼]                                 │ │ │
│ │ │                                                                             │ │ │
│ │ │ ┌─────────────────────────────────────────────────────────────────────────┐ │ │ │
│ │ │ │Campaign Name        │Type│Status │Spend   │Sales   │Orders│ACoS │RoAS │ │ │ │ │
│ │ │ ├─────────────────────┼────┼───────┼────────┼────────┼──────┼─────┼─────┤ │ │ │ │
│ │ │ │Inventory ASINS      │SP  │ENABLED│₹33,573 │₹161,717│611   │20.76│4.82 │ │ │ │ │
│ │ │ │Catch alls           │    │       │↑53.10% │↑58.37% │↑51.24│↓0.71│↑16% │ │ │ │ │
│ │ │ ├─────────────────────┼────┼───────┼────────┼────────┼──────┼─────┼─────┤ │ │ │ │
│ │ │ │High Inventory       │SP  │ENABLED│₹19,981 │₹88,658 │347   │22.54│4.44 │ │ │ │ │
│ │ │ │Defensive            │    │       │↑88.65% │↑76.49% │↑71.78│↑1.45│↓30% │ │ │ │ │
│ │ │ └─────────────────────────────────────────────────────────────────────────┘ │ │ │
│ │ │                                                                             │ │ │
│ │ │ Page 1 of 26    [< Previous] [1] [2] [3] ... [26] [Next >]                 │ │ │
│ │ └─────────────────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                        Visualization Components                                │ │ │
│ │                                                                                 │ │
│ │ ┌─────────────────────────────────┐ ┌─────────────────────────────────────────┐ │ │
│ │ │    Campaign Type Breakdown      │ │      Top Performing Campaigns          │ │ │
│ │ │                                 │ │                                         │ │ │
│ │ │        ┌─────────┐               │ │ Target ACoS (%): [30] [Apply]           │ │ │
│ │ │        │   SP    │               │ │                                         │ │ │
│ │ │        │  85%    │               │ │     ┌─────────────────────────────────┐ │ │ │
│ │ │        └─────────┘               │ │     │        Performance Chart        │ │ │ │
│ │ │     ┌──────┐  ┌──────┐           │ │     │                                 │ │ │ │
│ │ │     │  SB  │  │  SD  │           │ │     │ ■ Best    ■ Medium   ■ Worst   │ │ │ │
│ │ │     │ 10%  │  │  5%  │           │ │     │                                 │ │ │ │
│ │ │     └──────┘  └──────┘           │ │     └─────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────┘ └─────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘

Components:
- Interactive performance trend chart with multiple metric toggles
- Tabbed interface for different report types (Campaigns, Keywords, Search Terms, Products)
- Campaign report table with comprehensive metrics and change indicators
- Advanced filtering and search functionality
- Campaign type breakdown pie chart
- Top performing campaigns analysis with target ACoS setting
- Pagination for large datasets
- Export capabilities for all reports
```

### 6. Navigation Menu Structure

#### Sidebar Navigation
```
Navigation Menu:
├── Dashboard (🏠)
├── Daily Report (📊)
├── Opportunity Keywords (🔍)
├── SQP (Search Query Performance) (📈)
├── N-gram Analysis (📝)
├── Automation (⚙️)
│   ├── Automation
│   └── Advanced
├── Smart Labels (🏷️)
├── Synopsis (📋)
│   ├── Dashboard
│   └── Reports
├── Campaign X (🚀)
├── Day Parting (🕐)
├── Keyword Tracker (📊)
├── Alerts (🔔)
└── Account Settings (⚙️)

Bottom Section:
└── Manage Accounts (👥)

Each menu item includes:
- Icon representation
- Text label
- Expandable submenu (where applicable)
- Active state highlighting
- Hover effects
```

## KPI Calculations & Business Logic

### Core Metrics Formulas

#### 1. Sales Metrics
```typescript
// Total Sales = Organic Sales + Ad Sales
totalSales = organicSales + adSales

// Organic Sales = Sales not attributed to advertising
organicSales = totalSales - adSales

// Ad Sales = Sales attributed to advertising campaigns
adSales = sum(campaignSales)

// Average Order Value (AOV)
aov = totalSales / totalOrders

// Revenue per Unit
revenuePerUnit = totalSales / unitsSold
```

#### 2. Advertising Metrics
```typescript
// Advertising Cost of Sales (ACoS)
acos = (adSpend / adSales) * 100

// Total Advertising Cost of Sales (TACoS)
tacos = (adSpend / totalSales) * 100

// Return on Ad Spend (RoAS)
roas = adSales / adSpend

// Cost Per Click (CPC)
cpc = adSpend / clicks

// Click Through Rate (CTR)
ctr = (clicks / impressions) * 100

// Conversion Rate (CVR)
cvr = (orders / clicks) * 100

// Cost Per Order (CPO)
cpo = adSpend / orders

// Cost Per Acquisition (CPA)
cpa = adSpend / orders
```

#### 3. Performance Metrics
```typescript
// Impression Share
impressionShare = (impressions / totalAvailableImpressions) * 100

// Top of Search Impression Share
topOfSearchIS = (topOfSearchImpressions / totalTopOfSearchImpressions) * 100

// Search Rank (estimated)
searchRank = calculateRankFromImpressionShare(impressionShare)

// Bid Efficiency
bidEfficiency = (actualCPC / maxBid) * 100

// Quality Score (estimated)
qualityScore = estimateQualityScore(ctr, conversionRate, relevance)
```

#### 4. Trend Calculations
```typescript
// Period over Period Change
periodChange = ((currentValue - previousValue) / previousValue) * 100

// Moving Average (7-day, 30-day)
movingAverage = sum(values) / numberOfDays

// Growth Rate
growthRate = ((endValue - startValue) / startValue) * 100

// Compound Annual Growth Rate (CAGR)
cagr = Math.pow((endValue / startValue), (1 / years)) - 1
```

#### 5. Profitability Metrics
```typescript
// Profit Margin
profitMargin = ((sales - costs) / sales) * 100

// Break-even ACoS
breakEvenACoS = profitMargin

// Target ACoS (for profitability)
targetACoS = profitMargin * targetProfitPercentage

// Advertising Efficiency
adEfficiency = (adSales - adSpend) / adSpend

// Return on Investment (ROI)
roi = ((adSales - adSpend) / adSpend) * 100
```

### Data Aggregation Logic

#### 1. Time-based Aggregation
```typescript
// Daily aggregation
dailyMetrics = {
  date: date,
  sales: sum(orderSales.where(date = date)),
  orders: count(orders.where(date = date)),
  units: sum(orderItems.where(date = date)),
  adSpend: sum(campaignSpend.where(date = date)),
  impressions: sum(campaignImpressions.where(date = date)),
  clicks: sum(campaignClicks.where(date = date))
}

// Weekly aggregation
weeklyMetrics = aggregateByWeek(dailyMetrics)

// Monthly aggregation
monthlyMetrics = aggregateByMonth(dailyMetrics)
```

#### 2. Campaign-level Aggregation
```typescript
// Campaign performance
campaignMetrics = {
  campaignId: campaignId,
  impressions: sum(adGroupImpressions),
  clicks: sum(adGroupClicks),
  spend: sum(adGroupSpend),
  sales: sum(attributedSales),
  orders: sum(attributedOrders),
  acos: (spend / sales) * 100,
  roas: sales / spend,
  ctr: (clicks / impressions) * 100,
  cvr: (orders / clicks) * 100
}
```

#### 3. Product-level Aggregation
```typescript
// Product performance
productMetrics = {
  asin: asin,
  organicSales: sum(orderSales.where(asin = asin AND source = 'organic')),
  adSales: sum(orderSales.where(asin = asin AND source = 'advertising')),
  totalSales: organicSales + adSales,
  organicOrders: count(orders.where(asin = asin AND source = 'organic')),
  adOrders: count(orders.where(asin = asin AND source = 'advertising')),
  totalOrders: organicOrders + adOrders,
  adSpend: sum(campaignSpend.where(targetedAsin = asin)),
  acos: (adSpend / adSales) * 100,
  tacos: (adSpend / totalSales) * 100
}
```

## 7. Admin Panel (`/admin/*`)

### Admin Dashboard (`/admin/dashboard`)
```
UI Layout: System overview cards + Activity feed + Health monitoring
Features: User metrics, API usage, system performance, real-time monitoring
KPIs: Total users, active accounts, API calls, revenue, system load, uptime
```

### User Management (`/admin/users`)
```
UI Layout: User table with filters + User details modal + Bulk actions
Features: Add/edit users, role management, permissions, account status
RBAC: Super Admin, Admin, Manager, User roles with granular permissions
```

### API Key Management (`/admin/api-keys`)
```
UI Layout: API configuration panels + User-specific keys table + Test tools
Features: SP-API setup, Advertising API config, key rotation, marketplace settings
Security: Encrypted storage, token rotation, rate limiting, usage monitoring
```

### App Settings (`/admin/settings`)
```
UI Layout: Tabbed settings interface + Configuration forms + Test tools
Features: General settings, data sync, email config, performance tuning
Options: Timezone, currency, sync frequency, retention policies, SMTP setup
```

### Parameter Logic Editor (`/admin/formulas`)
```
UI Layout: Formula categories + Expression editor + Test interface
Features: Custom KPI formulas, validation rules, variable definitions
Formulas: Sales metrics, advertising metrics, performance calculations
```

### Features Management (`/admin/features`)
```
UI Layout: Feature toggle grid + Configuration modals + Rollout controls
Features: Feature flags, A/B testing, gradual rollouts, user targeting
Control: Enable/disable features, beta testing, premium feature access
```

### Gemini AI Integration (`/admin/ai-settings`)
```
UI Layout: AI configuration + Report templates + Usage analytics
Features: API setup, custom prompts, automated reports, cost monitoring
Reports: Performance analysis, keyword optimization, anomaly detection
```

### System Monitoring (`/admin/monitoring`)
```
UI Layout: Real-time metrics + Error logs + Performance charts
Features: Server health, database performance, API monitoring, alerts
Metrics: CPU/memory usage, response times, error rates, system logs
```

## Data Synchronization Strategy

### 1. Amazon SP-API Data Sync
```typescript
// Orders sync (every hour)
syncOrders = async () => {
  const lastSyncTime = await getLastSyncTime('orders')
  const orders = await spApi.getOrders({
    CreatedAfter: lastSyncTime,
    MarketplaceIds: [marketplaceId]
  })
  
  for (const order of orders) {
    await saveOrder(order)
    const orderItems = await spApi.getOrderItems(order.AmazonOrderId)
    await saveOrderItems(orderItems)
  }
  
  await updateLastSyncTime('orders', new Date())
}

// Catalog sync (daily)
syncCatalog = async () => {
  const asins = await getActiveAsins()
  for (const asin of asins) {
    const catalogItem = await spApi.getCatalogItem(asin)
    await updateProductInfo(catalogItem)
  }
}

// Reports sync (daily)
syncReports = async () => {
  const reportTypes = [
    'GET_MERCHANT_LISTINGS_ALL_DATA',
    'GET_SALES_AND_TRAFFIC_REPORT',
    'GET_BUSINESS_REPORT'
  ]
  
  for (const reportType of reportTypes) {
    const reportId = await spApi.createReport(reportType)
    await pollAndProcessReport(reportId)
  }
}
```

### 2. Amazon Advertising API Data Sync
```typescript
// Campaign sync (every 6 hours)
syncCampaigns = async () => {
  const campaigns = await adApi.getCampaigns()
  await saveCampaigns(campaigns)
  
  for (const campaign of campaigns) {
    const adGroups = await adApi.getAdGroups(campaign.campaignId)
    await saveAdGroups(adGroups)
    
    for (const adGroup of adGroups) {
      const keywords = await adApi.getKeywords(adGroup.adGroupId)
      await saveKeywords(keywords)
    }
  }
}

// Performance data sync (daily)
syncPerformanceData = async () => {
  const yesterday = getYesterday()
  
  // Campaign performance
  const campaignReport = await adApi.createReport({
    recordType: 'campaigns',
    reportDate: yesterday,
    metrics: ['impressions', 'clicks', 'cost', 'sales1d', 'orders1d']
  })
  
  // Keyword performance
  const keywordReport = await adApi.createReport({
    recordType: 'keywords',
    reportDate: yesterday,
    metrics: ['impressions', 'clicks', 'cost', 'sales1d', 'orders1d']
  })
  
  // Search terms
  const searchTermReport = await adApi.createReport({
    recordType: 'searchTerms',
    reportDate: yesterday,
    metrics: ['impressions', 'clicks', 'cost', 'sales1d', 'orders1d']
  })
  
  await processReports([campaignReport, keywordReport, searchTermReport])
}
```

## Database Schema & Relationships

### Entity Relationship Diagram
```
Users (1) ──── (M) AmazonAccounts
                    │
                    ├── (M) Products
                    │    └── (M) SalesData
                    │
                    ├── (M) Campaigns
                    │    ├── (M) CampaignPerformance
                    │    └── (M) AdGroups
                    │         ├── (M) Keywords
                    │         │    ├── (M) KeywordPerformance
                    │         │    └── (M) SearchTerms
                    │         └── (M) ProductAds
                    │
                    └── (M) Reports
```

### Key Indexes for Performance
```sql
-- Performance critical indexes
CREATE INDEX CONCURRENTLY idx_sales_data_account_date ON sales_data(account_id, date DESC);
CREATE INDEX CONCURRENTLY idx_campaign_perf_campaign_date ON campaign_performance(campaign_id, date DESC);
CREATE INDEX CONCURRENTLY idx_keyword_perf_keyword_date ON keyword_performance(keyword_id, date DESC);
CREATE INDEX CONCURRENTLY idx_search_terms_keyword_date ON search_terms(keyword_id, date DESC);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_products_account_status ON products(account_id, status) WHERE status = 'active';
CREATE INDEX CONCURRENTLY idx_campaigns_account_type_status ON campaigns(account_id, campaign_type, status);

-- Partial indexes for active records
CREATE INDEX CONCURRENTLY idx_active_campaigns ON campaigns(account_id, updated_at) WHERE status = 'ENABLED';
CREATE INDEX CONCURRENTLY idx_active_keywords ON keywords(ad_group_id, updated_at) WHERE status = 'ENABLED';
```

## API Endpoints Specification

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Account Management Endpoints
```
GET    /api/accounts                    # List all accounts
POST   /api/accounts                    # Connect new account
GET    /api/accounts/:id                # Get account details
PUT    /api/accounts/:id                # Update account
DELETE /api/accounts/:id                # Remove account
POST   /api/accounts/:id/sync           # Trigger manual sync
GET    /api/accounts/:id/sync-status    # Get sync status
```

### Dashboard Endpoints
```
GET /api/dashboard/metrics              # Main KPI metrics
GET /api/dashboard/performance-trend    # Performance trend data
GET /api/dashboard/product-performance  # Product level data
GET /api/dashboard/order-distribution   # Order distribution chart
GET /api/dashboard/synopsis/overview    # Synopsis overview
GET /api/dashboard/synopsis/ad-types    # Ad type breakdown
```

### Campaign Management Endpoints
```
GET    /api/campaigns                   # List campaigns
GET    /api/campaigns/:id               # Get campaign details
PUT    /api/campaigns/:id               # Update campaign
POST   /api/campaigns/:id/pause         # Pause campaign
POST   /api/campaigns/:id/resume        # Resume campaign
GET    /api/campaigns/:id/performance   # Campaign performance data
GET    /api/campaigns/:id/keywords      # Campaign keywords
```

### Reporting Endpoints
```
GET /api/reports/campaigns              # Campaign reports
GET /api/reports/keywords               # Keyword reports
GET /api/reports/search-terms           # Search term reports
GET /api/reports/products               # Product reports
POST /api/reports/export                # Export data
GET /api/reports/:id/download           # Download exported report
```

## Frontend Component Architecture

### Component Hierarchy
```
App
├── AuthProvider
├── QueryProvider
├── NotificationProvider
└── Router
    ├── AuthLayout
    │   ├── LoginPage
    │   └── SignupPage
    └── DashboardLayout
        ├── Sidebar
        ├── Header
        └── MainContent
            ├── Dashboard
            │   ├── MetricsCards
            │   ├── PerformanceTrendChart
            │   ├── OrderDistributionChart
            │   └── ProductPerformanceTable
            ├── SynopsisDashboard
            │   ├── OverviewCards
            │   ├── AdTypeBreakdown
            │   └── DetailedAnalysis
            ├── SynopsisReports
            │   ├── PerformanceTrendChart
            │   ├── ReportTabs
            │   └── VisualizationComponents
            ├── Campaigns
            │   ├── CampaignList
            │   ├── CampaignDetails
            │   └── CampaignEditor
            └── Settings
                ├── AccountSettings
                └── UserProfile
```

### Reusable Components
```typescript
// Core UI Components
- DataTable (with sorting, filtering, pagination)
- MetricCard (with trend indicators)
- DateRangePicker
- AccountSelector
- LoadingSpinner
- ErrorBoundary
- ConfirmDialog
- ExportButton

// Chart Components
- LineChart (performance trends)
- BarChart (comparisons)
- PieChart (distributions)
- DonutChart (breakdowns)
- AreaChart (cumulative data)

// Form Components
- FormInput
- FormSelect
- FormDatePicker
- FormCheckbox
- FormRadio
- FormTextarea

// Layout Components
- PageHeader
- ContentCard
- Sidebar
- Breadcrumbs
- Pagination
```

## State Management Strategy

### Zustand Store Structure
```typescript
// Auth Store
interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

// Account Store
interface AccountStore {
  accounts: AmazonAccount[]
  selectedAccount: string | null
  isLoading: boolean
  fetchAccounts: () => Promise<void>
  selectAccount: (accountId: string) => void
  syncAccount: (accountId: string) => Promise<void>
}

// Dashboard Store
interface DashboardStore {
  dateRange: [Date, Date]
  metrics: DashboardMetrics | null
  performanceTrend: TrendData[]
  isLoading: boolean
  setDateRange: (range: [Date, Date]) => void
  fetchMetrics: () => Promise<void>
  fetchPerformanceTrend: () => Promise<void>
}

// Campaign Store
interface CampaignStore {
  campaigns: Campaign[]
  selectedCampaign: Campaign | null
  filters: CampaignFilters
  isLoading: boolean
  fetchCampaigns: () => Promise<void>
  updateCampaign: (campaign: Campaign) => Promise<void>
  setFilters: (filters: CampaignFilters) => void
}
```

## Security Implementation

### Authentication & Authorization
```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string
  email: string
  accountIds: string[]
  permissions: string[]
  iat: number
  exp: number
}

// Role-based Access Control
enum Permission {
  READ_DASHBOARD = 'read:dashboard',
  WRITE_CAMPAIGNS = 'write:campaigns',
  MANAGE_ACCOUNTS = 'manage:accounts',
  EXPORT_DATA = 'export:data'
}

// Middleware for route protection
const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}
```

### Data Security
```typescript
// Encryption for sensitive data
const encryptSensitiveData = (data: string): string => {
  return crypto.encrypt(data, process.env.ENCRYPTION_KEY)
}

// API rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

// Input validation
const validateInput = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    next()
  }
}
```

## Performance Optimization

### Database Optimization
```sql
-- Partitioning for large tables
CREATE TABLE campaign_performance_2024 PARTITION OF campaign_performance
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Materialized views for complex aggregations
CREATE MATERIALIZED VIEW daily_account_summary AS
SELECT 
  account_id,
  date,
  SUM(revenue) as total_revenue,
  SUM(orders) as total_orders,
  SUM(units_sold) as total_units,
  AVG(conversion_rate) as avg_conversion_rate
FROM sales_data
GROUP BY account_id, date;

-- Refresh materialized views
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_account_summary;
```

### Caching Strategy
```typescript
// Redis caching for frequently accessed data
const cacheKey = `dashboard:metrics:${accountId}:${dateRange}`
const cachedData = await redis.get(cacheKey)

if (cachedData) {
  return JSON.parse(cachedData)
}

const freshData = await fetchMetricsFromDatabase()
await redis.setex(cacheKey, 300, JSON.stringify(freshData)) // 5 min cache

return freshData
```

### Frontend Optimization
```typescript
// React Query for data fetching and caching
const { data, isLoading, error } = useQuery({
  queryKey: ['dashboard-metrics', accountId, dateRange],
  queryFn: () => fetchDashboardMetrics(accountId, dateRange),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
})

// Virtual scrolling for large tables
const VirtualizedTable = ({ data }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={data.length}
      itemSize={50}
      itemData={data}
    >
      {TableRow}
    </FixedSizeList>
  )
}

// Code splitting for route-based chunks
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Campaigns = lazy(() => import('./pages/Campaigns'))
```

## Testing Strategy

### Unit Testing
```typescript
// Component testing with React Testing Library
describe('MetricsCard', () => {
  it('displays metric value and change indicator', () => {
    const mockData = {
      title: 'Total Sales',
      value: 1299945.55,
      change: 6.32
    }
    
    render(<MetricsCard data={mockData} />)
    
    expect(screen.getByText('Total Sales')).toBeInTheDocument()
    expect(screen.getByText('₹1,299,945.55')).toBeInTheDocument()
    expect(screen.getByText('↑ 6.32%')).toBeInTheDocument()
  })
})

// API testing
describe('Dashboard API', () => {
  it('returns dashboard metrics for valid account', async () => {
    const response = await request(app)
      .get('/api/dashboard/metrics')
      .query({ accountId: 'test-account', startDate: '2024-01-01', endDate: '2024-01-31' })
      .expect(200)
    
    expect(response.body).toHaveProperty('totalSales')
    expect(response.body).toHaveProperty('totalOrders')
    expect(response.body.totalSales).toBeGreaterThan(0)
  })
})
```

### Integration Testing
```typescript
// End-to-end testing with Playwright
test('user can view dashboard metrics', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[data-testid=email]', 'test@example.com')
  await page.fill('[data-testid=password]', 'password')
  await page.click('[data-testid=login-button]')
  
  await page.waitForURL('/dashboard')
  
  // Verify metrics cards are displayed
  await expect(page.locator('[data-testid=total-sales]')).toBeVisible()
  await expect(page.locator('[data-testid=total-orders]')).toBeVisible()
  
  // Verify chart is rendered
  await expect(page.locator('[data-testid=performance-chart]')).toBeVisible()
})
```

## Deployment & DevOps

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to AWS
        run: |
          docker build -t amazon-fdc-tool .
          docker tag amazon-fdc-tool:latest $ECR_REGISTRY/amazon-fdc-tool:latest
          docker push $ECR_REGISTRY/amazon-fdc-tool:latest
          aws ecs update-service --cluster production --service amazon-fdc-tool --force-new-deployment
```

### Infrastructure as Code
```yaml
# docker-compose.production.yml
version: '3.8'

services:
  app:
    image: amazon-fdc-tool:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=amazon_fdc_tool
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl

volumes:
  postgres_data:
  redis_data:
```

## Master AI Agent Prompt

### Complete System Prompt for AI Agent
```
You are an expert full-stack developer tasked with building "Amazon FDC Tool" - a comprehensive Amazon seller and advertising analytics platform. You have complete knowledge of the DataFuel application structure, functionality, and implementation requirements.

## Your Capabilities:
- Build React TypeScript frontend with modern UI libraries (Mantine, Chart.js, TanStack Table)
- Develop Node.js/Express backend with PostgreSQL database
- Integrate Amazon SP-API and Advertising API
- Implement complex KPI calculations and business logic
- Create responsive, data-rich dashboards and reports
- Set up authentication, security, and performance optimization

## Key Requirements:
1. **Exact UI Replication**: Follow the detailed UI layouts provided in the master documentation
2. **Complete Functionality**: Implement all features identified in the DataFuel analysis
3. **Amazon API Integration**: Full integration with SP-API and Advertising API
4. **Performance**: Optimize for large datasets and real-time updates
5. **Security**: Implement proper authentication, authorization, and data protection

## Available Resources:
- Complete page layouts and UI designs
- Database schema and relationships
- API endpoint specifications
- KPI calculation formulas
- Component architecture
- Security implementation guidelines
- Performance optimization strategies

## Implementation Approach:
1. Start with project setup and basic structure
2. Implement authentication and account management
3. Build core dashboard with KPI cards and charts
4. Add Synopsis dashboard and reports
5. Implement Amazon API integrations
6. Add data synchronization jobs
7. Optimize performance and add security measures
8. Test and deploy

When implementing any feature, refer to the master documentation for exact specifications, UI layouts, calculations, and technical requirements. Maintain consistency with the DataFuel application structure while using modern development practices.

Always prioritize:
- Code quality and maintainability
- User experience and performance
- Data accuracy and security
- Scalability and extensibility
```

## 8. Advanced Features & Systems

### 8.1 Comprehensive Admin Panel
**Core Admin Modules:**
- **User Management System** - Role-based access control, user lifecycle management
- **Application Settings Framework** - System configuration, feature toggles
- **API Key Management** - Secure credential storage and validation
- **Parameter Logic Editor** - Dynamic rule configuration with conditional logic
- **Gemini AI Integration** - AI-powered automation suggestions and insights
- **Features Management** - Feature flag system for controlled rollouts
- **Subscription Management** - Package design, billing, usage monitoring
- **System Monitoring** - Performance metrics, health checks, audit logs

### 8.2 AI-Powered Automation System
**Automation Architecture:**
- **Basic Automation** - 6 predefined rule types for common scenarios
- **Advanced Automation** - 9 entity levels (Portfolios, Campaigns, Ad Groups, etc.)
- **Custom Variables System** - Mathematical formula builder with 10 operations
- **AI Presets Engine** - Machine learning-powered automation recommendations
- **Rule Builder** - Visual interface with conditions, operators, and actions
- **Scheduling System** - Flexible execution timing with timezone support

### 8.3 Comprehensive Notification System
**Multi-Channel Delivery:**
- **Email (SMTP)** - Template system with multiple provider support
- **SMS Notifications** - Critical alerts via Twilio/AWS SNS
- **Slack Integration** - Team collaboration with interactive buttons
- **Webhooks** - Third-party integrations with security validation
- **In-App Notifications** - Real-time WebSocket-based alerts
- **Push Notifications** - Mobile app integration

### 8.4 User Notification Center
**Advanced Features:**
- **Smart Notification Optimization** - AI-powered delivery timing
- **Notification Grouping** - Intelligent summarization and categorization
- **Team Collaboration** - Shared notifications and assignment workflows
- **Mobile Experience** - Rich push notifications with quick actions
- **Analytics Dashboard** - Engagement metrics and optimization insights

### 8.5 Model Context Protocol (MCP) Integration
**Revolutionary AI Integration:**
- **Direct AI Agent Access** - Claude and other AI agents can directly manage campaigns
- **Natural Language Operations** - Conversational campaign management
- **Persistent Context** - AI maintains full context across all operations
- **Tool Registration System** - Dynamic automation tool discovery
- **Resource Management** - AI access to campaign and performance data

## 9. Implementation Phases

### Phase 1: Foundation Architecture (Weeks 1-4)
- **Core Infrastructure** - TypeScript/Node.js modular architecture
- **Authentication System** - OAuth 2.0 + AWS Signature V4 implementation
- **API Integration** - Amazon Advertising API and Partner API clients
- **Database Design** - PostgreSQL schema with comprehensive data models
- **Basic Dashboard** - Campaign overview and navigation

### Phase 2: Essential Features (Weeks 5-8)
- **Campaign Management** - Full CRUD operations with bulk actions
- **Keyword Management** - Optimization tools and match type management
- **Basic Automation** - 6 core automation rule types
- **Reporting System** - Performance analytics and custom reports
- **Alert Framework** - Basic notification system

### Phase 3: Advanced Automation (Weeks 9-12)
- **Advanced Automation Engine** - 9-entity automation system
- **Custom Variables** - Mathematical formula builder
- **AI Presets System** - Machine learning recommendations
- **MCP Integration** - AI agent connectivity
- **Notification Center** - Multi-channel delivery system

### Phase 4: Enterprise Features (Weeks 13-16)
- **Admin Panel** - Complete administrative interface
- **Subscription System** - Package management and billing
- **Team Collaboration** - Multi-user workflows
- **Advanced Analytics** - Predictive insights and optimization
- **Mobile App** - iOS/Android companion application

### Phase 5: AI & Optimization (Weeks 17-20)
- **Natural Language Interface** - Conversational campaign management
- **Predictive Analytics** - AI-powered performance forecasting
- **Smart Recommendations** - Context-aware optimization suggestions
- **Advanced Integrations** - Third-party tool connectivity
- **Performance Optimization** - System scaling and optimization

## 10. Amazon Seller MCP Integration Strategy

### 10.1 MCP Architecture Adoption
**Key Benefits from Amazon Seller MCP Repository:**
- **Enterprise-Grade Architecture** - 99.9% test pass rate, modular TypeScript design
- **OAuth 2.0 + AWS Signature V4** - Proven authentication patterns
- **Tool Registration System** - Dynamic automation tool discovery
- **Resource Management** - AI-accessible data resources
- **Error Handling** - Comprehensive error types and resilience

### 10.2 AI-Native Features
**Revolutionary Capabilities:**
- **Natural Language Operations** - Manage campaigns through conversation
- **Context Awareness** - AI maintains full context across operations
- **Intelligent Automation** - AI makes complex decisions based on performance data
- **Real-time Communication** - Bidirectional AI-API communication

### 10.3 Implementation Roadmap
**Integration Timeline:**
- **Week 1-2** - Adopt modular TypeScript architecture and authentication
- **Week 3-4** - Implement MCP server and tool registration
- **Week 5-6** - Create automation tools and resource handlers
- **Week 7-8** - Add AI-powered presets and performance analytics
- **Week 9-10** - Polish, testing, and optimization

This master documentation provides everything needed to build a complete DataFuel clone with all the functionality, UI designs, business logic, technical specifications, and revolutionary AI integration capabilities required for the Amazon FDC Tool project.