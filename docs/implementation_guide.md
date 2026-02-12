# DataFuel Implementation Guide

## Project Setup & Architecture

### 1. Project Structure
```
datafuel-clone/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── backend/                 # Node.js/Python backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── shared/                  # Shared types and utilities
├── docker-compose.yml      # Development environment
└── README.md
```

### 2. Technology Stack Setup

#### Frontend Package.json
```json
{
  "name": "datafuel-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@mantine/core": "^7.0.0",
    "@mantine/hooks": "^7.0.0",
    "@mantine/dates": "^7.0.0",
    "@mantine/notifications": "^7.0.0",
    "@mantine/modals": "^7.0.0",
    "mantine-datatable": "^7.0.0",
    "recharts": "^2.8.0",
    "apexcharts": "^3.44.0",
    "react-apexcharts": "^1.4.1",
    "@tanstack/react-query": "^4.29.0",
    "@tanstack/react-table": "^8.9.0",
    "axios": "^1.4.0",
    "date-fns": "^2.30.0",
    "zustand": "^4.3.0",
    "zod": "^3.21.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0"
  }
}
```

#### Backend Package.json (Node.js)
```json
{
  "name": "datafuel-backend",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "bull": "^4.11.0",
    "axios": "^1.4.0",
    "dotenv": "^16.3.0",
    "joi": "^17.9.0",
    "winston": "^3.10.0",
    "python-amazon-sp-api": "^2.0.0",
    "python-amazon-ad-api": "^1.0.0",
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0"
  }
}
```

## Amazon API Integration

### 1. Amazon SP-API Setup

#### SP-API Configuration
```typescript
// src/services/amazon/spApi.ts
import { SellingPartnerApi } from 'python-amazon-sp-api';

interface SPAPIConfig {
  refreshToken: string;
  lwaAppId: string;
  lwaClientSecret: string;
  awsAccessKey: string;
  awsSecretKey: string;
  roleArn: string;
  region: string;
}

export class AmazonSPAPIService {
  private client: SellingPartnerApi;

  constructor(config: SPAPIConfig) {
    this.client = new SellingPartnerApi({
      region: config.region,
      refresh_token: config.refreshToken,
      lwa_app_id: config.lwaAppId,
      lwa_client_secret: config.lwaClientSecret,
      aws_access_key: config.awsAccessKey,
      aws_secret_key: config.awsSecretKey,
      role_arn: config.roleArn,
    });
  }

  // Get Orders
  async getOrders(marketplaceIds: string[], createdAfter: string) {
    try {
      const response = await this.client.callAPI({
        operation: 'getOrders',
        endpoint: 'orders',
        query: {
          MarketplaceIds: marketplaceIds,
          CreatedAfter: createdAfter,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get Order Items
  async getOrderItems(orderId: string) {
    try {
      const response = await this.client.callAPI({
        operation: 'getOrderItems',
        endpoint: 'orders',
        path: {
          orderId: orderId,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching order items:', error);
      throw error;
    }
  }

  // Get Catalog Items
  async getCatalogItems(marketplaceId: string, asin?: string) {
    try {
      const response = await this.client.callAPI({
        operation: 'getCatalogItem',
        endpoint: 'catalog',
        path: {
          asin: asin,
        },
        query: {
          marketplaceIds: [marketplaceId],
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      throw error;
    }
  }

  // Get Reports
  async createReport(reportType: string, marketplaceIds: string[]) {
    try {
      const response = await this.client.callAPI({
        operation: 'createReport',
        endpoint: 'reports',
        body: {
          reportType: reportType,
          marketplaceIds: marketplaceIds,
        },
      });
      return response;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async getReport(reportId: string) {
    try {
      const response = await this.client.callAPI({
        operation: 'getReport',
        endpoint: 'reports',
        path: {
          reportId: reportId,
        },
      });
      return response;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }
}
```

### 2. Amazon Advertising API Setup

