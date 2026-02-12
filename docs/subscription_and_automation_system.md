# Subscription Management & AI Automation System

## Overview
This document outlines the comprehensive subscription management system, AI-powered automation presets, and enhanced notification system for the Amazon FDC Tool.

## 1. Subscription Management System

### 1.1 User Subscription Page (`/subscription`)
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Subscription Management                                                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Current Plan: Premium                                    [Manage Billing]          │
│ Next Billing: December 15, 2024 ($49.99/month)         [Cancel Subscription]     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Available Plans                                                                     │
│                                                                                     │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│ │     FREE        │ │     BASIC       │ │    PREMIUM      │ │   ENTERPRISE    │   │
│ │                 │ │                 │ │                 │ │                 │   │
│ │     $0/mo       │ │    $19/mo       │ │    $49/mo       │ │   $149/mo       │   │
│ │                 │ │                 │ │                 │ │                 │   │
│ │ ✓ 1 Account     │ │ ✓ 3 Accounts    │ │ ✓ 10 Accounts   │ │ ✓ Unlimited     │   │
│ │ ✓ Basic Reports │ │ ✓ Advanced      │ │ ✓ AI Insights   │ │ ✓ Custom AI     │   │
│ │ ✓ 30-day Data   │ │   Reports       │ │ ✓ Automation    │ │ ✓ White Label   │   │
│ │ ✗ AI Features   │ │ ✓ 1-year Data   │ │ ✓ Priority      │ │ ✓ API Access    │   │
│ │ ✗ Automation    │ │ ✗ AI Features   │ │   Support       │ │ ✓ Custom        │   │
│ │ ✗ Priority      │ │ ✗ Automation    │ │ ✓ Export Data   │ │   Integrations  │   │
│ │   Support       │ │ ✗ Export Data   │ │ ✓ 3-year Data   │ │ ✓ Dedicated     │   │
│ │                 │ │                 │ │                 │ │   Support       │   │
│ │ [Current Plan]  │ │ [Upgrade]       │ │ [Upgrade]       │ │ [Contact Sales] │   │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Feature Comparison                                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Feature                    │ Free │ Basic │ Premium │ Enterprise │              │ │
│ ├────────────────────────────┼──────┼───────┼─────────┼────────────┤              │ │
│ │ Amazon Accounts            │  1   │   3   │   10    │ Unlimited  │              │ │
│ │ Data Retention             │ 30d  │  1yr  │   3yr   │ Unlimited  │              │ │
│ │ Dashboard Analytics        │  ✓   │   ✓   │    ✓    │     ✓      │              │ │
│ │ Synopsis Reports           │  ✗   │   ✓   │    ✓    │     ✓      │              │ │
│ │ AI Insights                │  ✗   │   ✗   │    ✓    │     ✓      │              │ │
│ │ Automation Rules           │  ✗   │   ✗   │    ✓    │     ✓      │              │ │
│ │ Custom Formulas            │  ✗   │   ✗   │    ✓    │     ✓      │              │ │
│ │ Data Export                │  ✗   │   ✗   │    ✓    │     ✓      │              │ │
│ │ API Access                 │  ✗   │   ✗   │    ✗    │     ✓      │              │ │
│ │ White Label                │  ✗   │   ✗   │    ✗    │     ✓      │              │ │
│ │ Priority Support           │  ✗   │   ✗   │    ✓    │     ✓      │              │ │
│ │ Custom Integrations        │  ✗   │   ✗   │    ✗    │     ✓      │              │ │
│ └────────────────────────────┴──────┴───────┴─────────┴────────────┘              │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Billing History                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Date        │ Plan     │ Amount  │ Status    │ Invoice │                        │ │
│ ├─────────────┼──────────┼─────────┼───────────┼─────────┤                        │ │
│ │ 2024-11-15  │ Premium  │ $49.99  │ Paid      │ [View]  │                        │ │
│ │ 2024-10-15  │ Premium  │ $49.99  │ Paid      │ [View]  │                        │ │
│ │ 2024-09-15  │ Basic    │ $19.99  │ Paid      │ [View]  │                        │ │
│ │ 2024-08-15  │ Basic    │ $19.99  │ Paid      │ [View]  │                        │ │
│ └─────────────┴──────────┴─────────┴───────────┴─────────┘                        │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

