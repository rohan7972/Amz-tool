# Amazon FDC Tool - Project Overview

## 🎯 What is Amazon FDC Tool?

Amazon FDC Tool is a **next-generation Amazon advertising management platform** that combines advanced automation, enterprise-grade administration, and AI-native capabilities. It's designed to help Amazon sellers and agencies optimize their advertising campaigns with cutting-edge technology.

This is a **comprehensive full-stack application** that integrates with Amazon's Selling Partner API (SP-API) and Advertising API to provide real-time campaign management and analytics.

---

## 🚀 Key Features

### 1. **AI-Native Architecture**
- **Model Context Protocol (MCP) Integration**: Direct AI agent access for conversational campaign management
- **Natural Language Operations**: Manage campaigns through conversation with Claude and other AI agents
- **Persistent Context**: AI maintains full context across all operations
- **Tool Registration System**: Dynamic automation tool discovery

### 2. **Advanced Automation System**
- **9-Entity Automation Levels**: 
  - Portfolios
  - Campaigns
  - Ad Groups
  - Keywords
  - Product Ads
  - Search Terms
  - Targets
  - Campaign Negative Keywords
  - Shared Negative Keywords
- **Custom Variables System**: Mathematical formula builder with 10 operations
- **AI-Powered Presets**: Machine learning recommendations based on performance patterns
- **Visual Rule Builder**: Intuitive interface with conditions, operators, and actions
- **Flexible Scheduling**: Timezone-aware execution with performance triggers

### 3. **Comprehensive Notification System**
- **Multi-Channel Delivery**: 
  - Email (SMTP)
  - SMS
  - Slack
  - Webhooks
  - In-App notifications
- **Smart Optimization**: AI-powered delivery timing and frequency
- **Team Collaboration**: Shared notifications and assignment workflows
- **Mobile Integration**: Rich push notifications with quick actions

### 4. **Enterprise Admin Panel**
- **User Management**: Role-based access control with lifecycle management
- **API Key Management**: Secure credential storage and validation
- **Parameter Logic Editor**: Dynamic rule configuration with conditional logic
- **Features Management**: Feature flag system for controlled rollouts
- **Subscription Management**: Package design, billing, and usage monitoring
- **System Monitoring**: Performance metrics, health checks, and audit logs

### 5. **Complete DataFuel Feature Set**
- **Main Dashboard**: 8 KPI cards with performance trends and analytics
- **Synopsis Dashboard**: Enhanced analytics with ad type breakdown
- **Daily Reports**: Comprehensive performance reporting with export capabilities
- **Opportunity Keywords**: Advanced keyword discovery and optimization
- **SQP Analysis**: Search Query Performance insights and recommendations
- **N-gram Analysis**: Search term pattern analysis and optimization
- **Smart Labels**: Automated campaign categorization and management
- **Campaign X**: Advanced campaign management with bulk operations
- **Day Parting**: Time-based optimization and scheduling
- **Keyword Tracker**: Ranking and performance monitoring
- **Alerts System**: Proactive performance monitoring and notifications

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Components**: Mantine UI
- **Charting**: Recharts
- **State Management**: Built-in React state with context
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Caching**: Redis 6+
- **Authentication**: OAuth 2.0 + JWT + AWS Signature V4

### AI & Automation
- **MCP Server**: Model Context Protocol for AI agent connectivity
- **Automation Engine**: Rule-based campaign optimization
- **AI Integration**: Claude and other LLM agent support

### APIs & Integrations
- **Amazon APIs**: 
  - Selling Partner API (SP-API)
  - Advertising API
- **Authentication**: AWS Signature V4 signing
- **Webhooks**: Custom webhook support

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL with migrations
- **Cache**: Redis for session and data caching
- **SSL/TLS**: Domain and SSL certificate support

---

## 📊 Key Metrics & KPIs

### Performance Metrics
- **Sales Metrics**: Total Sales, Organic Sales, Ad Sales, AOV
- **Order Metrics**: Total Orders, Organic Orders, Ad Orders
- **Advertising Metrics**: ACoS, TACoS, RoAS, CPC, CTR, CVR
- **Efficiency Metrics**: Impression Share, Quality Score, Bid Efficiency

### Advanced Analytics
- **Trend Analysis**: Period-over-period comparisons with change indicators
- **Segmentation**: Performance breakdown by campaign type, match type, placement
- **Attribution**: Multi-touch attribution modeling for accurate ROI calculation
- **Forecasting**: AI-powered performance predictions and recommendations

---

## 📁 Project Structure

```
Amazon-FDC-Tool/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Utility functions
│   └── package.json
│
├── backend/               # Node.js/Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Utility functions
│   ├── migrations/       # Database migrations
│   └── package.json
│
├── docs/                  # Documentation
├── docker-compose.yml     # Local development Docker setup
├── docker-compose.prod.yml # Production Docker setup
├── package.json          # Root package.json with workspaces
└── .env.example          # Example environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose (optional, for containerized deployment)
- Amazon Developer Account (for API access)

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install:all
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Setup Database**
   ```bash
   cd backend
   npm run migrations
   ```

4. **Start Development Servers**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

---

## 🔐 Security Considerations

### API Credentials
- **Never commit `.env` files** with real credentials
- Use `.env.example` as a template
- Rotate API keys regularly
- Use environment variables for sensitive data
- Enable API rate limiting and request signing

### Database Security
- Use strong, unique passwords for database users
- Enable SSL/TLS for database connections
- Regular backups and disaster recovery
- Principle of least privilege for database roles

### Authentication
- JWT tokens with short expiration (15 minutes)
- Refresh token rotation
- Secure session storage with Redis
- CORS properly configured for allowed origins

### OAuth 2.0
- Note: Amazon Advertising API only works in production with real credentials
- Sandbox mode limitations apply
- Regular security audits of authorization scopes

---

## 📚 Key Documentation

- [Setup Guide](./LOCAL_DEVELOPMENT_SETUP.md) - Local development setup
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
- [Docker Setup](./DOCKER_SETUP_GUIDE.md) - Docker containerization
- [OAuth Configuration](./OAUTH_SETUP_GUIDE.md) - OAuth 2.0 setup
- [API Integration](./API_INTEGRATION_ARCHITECTURE.md) - API architecture details

---

## 🤝 Contributing

This project follows standard Git workflows. When contributing:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit with clear messages
4. Create a pull request

**Important**: Never commit credentials or sensitive data. Use `.env.example` for configuration templates.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 🆘 Support & Issues

- Review existing documentation in the `docs/` folder
- Check related guides for specific features
- For issues, check the troubleshooting sections in respective guides

---

## 🎓 Learning & Resources

- **Amazon SP-API Documentation**: https://developer.amazon.com/
- **Express.js Guide**: https://expressjs.com/
- **React Documentation**: https://react.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Redis Documentation**: https://redis.io/documentation/

---

## 📊 Performance & Optimization

The tool is built with performance in mind:
- **Caching**: Redis for frequently accessed data
- **Database Indexing**: Optimized queries and indexes
- **API Rate Limiting**: Respect Amazon API limits
- **Pagination**: Large datasets handled with pagination
- **Lazy Loading**: Components load on demand

---

## 🔄 Version History

- **v1.0.0** - Initial release
  - Core feature set based on DataFuel
  - AI integration via MCP
  - Advanced automation system
  - Enterprise admin panel

---

**Last Updated**: February 2026