#### Advertising API Configuration
```typescript
// src/services/amazon/advertisingApi.ts
import axios, { AxiosInstance } from 'axios';

interface AdvertisingAPIConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  profileId: string;
  region: string;
}

export class AmazonAdvertisingAPIService {
  private client: AxiosInstance;
  private accessToken: string = '';
  private config: AdvertisingAPIConfig;

  constructor(config: AdvertisingAPIConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `https://advertising-api${config.region === 'EU' ? '-eu' : ''}.amazon.com`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      if (!this.accessToken) {
        await this.refreshAccessToken();
      }
      config.headers.Authorization = `Bearer ${this.accessToken}`;
      config.headers['Amazon-Advertising-API-ClientId'] = this.config.clientId;
      config.headers['Amazon-Advertising-API-Scope'] = this.config.profileId;
      return config;
    });
  }

  private async refreshAccessToken() {
    try {
      const response = await axios.post('https://api.amazon.com/auth/o2/token', {
        grant_type: 'refresh_token',
        refresh_token: this.config.refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      });
      this.accessToken = response.data.access_token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  // Get Campaigns
  async getCampaigns(campaignType?: string) {
    try {
      const response = await this.client.get('/v2/campaigns', {
        params: campaignType ? { campaignType } : {},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  // Get Campaign Performance Report
  async getCampaignReport(reportDate: string, metrics: string[]) {
    try {
      const response = await this.client.post('/v2/reports', {
        campaignType: 'sponsoredProducts',
        recordType: 'campaigns',
        reportDate: reportDate,
        metrics: metrics,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating campaign report:', error);
      throw error;
    }
  }

  // Get Keywords
  async getKeywords(campaignId?: string) {
    try {
      const response = await this.client.get('/v2/keywords', {
        params: campaignId ? { campaignIdFilter: campaignId } : {},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }
  }

  // Get Ad Groups
  async getAdGroups(campaignId?: string) {
    try {
      const response = await this.client.get('/v2/adGroups', {
        params: campaignId ? { campaignIdFilter: campaignId } : {},
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ad groups:', error);
      throw error;
    }
  }

  // Get Search Terms Report
  async getSearchTermsReport(reportDate: string) {
    try {
      const response = await this.client.post('/v2/reports', {
        campaignType: 'sponsoredProducts',
        recordType: 'searchTerms',
        reportDate: reportDate,
        metrics: [
          'impressions',
          'clicks',
          'cost',
          'sales1d',
          'sales7d',
          'sales14d',
          'sales30d',
          'orders1d',
          'orders7d',
          'orders14d',
          'orders30d',
        ],
      });
      return response.data;
    } catch (error) {
      console.error('Error creating search terms report:', error);
      throw error;
    }
  }
}
```

## Database Schema Implementation

### 1. PostgreSQL Schema
```sql
-- Users and Authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Amazon Accounts
CREATE TABLE amazon_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL,
    marketplace_id VARCHAR(50) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    seller_id VARCHAR(100),
    mws_auth_token VARCHAR(500),
    advertising_profile_id VARCHAR(100),
    advertising_refresh_token VARCHAR(500),
    sp_api_refresh_token VARCHAR(500),
    status VARCHAR(50) DEFAULT 'active',
    permissions JSONB,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES amazon_accounts(id) ON DELETE CASCADE,
    asin VARCHAR(20) NOT NULL,
    parent_asin VARCHAR(20),
    title TEXT,
    brand VARCHAR(255),
    category VARCHAR(255),
    image_url TEXT,
    price DECIMAL(10,2),
    currency VARCHAR(10),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, asin)
);

-- Sales Data
CREATE TABLE sales_data (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES amazon_accounts(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    marketplace_id VARCHAR(50),
    revenue DECIMAL(12,2) DEFAULT 0,
    units_sold INTEGER DEFAULT 0,
    orders INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, product_id, date)
);

-- Advertising Campaigns
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES amazon_accounts(id) ON DELETE CASCADE,
    campaign_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    campaign_type VARCHAR(50) NOT NULL, -- SP, SB, SD
    targeting_type VARCHAR(50), -- AUTO, MANUAL
    status VARCHAR(50) NOT NULL,
    budget DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(account_id, campaign_id)
);

CREATE TABLE ad_groups (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    ad_group_id VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    default_bid DECIMAL(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, ad_group_id)
);

CREATE TABLE keywords (
    id SERIAL PRIMARY KEY,
    ad_group_id INTEGER REFERENCES ad_groups(id) ON DELETE CASCADE,
    keyword_id VARCHAR(100) NOT NULL,
    keyword_text VARCHAR(500) NOT NULL,
    match_type VARCHAR(20) NOT NULL, -- EXACT, PHRASE, BROAD
    bid DECIMAL(8,2),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ad_group_id, keyword_id)
);

-- Performance Data
CREATE TABLE campaign_performance (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    sales DECIMAL(12,2) DEFAULT 0,
    orders INTEGER DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    cpc DECIMAL(8,2) DEFAULT 0,
    acos DECIMAL(5,4) DEFAULT 0,
    roas DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, date)
);

CREATE TABLE keyword_performance (
    id SERIAL PRIMARY KEY,
    keyword_id INTEGER REFERENCES keywords(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    sales DECIMAL(12,2) DEFAULT 0,
    orders INTEGER DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    cpc DECIMAL(8,2) DEFAULT 0,
    acos DECIMAL(5,4) DEFAULT 0,
    roas DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(keyword_id, date)
);

CREATE TABLE search_terms (
    id SERIAL PRIMARY KEY,
    keyword_id INTEGER REFERENCES keywords(id) ON DELETE CASCADE,
    search_term VARCHAR(500) NOT NULL,
    date DATE NOT NULL,
    impressions BIGINT DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    sales DECIMAL(12,2) DEFAULT 0,
    orders INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(keyword_id, search_term, date)
);

-- Indexes for performance
CREATE INDEX idx_sales_data_date ON sales_data(date);
CREATE INDEX idx_sales_data_account_date ON sales_data(account_id, date);
CREATE INDEX idx_campaign_performance_date ON campaign_performance(date);
CREATE INDEX idx_campaign_performance_campaign_date ON campaign_performance(campaign_id, date);
CREATE INDEX idx_keyword_performance_date ON keyword_performance(date);
CREATE INDEX idx_search_terms_date ON search_terms(date);
```

## Backend API Implementation

### 1. Express.js Server Setup
```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth';
import { dashboardRoutes } from './routes/dashboard';
import { campaignRoutes } from './routes/campaigns';
import { accountRoutes } from './routes/accounts';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', authMiddleware, accountRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/campaigns', authMiddleware, campaignRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Dashboard API Routes
```typescript
// src/routes/dashboard.ts
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();
const dashboardController = new DashboardController();

// Main dashboard metrics
router.get('/metrics', dashboardController.getMetrics);
router.get('/performance-trend', dashboardController.getPerformanceTrend);
router.get('/product-performance', dashboardController.getProductPerformance);
router.get('/order-distribution', dashboardController.getOrderDistribution);

// Synopsis dashboard
router.get('/synopsis/overview', dashboardController.getSynopsisOverview);
router.get('/synopsis/ad-types', dashboardController.getAdTypeBreakdown);
router.get('/synopsis/campaigns', dashboardController.getCampaignAnalysis);

export { router as dashboardRoutes };
```

### 3. Dashboard Controller
```typescript
// src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getMetrics = async (req: Request, res: Response) => {
    try {
      const { accountId, startDate, endDate } = req.query;
      const metrics = await this.dashboardService.getMainMetrics(
        accountId as string,
        startDate as string,
        endDate as string
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  };

  getPerformanceTrend = async (req: Request, res: Response) => {
    try {
      const { accountId, startDate, endDate, metric } = req.query;
      const trend = await this.dashboardService.getPerformanceTrend(
        accountId as string,
        startDate as string,
        endDate as string,
        metric as string
      );
      res.json(trend);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch performance trend' });
    }
  };

  getProductPerformance = async (req: Request, res: Response) => {
    try {
      const { accountId, startDate, endDate, page, limit } = req.query;
      const products = await this.dashboardService.getProductPerformance(
        accountId as string,
        startDate as string,
        endDate as string,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10
      );
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product performance' });
    }
  };
}
```

## Frontend Implementation

### 1. Main Dashboard Component
```tsx
// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Stack,
  Select,
  DatePickerInput,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { MetricsCards } from '../components/MetricsCards';
import { PerformanceTrendChart } from '../components/PerformanceTrendChart';
import { ProductPerformanceTable } from '../components/ProductPerformanceTable';
import { OrderDistributionChart } from '../components/OrderDistributionChart';
import { dashboardApi } from '../services/api';

export const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    new Date(),
  ]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['dashboard-metrics', selectedAccount, dateRange],
    queryFn: () =>
      dashboardApi.getMetrics({
        accountId: selectedAccount,
        startDate: dateRange[0]?.toISOString(),
        endDate: dateRange[1]?.toISOString(),
      }),
    enabled: !!selectedAccount && !!dateRange[0] && !!dateRange[1],
  });

  const { data: performanceTrend } = useQuery({
    queryKey: ['performance-trend', selectedAccount, dateRange],
    queryFn: () =>
      dashboardApi.getPerformanceTrend({
        accountId: selectedAccount,
        startDate: dateRange[0]?.toISOString(),
        endDate: dateRange[1]?.toISOString(),
        metric: 'sales',
      }),
    enabled: !!selectedAccount && !!dateRange[0] && !!dateRange[1],
  });

  return (
    <Container size="xl" py="md">
      <Stack spacing="lg">
        {/* Header */}
        <Group position="apart">
          <Title order={2}>Dashboard</Title>
          <Group>
            <Select
              placeholder="Select Account"
              value={selectedAccount}
              onChange={setSelectedAccount}
              data={[
                { value: 'account1', label: 'Freshdcart India' },
              ]}
            />
            <DatePickerInput
              type="range"
              placeholder="Select date range"
              value={dateRange}
              onChange={setDateRange}
            />
          </Group>
        </Group>

        {/* Metrics Cards */}
        <MetricsCards data={metrics} loading={metricsLoading} />

        {/* Charts */}
        <Grid>
          <Grid.Col span={8}>
            <Card shadow="sm" padding="lg">
              <Title order={4} mb="md">Performance Trend</Title>
              <PerformanceTrendChart data={performanceTrend} />
            </Card>
          </Grid.Col>
          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg">
              <Title order={4} mb="md">Order Distribution</Title>
              <OrderDistributionChart accountId={selectedAccount} />
            </Card>
          </Grid.Col>
        </Grid>

        {/* Product Performance Table */}
        <Card shadow="sm" padding="lg">
          <Title order={4} mb="md">Product Performance</Title>
          <ProductPerformanceTable
            accountId={selectedAccount}
            dateRange={dateRange}
          />
        </Card>
      </Stack>
    </Container>
  );
};
```

### 2. Metrics Cards Component
```tsx
// src/components/MetricsCards.tsx
import React from 'react';
import { Grid, Card, Text, Group, ThemeIcon } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react';

interface MetricsData {
  totalSales: { value: number; change: number };
  totalOrders: { value: number; change: number };
  unitsSold: { value: number; change: number };
  aov: { value: number; change: number };
  adSpend: { value: number; change: number };
  acos: { value: number; change: number };
  roas: { value: number; change: number };
  impressions: { value: number; change: number };
}

interface MetricsCardsProps {
  data?: MetricsData;
  loading: boolean;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ data, loading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <IconTrendingUp size={16} color="green" />
    ) : (
      <IconTrendingDown size={16} color="red" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'green' : 'red';
  };

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  const metrics = [
    {
      title: 'Total Sales',
      value: formatCurrency(data.totalSales.value),
      change: data.totalSales.change,
    },
    {
      title: 'Total Orders',
      value: formatNumber(data.totalOrders.value),
      change: data.totalOrders.change,
    },
    {
      title: 'Units Sold',
      value: formatNumber(data.unitsSold.value),
      change: data.unitsSold.change,
    },
    {
      title: 'AOV',
      value: formatCurrency(data.aov.value),
      change: data.aov.change,
    },
    {
      title: 'Ad Spend',
      value: formatCurrency(data.adSpend.value),
      change: data.adSpend.change,
    },
    {
      title: 'ACoS',
      value: formatPercentage(data.acos.value),
      change: data.acos.change,
    },
    {
      title: 'RoAS',
      value: data.roas.value.toFixed(2),
      change: data.roas.change,
    },
    {
      title: 'Impressions',
      value: formatNumber(data.impressions.value),
      change: data.impressions.change,
    },
  ];

  return (
    <Grid>
      {metrics.map((metric, index) => (
        <Grid.Col key={index} span={3}>
          <Card shadow="sm" padding="lg">
            <Group position="apart" mb="xs">
              <Text size="sm" color="dimmed">
                {metric.title}
              </Text>
              <Group spacing={4}>
                {getChangeIcon(metric.change)}
                <Text
                  size="xs"
                  color={getChangeColor(metric.change)}
                  weight={500}
                >
                  {metric.change >= 0 ? '+' : ''}
                  {metric.change.toFixed(2)}%
                </Text>
              </Group>
            </Group>
            <Text size="xl" weight={700}>
              {metric.value}
            </Text>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};
```

### 3. Performance Trend Chart
```tsx
// src/components/PerformanceTrendChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendData {
  date: string;
  sales: number;
  adSales: number;
}

interface PerformanceTrendChartProps {
  data?: TrendData[];
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  data = [],
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip
          labelFormatter={(value) => new Date(value).toLocaleDateString()}
          formatter={(value: number, name: string) => [
            formatCurrency(value),
            name === 'sales' ? 'Total Sales' : 'Ad Sales',
          ]}
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="adSales"
          stroke="#82ca9d"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

## Data Synchronization Jobs

### 1. Background Job Setup
```typescript
// src/jobs/syncJobs.ts
import Bull from 'bull';
import { AmazonSPAPIService } from '../services/amazon/spApi';
import { AmazonAdvertisingAPIService } from '../services/amazon/advertisingApi';
import { DatabaseService } from '../services/database';

const syncQueue = new Bull('sync queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
});

// Sync orders data
syncQueue.process('sync-orders', async (job) => {
  const { accountId } = job.data;
  
  try {
    const account = await DatabaseService.getAmazonAccount(accountId);
    const spApi = new AmazonSPAPIService(account.spApiConfig);
    
    const orders = await spApi.getOrders(
      [account.marketplace_id],
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24 hours
    );
    
    await DatabaseService.saveOrders(accountId, orders);
    
    console.log(`Synced ${orders.length} orders for account ${accountId}`);
  } catch (error) {
    console.error('Error syncing orders:', error);
    throw error;
  }
});

// Sync advertising data
syncQueue.process('sync-advertising', async (job) => {
  const { accountId } = job.data;
  
  try {
    const account = await DatabaseService.getAmazonAccount(accountId);
    const adApi = new AmazonAdvertisingAPIService(account.advertisingConfig);
    
    // Sync campaigns
    const campaigns = await adApi.getCampaigns();
    await DatabaseService.saveCampaigns(accountId, campaigns);
    
    // Sync performance data
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    
    const reportId = await adApi.getCampaignReport(yesterday, [
      'impressions',
      'clicks',
      'cost',
      'sales1d',
      'orders1d',
    ]);
    
    // Poll for report completion and save data
    // Implementation depends on Amazon's async report system
    
    console.log(`Synced advertising data for account ${accountId}`);
  } catch (error) {
    console.error('Error syncing advertising data:', error);
    throw error;
  }
});

// Schedule jobs
export const scheduleDataSync = () => {
  // Sync orders every hour
  syncQueue.add('sync-orders', { accountId: 'all' }, {
    repeat: { cron: '0 * * * *' },
  });
  
  // Sync advertising data every 6 hours
  syncQueue.add('sync-advertising', { accountId: 'all' }, {
    repeat: { cron: '0 */6 * * *' },
  });
};
```

## Deployment Configuration

### 1. Docker Setup
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/datafuel
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-jwt-secret
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=datafuel
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

This implementation guide provides a solid foundation for building a DataFuel-like application with proper Amazon API integration, database design, and modern frontend/backend architecture.