Payment Method Modal:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Update Payment Method                                                           [×] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Credit Card Information                                                             │
│ Card Number: [**** **** **** 1234] [Change]                                       │
│ Expiry: [12/26] CVV: [***]                                                        │
│ Name on Card: [John Smith_________________________]                               │
│                                                                                     │
│ Billing Address                                                                     │
│ Address: [123 Main Street_________________________]                                │
│ City: [New York____________] State: [NY ▼] ZIP: [10001]                           │
│ Country: [United States ▼]                                                        │
│                                                                                     │
│ [Save Payment Method] [Cancel]                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Subscription Features by Plan

#### Free Plan ($0/month)
- 1 Amazon account connection
- Basic dashboard analytics
- 30-day data retention
- Community support
- Limited API calls (1,000/month)

#### Basic Plan ($19/month)
- 3 Amazon account connections
- Advanced reports and analytics
- 1-year data retention
- Email support
- Standard API calls (10,000/month)
- Basic automation rules (5 rules)

#### Premium Plan ($49/month)
- 10 Amazon account connections
- AI-powered insights and recommendations
- 3-year data retention
- Priority support (24/7 chat)
- Advanced automation (50 rules)
- Custom KPI formulas
- Data export functionality
- Enhanced API calls (50,000/month)

#### Enterprise Plan ($149/month)
- Unlimited Amazon accounts
- Custom AI models and insights
- Unlimited data retention
- Dedicated account manager
- White-label options
- API access for integrations
- Custom automation workflows
- Advanced security features
- Unlimited API calls

## 2. Admin Subscription Manager (`/admin/subscriptions`)

### 2.1 Subscription Overview Dashboard
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Subscription Management Dashboard                                                   │
│ [+ Create Plan] [Import Users] [Export Data] [Send Notifications]                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Subscription Metrics                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │Total Revenue│ │Active Users │ │Churn Rate   │ │MRR Growth   │               │ │
│ │ │  $45,678    │ │    1,247    │ │   2.3%      │ │  +15.2%     │               │ │
│ │ │  ↑ 12.5%    │ │  ↑ 8.9%     │ │  ↓ 0.5%     │ │  ↑ 3.1%     │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ │                                                                                 │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │Free Users   │ │Basic Users  │ │Premium Users│ │Enterprise   │               │ │
│ │ │    456      │ │    523      │ │    234      │ │     34      │               │ │
│ │ │  ↑ 5.2%     │ │  ↑ 12.1%    │ │  ↑ 18.7%    │ │  ↑ 25.0%    │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Revenue Trend Chart                                                                 │
│ [Last 12 months revenue and subscription growth chart]                             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Recent Subscription Activity                                                        │
│ • john@example.com upgraded to Premium plan                                        │
│ • sarah@company.com downgraded to Basic plan                                       │
│ • mike@startup.com cancelled subscription                                          │
│ • 15 new Premium subscriptions this week                                           │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Plan Designer & Management
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Subscription Plans Management                                                       │
│ [+ Create New Plan] [Clone Plan] [Bulk Edit] [Archive Plans]                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Active Plans                                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Plan Name    │ Price    │ Users │ Features │ Status   │ Actions              │   │ │
│ ├──────────────┼──────────┼───────┼──────────┼──────────┼──────────────────────┤   │ │
│ │ Free         │ $0/mo    │  456  │    5     │ Active   │ [Edit] [Clone]       │   │ │
│ │ Basic        │ $19/mo   │  523  │    8     │ Active   │ [Edit] [Clone]       │   │ │
│ │ Premium      │ $49/mo   │  234  │   12     │ Active   │ [Edit] [Clone]       │   │ │
│ │ Enterprise   │ $149/mo  │   34  │   15     │ Active   │ [Edit] [Clone]       │   │ │
│ │ Black Friday │ $29/mo   │   12  │   12     │ Limited  │ [Edit] [Extend]      │   │ │
│ └──────────────┴──────────┴───────┴──────────┴──────────┴──────────────────────┘   │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

Plan Editor Modal:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Edit Plan: Premium                                                             [×] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Basic Information                                                                   │
│ Plan Name: [Premium_________________________]                                      │
│ Description: [Advanced features with AI insights_________________________]         │
│ Price: [$49.99] per [Month ▼] Display Price: [$49/month]                          │
│ Trial Period: [14 days] Status: [Active ▼]                                        │
│                                                                                     │
│ Feature Configuration                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Core Features                                                                   │ │
│ │ Amazon Accounts: [10] Data Retention: [3 years ▼]                             │ │
│ │ API Calls/Month: [50000] Storage Limit: [100 GB]                              │ │
│ │                                                                                 │ │
│ │ Dashboard Features                                                              │ │
│ │ ☑ Basic Analytics    ☑ Advanced Reports    ☑ Synopsis Dashboard               │ │
│ │ ☑ Performance Trends ☑ Product Analysis    ☑ Campaign Management              │ │
│ │                                                                                 │ │
│ │ AI & Automation                                                                 │ │
│ │ ☑ AI Insights        ☑ Automated Reports   ☑ Smart Recommendations            │ │
│ │ ☑ Automation Rules   ☑ Custom Formulas     ☑ Predictive Analytics             │ │
│ │ Max Automation Rules: [50]                                                     │ │
│ │                                                                                 │ │
│ │ Support & Extras                                                                │ │
│ │ ☑ Priority Support   ☑ Data Export         ☑ Custom Dashboards                │ │
│ │ ☑ Advanced Filtering ☑ Scheduled Reports   ☑ Team Collaboration               │ │
│ │ ☐ White Label        ☐ API Access          ☐ Custom Integrations              │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ Billing Configuration                                                               │
│ Payment Processor: [Stripe ▼] Tax Handling: [Automatic ▼]                        │
│ Proration: [Enabled ▼] Cancellation: [End of Period ▼]                           │
│                                                                                     │
│ [Save Plan] [Save & Activate] [Cancel]                                             │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 User Subscription Management
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ User Subscriptions                                                                  │
│ [Search: ________________] [Plan: All ▼] [Status: All ▼] [Export]                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ User              │ Plan      │ Status   │ Next Billing │ MRR    │ Actions     │ │ │
│ ├───────────────────┼───────────┼──────────┼──────────────┼────────┼─────────────┤ │ │
│ │ john@example.com  │ Premium   │ Active   │ 2024-12-15   │ $49.99 │ [Manage]    │ │ │
│ │ sarah@company.com │ Basic     │ Active   │ 2024-12-20   │ $19.99 │ [Manage]    │ │ │
│ │ mike@startup.com  │ Free      │ Active   │ -            │ $0.00  │ [Upgrade]   │ │ │
│ │ lisa@corp.com     │ Enterprise│ Active   │ 2024-12-10   │ $149.99│ [Manage]    │ │ │
│ │ tom@shop.com      │ Premium   │ Cancelled│ -            │ $0.00  │ [Reactivate]│ │ │
│ └───────────────────┴───────────┴──────────┴──────────────┴────────┴─────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

User Subscription Details Modal:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Manage Subscription: john@example.com                                          [×] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Current Subscription                                                                │
│ Plan: Premium ($49.99/month)                                                       │
│ Status: Active                                                                      │
│ Started: 2024-09-15                                                                │
│ Next Billing: 2024-12-15                                                          │
│ Payment Method: **** **** **** 1234                                               │
│                                                                                     │
│ Usage Statistics                                                                    │
│ Amazon Accounts: 7/10                                                             │
│ API Calls This Month: 23,456/50,000                                               │
│ Data Storage: 45 GB/100 GB                                                        │
│ Automation Rules: 12/50                                                           │
│                                                                                     │
│ Actions                                                                             │
│ [Change Plan] [Pause Subscription] [Cancel Subscription]                          │
│ [Add Credits] [Send Message] [View Billing History]                               │
│                                                                                     │
│ Billing History                                                                     │
│ 2024-11-15: $49.99 (Paid) [Invoice]                                              │
│ 2024-10-15: $49.99 (Paid) [Invoice]                                              │
│ 2024-09-15: $49.99 (Paid) [Invoice]                                              │
│                                                                                     │
│ [Save Changes] [Close]                                                              │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 3. AI-Powered Automation System (`/automation`)

### 3.1 Automation Dashboard
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Automation Center                                                                   │
│ [+ Create Automation] [Browse Templates] [Import Workflow] [AI Assistant]         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Active Automations                                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │Total Rules  │ │Active Rules │ │Triggered    │ │Success Rate │               │ │
│ │ │     47      │ │     42      │ │   1,234     │ │   98.7%     │               │ │
│ │ │  ↑ 5        │ │  ↑ 3        │ │  ↑ 156      │ │  ↑ 0.2%     │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ My Automations                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Name                    │ Type        │ Status │ Last Run │ Success │ Actions  │ │ │
│ ├─────────────────────────┼─────────────┼────────┼──────────┼─────────┼──────────┤ │ │
│ │ High ACoS Alert         │ Notification│ Active │ 2h ago   │ 100%    │ [Edit]   │ │ │
│ │ Bid Optimization        │ Campaign    │ Active │ 1d ago   │ 95%     │ [Edit]   │ │ │
│ │ Keyword Harvesting      │ Keywords    │ Active │ 6h ago   │ 98%     │ [Edit]   │ │ │
│ │ Budget Reallocation     │ Budget      │ Paused │ -        │ -       │ [Resume] │ │ │
│ │ Negative Keyword Sync   │ Keywords    │ Active │ 12h ago  │ 100%    │ [Edit]   │ │ │
│ └─────────────────────────┴─────────────┴────────┴──────────┴─────────┴──────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Automation Templates                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │ │
│ │ │ Bid Management  │ │ Budget Control  │ │ Keyword Harvest │ │ Performance     │ │ │
│ │ │                 │ │                 │ │                 │ │ Alerts          │ │ │
│ │ │ Auto-adjust bids│ │ Reallocate      │ │ Find profitable │ │ Monitor KPIs    │ │ │
│ │ │ based on ACoS   │ │ budget based on │ │ search terms    │ │ and send alerts │ │ │
│ │ │ performance     │ │ performance     │ │ and add as      │ │ when thresholds │ │ │
│ │ │                 │ │                 │ │ keywords        │ │ are exceeded    │ │ │
│ │ │ [Use Template]  │ │ [Use Template]  │ │ [Use Template]  │ │ [Use Template]  │ │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Visual Workflow Builder (N8N-Style)
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Automation Workflow Builder                                                         │
│ [Save] [Test] [Deploy] [AI Optimize] [Templates ▼] [Help]                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Workflow Canvas                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                                 │ │
│ │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │ │
│ │  │   TRIGGER   │───▶│   FILTER    │───▶│   ACTION    │───▶│   NOTIFY    │     │ │
│ │  │             │    │             │    │             │    │             │     │ │
│ │  │ ACoS > 30%  │    │ Campaign    │    │ Reduce Bid  │    │ Send Email  │     │ │
│ │  │ Daily Check │    │ Type = SP   │    │ by 15%      │    │ to Manager  │     │ │
│ │  │             │    │             │    │             │    │             │     │ │
│ │  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘     │ │
│ │                                                                                 │ │
│ │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                        │ │
│ │  │   TRIGGER   │───▶│ AI ANALYZE  │───▶│   ACTION    │                        │ │
│ │  │             │    │             │    │             │                        │ │
│ │  │ New Search  │    │ Keyword     │    │ Add to      │                        │ │
│ │  │ Terms Found │    │ Potential   │    │ Campaign    │                        │ │
│ │  │             │    │ Analysis    │    │             │                        │ │
│ │  └─────────────┘    └─────────────┘    └─────────────┘                        │ │
│ │                                                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Node Library                                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Triggers          │ Conditions       │ Actions          │ AI Nodes            │ │ │
│ │ • Schedule        │ • Performance    │ • Bid Adjustment │ • Keyword Analysis  │ │ │
│ │ • Data Change     │ • Threshold      │ • Budget Change  │ • Trend Prediction  │ │ │
│ │ • API Event       │ • Time-based     │ • Pause/Resume   │ • Optimization      │ │ │
│ │ • Manual          │ • Custom Logic   │ • Notification   │ • Anomaly Detection │ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

Node Configuration Modal:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Configure Trigger: ACoS Threshold                                              [×] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Trigger Settings                                                                    │
│ Name: [High ACoS Alert_________________________]                                   │
│ Description: [Alert when ACoS exceeds threshold_________________________]          │
│                                                                                     │
│ Conditions                                                                          │
│ Metric: [ACoS ▼] Operator: [Greater than ▼] Value: [30] %                         │
│ Time Period: [Last 7 days ▼] Account: [All accounts ▼]                           │
│ Campaign Type: [All ▼] Product: [All products ▼]                                  │
│                                                                                     │
│ Schedule                                                                            │
│ Frequency: [Daily ▼] Time: [09:00] Timezone: [UTC-5 ▼]                           │
│ ☑ Run on weekends ☑ Send summary report                                           │
│                                                                                     │
│ AI Enhancement                                                                      │
│ ☑ Use AI to analyze root causes                                                   │
│ ☑ Generate optimization recommendations                                            │
│ ☑ Predict future performance trends                                               │
│                                                                                     │
│ [Test Trigger] [Save Configuration] [Cancel]                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 AI Automation Assistant
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ AI Automation Assistant                                                         [×] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Chat Interface                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🤖 AI: Hello! I can help you create automation workflows. What would you like  │ │
│ │     to automate today?                                                          │ │
│ │                                                                                 │ │
│ │ 👤 You: I want to automatically pause keywords with high ACoS                  │ │
│ │                                                                                 │ │
│ │ 🤖 AI: Great! I'll help you create a keyword management automation. Let me     │ │
│ │     suggest a workflow:                                                         │ │
│ │                                                                                 │ │
│ │     1. Trigger: Daily check for keywords with ACoS > 50%                       │ │
│ │     2. Filter: Only keywords with at least 10 clicks                           │ │
│ │     3. Action: Pause the keyword                                                │ │
│ │     4. Notify: Send email summary                                               │ │
│ │                                                                                 │ │
│ │     Would you like me to create this workflow? [Create Workflow]               │ │
│ │                                                                                 │ │
│ │ 👤 You: [Type your message here...________________________] [Send]             │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Quick Actions                                                                       │
│ [Create Bid Automation] [Setup Budget Rules] [Keyword Harvesting]                 │
│ [Performance Alerts] [Competitor Monitoring] [Custom Workflow]                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Suggested Automations                                                               │
│ • Automatically increase bids for profitable keywords                              │
│ • Pause campaigns with low conversion rates                                        │
│ • Add negative keywords from poor-performing search terms                         │
│ • Reallocate budget from underperforming to high-performing campaigns             │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 4. Enhanced Notification System

### 4.1 User Notification Center (`/notifications`)
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Notification Center                                                                 │
│ [Mark All Read] [Settings] [Archive All] [Export]                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Filters: [All ▼] [Unread] [Alerts] [Reports] [System] [Automation]               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Notifications                                                                       │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 High ACoS Alert                                               2 hours ago    │ │
│ │    Campaign "Winter Sale" has ACoS of 45% (threshold: 30%)                     │ │
│ │    [View Campaign] [Adjust Bids] [Dismiss]                                     │ │
│ │                                                                                 │ │
│ │ 📊 Weekly Performance Report                                     1 day ago      │ │
│ │    Your account performance summary for Nov 29 - Dec 5                         │ │
│ │    [View Report] [Download PDF] [Archive]                                      │ │
│ │                                                                                 │ │
│ │ 🤖 AI Recommendation                                             3 hours ago    │ │
│ │    Suggested bid increase for keyword "winter boots" (+15%)                    │ │
│ │    [Apply Suggestion] [View Details] [Ignore]                                  │ │
│ │                                                                                 │ │
│ │ ⚙️ Automation Completed                                          5 hours ago    │ │
│ │    "Bid Optimization" rule processed 23 keywords successfully                  │ │
│ │    [View Results] [View Log] [Archive]                                         │ │
│ │                                                                                 │ │
│ │ 💰 Budget Alert                                                  1 day ago      │ │
│ │    Campaign "Holiday Deals" has spent 90% of daily budget                      │ │
│ │    [Increase Budget] [View Campaign] [Dismiss]                                 │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Notification Preferences (`/settings/notifications`)
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Notification Preferences                                                            │
│ [Save Changes] [Reset to Defaults] [Test Notifications]                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Email Notifications                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Performance Alerts                                                              │ │
│ │ ☑ High ACoS alerts (>30%)           [Email ▼] [Immediate ▼]                   │ │
│ │ ☑ Low conversion rate alerts        [Email ▼] [Daily digest ▼]                │ │
│ │ ☑ Budget depletion warnings         [Email ▼] [Immediate ▼]                   │ │
│ │ ☑ Campaign performance anomalies    [Email ▼] [Weekly ▼]                      │ │
│ │                                                                                 │ │
│ │ Reports & Summaries                                                             │ │
│ │ ☑ Daily performance summary         [Email ▼] [Daily at 9 AM ▼]              │ │
│ │ ☑ Weekly performance report         [Email ▼] [Monday at 9 AM ▼]             │ │
│ │ ☑ Monthly business review           [Email ▼] [1st of month ▼]                │ │
│ │ ☑ AI insights and recommendations   [Email ▼] [Weekly ▼]                      │ │
│ │                                                                                 │ │
│ │ System & Account                                                                │ │
│ │ ☑ Account sync status               [Email ▼] [When failed ▼]                 │ │
│ │ ☑ Subscription changes              [Email ▼] [Immediate ▼]                   │ │
│ │ ☑ Security alerts                   [Email ▼] [Immediate ▼]                   │ │
│ │ ☑ Feature updates                   [Email ▼] [Monthly ▼]                     │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ In-App Notifications                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ☑ Show desktop notifications                                                   │ │
│ │ ☑ Play sound for critical alerts                                               │ │
│ │ ☑ Show notification badges                                                     │ │
│ │ ☑ Auto-dismiss after 30 seconds                                                │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Mobile Notifications (Coming Soon)                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ☐ Push notifications                                                           │ │
│ │ ☐ SMS alerts for critical issues                                               │ │
│ │ Phone: [+1-555-0123_____________] [Verify]                                     │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Admin Notification Manager (`/admin/notifications`)
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Admin Notification Management                                                       │
│ [+ Create Notification] [Broadcast Message] [Email Templates] [Analytics]         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ System Notifications                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │ │
│ │ │Emails Sent  │ │Open Rate    │ │Click Rate   │ │Bounce Rate  │               │ │
│ │ │   12,456    │ │   24.5%     │ │   8.7%      │ │   2.1%      │               │ │
│ │ │  ↑ 15.2%    │ │  ↑ 2.1%     │ │  ↑ 1.3%     │ │  ↓ 0.3%     │               │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Recent Notifications                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Type        │ Subject                    │ Recipients │ Sent     │ Status      │ │ │
│ ├─────────────┼────────────────────────────┼────────────┼──────────┼─────────────┤ │ │
│ │ System      │ Scheduled Maintenance      │ All Users  │ 2h ago   │ Delivered   │ │ │
│ │ Feature     │ New AI Insights Available  │ Premium    │ 1d ago   │ Delivered   │ │ │
│ │ Alert       │ API Rate Limit Warning     │ Heavy Users│ 3h ago   │ Delivered   │ │ │
│ │ Marketing   │ Black Friday Special       │ Free Users │ 2d ago   │ Delivered   │ │ │
│ │ Security    │ Password Reset Required    │ Affected   │ 1w ago   │ Delivered   │ │ │
│ └─────────────┴────────────────────────────┴────────────┴──────────┴─────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Email Templates                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Template Name              │ Type        │ Usage   │ Last Modified │ Actions   │ │ │
│ ├────────────────────────────┼─────────────┼─────────┼───────────────┼───────────┤ │ │
│ │ Welcome Email              │ Onboarding  │ 1,234   │ 2024-11-15    │ [Edit]    │ │ │
│ │ Performance Alert          │ Alert       │ 5,678   │ 2024-12-01    │ [Edit]    │ │ │
│ │ Weekly Report              │ Report      │ 2,345   │ 2024-11-20    │ [Edit]    │ │ │
│ │ Subscription Renewal       │ Billing     │ 456     │ 2024-10-30    │ [Edit]    │ │ │
│ │ Feature Announcement       │ Marketing   │ 789     │ 2024-12-03    │ [Edit]    │ │ │
│ └────────────────────────────┴─────────────┴─────────┴───────────────┴───────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

Create Notification Modal:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Create System Notification                                                     [×] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Basic Information                                                                   │
│ Type: [System Alert ▼] Priority: [Medium ▼]                                       │
│ Subject: [Scheduled Maintenance Notice_________________________]                   │
│                                                                                     │
│ Recipients                                                                          │
│ Target: [All Users ▼] Plan Filter: [All Plans ▼]                                  │
│ ☑ Active users only ☑ Exclude unsubscribed                                        │
│ Estimated Recipients: 1,247 users                                                  │
│                                                                                     │
│ Message Content                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Dear {{user_name}},                                                             │ │
│ │                                                                                 │ │
│ │ We will be performing scheduled maintenance on our systems on December 15th    │ │
│ │ from 2:00 AM to 4:00 AM EST. During this time, you may experience brief       │ │
│ │ interruptions in service.                                                      │ │
│ │                                                                                 │ │
│ │ We apologize for any inconvenience and appreciate your understanding.          │ │
│ │                                                                                 │ │
│ │ Best regards,                                                                   │ │
│ │ The Amazon FDC Tool Team                                                       │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ Delivery Options                                                                    │
│ Send: [Immediately ▼] Schedule: [2024-12-10 09:00]                                │
│ Channels: ☑ Email ☑ In-App ☐ SMS                                                  │
│                                                                                     │
│ [Preview] [Send Test] [Schedule] [Save Draft]                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 5. SMTP Email Configuration

### 5.1 Enhanced SMTP Setup (`/admin/email-settings`)
```
UI Layout:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Email Configuration                                                                 │
│ [Test Connection] [Send Test Email] [Import Settings] [Export Config]             │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ SMTP Server Configuration                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Provider: [Custom SMTP ▼] (Gmail, Outlook, SendGrid, Mailgun, Custom)          │ │
│ │                                                                                 │ │
│ │ Server Settings                                                                 │ │
│ │ Host: [smtp.gmail.com_______________] Port: [587]                              │ │
│ │ Encryption: [TLS ▼] (None, SSL, TLS, STARTTLS)                                 │ │
│ │ Authentication: [Username/Password ▼]                                          │ │
│ │                                                                                 │ │
│ │ Credentials                                                                     │ │
│ │ Username: [noreply@amazonfdc.com_______________]                               │ │
│ │ Password: [••••••••••••••••••••••••••••••••••••]                             │ │
│ │ ☑ Use App Password (for Gmail/Outlook)                                        │ │
│ │                                                                                 │ │
│ │ Sender Information                                                              │ │
│ │ From Name: [Amazon FDC Tool_______________]                                    │ │
│ │ From Email: [noreply@amazonfdc.com_______________]                             │ │
│ │ Reply-To: [support@amazonfdc.com_______________]                               │ │
│ │                                                                                 │ │
│ │ Advanced Settings                                                               │ │
│ │ Connection Timeout: [30] seconds                                                │ │
│ │ Max Connections: [5] Rate Limit: [100] emails/hour                            │ │
│ │ ☑ Enable DKIM signing ☑ Track email opens ☑ Track link clicks                │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Email Templates Management                                                          │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Template Categories                                                             │ │
│ │                                                                                 │ │
│ │ Transactional Emails                                                           │ │
│ │ • Welcome Email                    [Edit] [Preview] [Test]                     │ │
│ │ • Password Reset                   [Edit] [Preview] [Test]                     │ │
│ │ • Email Verification               [Edit] [Preview] [Test]                     │ │
│ │ • Account Activation               [Edit] [Preview] [Test]                     │ │
│ │                                                                                 │ │
│ │ Performance Alerts                                                              │ │
│ │ • High ACoS Alert                  [Edit] [Preview] [Test]                     │ │
│ │ • Budget Depletion Warning         [Edit] [Preview] [Test]                     │ │
│ │ • Campaign Performance Alert       [Edit] [Preview] [Test]                     │ │
│ │ • Keyword Performance Alert        [Edit] [Preview] [Test]                     │ │
│ │                                                                                 │ │
│ │ Reports & Summaries                                                             │ │
│ │ • Daily Performance Summary        [Edit] [Preview] [Test]                     │ │
│ │ • Weekly Performance Report        [Edit] [Preview] [Test]                     │ │
│ │ • Monthly Business Review          [Edit] [Preview] [Test]                     │ │
│ │ • AI Insights Report               [Edit] [Preview] [Test]                     │ │
│ │                                                                                 │ │
│ │ Billing & Subscriptions                                                        │ │
│ │ • Subscription Confirmation        [Edit] [Preview] [Test]                     │ │
│ │ • Payment Successful               [Edit] [Preview] [Test]                     │ │
│ │ • Payment Failed                   [Edit] [Preview] [Test]                     │ │
│ │ • Subscription Renewal             [Edit] [Preview] [Test]                     │ │
│ │ • Subscription Cancelled           [Edit] [Preview] [Test]                     │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Email Analytics                                                                     │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ Last 30 Days Performance                                                        │ │
│ │ Emails Sent: 45,678 | Delivered: 44,123 (96.6%)                              │ │
│ │ Opened: 10,789 (24.5%) | Clicked: 3,234 (7.3%)                               │ │
│ │ Bounced: 892 (2.0%) | Unsubscribed: 156 (0.4%)                               │ │
│ │                                                                                 │ │
│ │ [View Detailed Analytics] [Download Report] [Email Health Check]               │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

Email Template Editor:
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ Edit Email Template: High ACoS Alert                                           [×] │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ Template Settings                                                                   │
│ Name: [High ACoS Alert_________________________]                                   │
│ Subject: [🚨 High ACoS Alert: {{campaign_name}} - Action Required]                │
│ Category: [Performance Alerts ▼]                                                  │
│                                                                                     │
│ Email Content                                                                       │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [Visual] [HTML] [Preview]                                                       │ │
│ │                                                                                 │ │
│ │ Dear {{user_name}},                                                             │ │
│ │                                                                                 │ │
│ │ We've detected that your campaign "{{campaign_name}}" has an ACoS of           │ │
│ │ {{acos_percentage}}%, which exceeds your threshold of {{threshold}}%.          │ │
│ │                                                                                 │ │
│ │ Campaign Details:                                                               │ │
│ │ • Campaign: {{campaign_name}}                                                  │ │
│ │ • Current ACoS: {{acos_percentage}}%                                           │ │
│ │ • Ad Spend: ${{ad_spend}}                                                      │ │
│ │ • Sales: ${{sales}}                                                            │ │
│ │ • Time Period: {{time_period}}                                                 │ │
│ │                                                                                 │ │
│ │ Recommended Actions:                                                            │ │
│ │ • Review and optimize keyword bids                                             │ │
│ │ • Consider pausing underperforming keywords                                    │ │
│ │ • Analyze search term reports for negative keywords                            │ │
│ │                                                                                 │ │
│ │ [View Campaign] [Optimize Now] [Dismiss Alert]                                 │ │
│ │                                                                                 │ │
│ │ Best regards,                                                                   │ │
│ │ Amazon FDC Tool Team                                                           │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                     │
│ Variables Available                                                                 │
│ {{user_name}}, {{campaign_name}}, {{acos_percentage}}, {{threshold}},             │
│ {{ad_spend}}, {{sales}}, {{time_period}}, {{account_name}}                        │
│                                                                                     │
│ [Save Template] [Send Test] [Preview] [Cancel]                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 6. Implementation Specifications

### 6.1 Subscription Database Schema
```sql
-- Subscription Plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_period VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    features JSONB NOT NULL,
    limits JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User Subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    plan_id UUID REFERENCES subscription_plans(id),
    status VARCHAR(20) NOT NULL, -- 'active', 'cancelled', 'expired'
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Automation Workflows
CREATE TABLE automation_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workflow_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    last_run TIMESTAMP,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email Templates
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    category VARCHAR(100) NOT NULL,
    variables JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 API Endpoints

#### Subscription Management
```typescript
// Subscription endpoints
GET    /api/subscriptions/plans           // Get available plans
POST   /api/subscriptions/subscribe       // Subscribe to plan
PUT    /api/subscriptions/change-plan     // Change subscription plan
DELETE /api/subscriptions/cancel          // Cancel subscription
GET    /api/subscriptions/billing-history // Get billing history

// Admin subscription management
GET    /api/admin/subscriptions           // List all subscriptions
POST   /api/admin/subscriptions/plans     // Create new plan
PUT    /api/admin/subscriptions/plans/:id // Update plan
GET    /api/admin/subscriptions/analytics // Subscription analytics
```

#### Automation System
```typescript
// Automation endpoints
GET    /api/automation/workflows          // Get user workflows
POST   /api/automation/workflows          // Create workflow
PUT    /api/automation/workflows/:id      // Update workflow
DELETE /api/automation/workflows/:id      // Delete workflow
POST   /api/automation/workflows/:id/test // Test workflow
GET    /api/automation/templates          // Get workflow templates
POST   /api/automation/ai-assist          // AI automation assistant
```

#### Notification System
```typescript
// Notification endpoints
GET    /api/notifications                 // Get user notifications
PUT    /api/notifications/:id/read        // Mark as read
DELETE /api/notifications/:id             // Delete notification
GET    /api/notifications/preferences     // Get preferences
PUT    /api/notifications/preferences     // Update preferences

// Admin notification management
POST   /api/admin/notifications/broadcast // Send broadcast
GET    /api/admin/notifications/templates // Email templates
POST   /api/admin/notifications/templates // Create template
PUT    /api/admin/notifications/templates/:id // Update template
```

This comprehensive system adds the missing subscription management, AI-powered automation, and enhanced notification features to create a complete Amazon FDC Tool platform.