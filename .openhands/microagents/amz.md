---
name: Amazon FDC Tool Master AI Agent
type: knowledge
version: 2.0.0
agent: CodeActAgent
triggers:
  - amz
---

# Amazon FDC Tool - Master AI Agent Prompt v2.0

## Project Overview
You are an expert AI agent tasked with building the **Amazon FDC Tool**, a revolutionary Amazon advertising management platform that combines DataFuel's proven features with cutting-edge AI integration through Model Context Protocol (MCP). This tool provides comprehensive automation, enterprise-grade administration, and natural language campaign management capabilities.

## Core Mission
Build a next-generation Amazon advertising management platform that:
- **Replicates DataFuel's entire feature set** with enhanced functionality
- **Implements Model Context Protocol (MCP)** for direct AI agent interaction
- **Provides advanced automation system** with 9 entity levels and AI presets
- **Delivers comprehensive admin panel** with subscription management
- **Enables natural language operations** through AI agent integration
- **Offers enterprise-grade architecture** with multi-channel notifications

## Revolutionary Features

### 1. Model Context Protocol (MCP) Integration
**AI-Native Architecture:**
- Direct AI agent access to campaign management
- Natural language operations for complex tasks
- Persistent context across all interactions
- Tool registration system for dynamic automation
- Resource management for AI-accessible data

### 2. Advanced Automation System
**9-Entity Automation Levels:**
- Portfolios, Campaigns, Ad Groups, Keywords, Product Ads
- Search Terms, Targets, Campaign Negative Keywords, Shared Negative Keywords

**Automation Features:**
- 6 basic automation rule types for common scenarios
- Custom variables system with 10 mathematical operations
- Visual rule builder with conditions and actions
- Flexible scheduling with timezone support
- Performance-based triggers and thresholds

### 3. AI-Powered Automation Presets
**Machine Learning Engine:**
- Performance-based template recommendations
- Seasonal optimization patterns
- Market trend analysis and adaptation
- Competitor response automation
- ROI-focused optimization strategies

### 4. Comprehensive Notification System
**Multi-Channel Delivery:**
- **Email (SMTP)** - Template system with provider support
- **SMS Notifications** - Critical alerts via Twilio/AWS SNS
- **Slack Integration** - Team collaboration with interactive buttons
- **Webhooks** - Third-party integrations with security validation
- **In-App Notifications** - Real-time WebSocket-based alerts

### 5. Enterprise Admin Panel
**Administrative Modules:**
- User Management System with RBAC
- API Key Management with secure storage
- Parameter Logic Editor for custom formulas
- Features Management with A/B testing
- Subscription Management with package design
- System Monitoring with health checks

### 6. User Notification Center
**Advanced Features:**
- Smart notification optimization with AI timing
- Intelligent grouping and categorization
- Team collaboration workflows
- Mobile experience with rich push notifications
- Analytics dashboard for engagement metrics

## Technical Architecture

### Core Technology Stack
- **Frontend**: React 18 + TypeScript + Mantine UI + Recharts
- **Backend**: Node.js + Express + TypeScript + PostgreSQL + Redis
- **AI Integration**: Model Context Protocol (MCP) server
- **APIs**: Amazon Advertising API + Selling Partner API
- **Authentication**: OAuth 2.0 + AWS Signature V4
- **Notifications**: Multi-provider SMTP + WebSocket + Push

### MCP Server Implementation
```typescript
class AmazonFDCMcpServer {
  // Core MCP functionality
  async connect(transportConfig: TransportConfig): Promise<void>;
  registerAllTools(): void;
  registerAllResources(): void;
  
  // Automation tools
  registerTool('create-automation-rule', schema, handler);
  registerTool('optimize-campaign-budget', schema, handler);
  registerTool('analyze-performance', schema, handler);
  
  // Data resources
  registerResource('campaigns', 'amazon-fdc://campaigns/{id}', handler);
  registerResource('keywords', 'amazon-fdc://keywords/{id}', handler);
}
```

### Automation Engine Architecture
```typescript
interface AutomationRule {
  id: string;
  name: string;
  entityType: EntityType; // 9 entity levels
  conditions: Condition[];
  actions: Action[];
  schedule: Schedule;
  variables: CustomVariable[];
  isActive: boolean;
}

interface CustomVariable {
  name: string;
  formula: string; // Mathematical expressions
  dataType: 'number' | 'percentage' | 'currency';
}
```

## Complete Feature Set

### Core DataFuel Features (Replicated)
1. **Main Dashboard** - 8 KPI cards + performance trends
2. **Synopsis Dashboard** - Enhanced analytics with ad type breakdown
3. **Daily Reports** - Comprehensive performance reporting
4. **Opportunity Keywords** - Keyword discovery and optimization
5. **SQP Analysis** - Search Query Performance insights
6. **N-gram Analysis** - Search term pattern analysis
7. **Smart Labels** - Automated campaign categorization
8. **Campaign X** - Advanced campaign management
9. **Day Parting** - Time-based optimization
10. **Keyword Tracker** - Ranking and performance monitoring
11. **Alerts System** - Performance monitoring and notifications

### Advanced Features (Enhanced)
1. **Automation System** - 9-entity automation with custom variables
2. **AI Presets Engine** - Machine learning recommendations
3. **Admin Panel** - Complete administrative control
4. **Subscription Management** - Package design and billing
5. **Notification Center** - Multi-channel alert system
6. **MCP Integration** - AI agent connectivity
7. **Team Collaboration** - Multi-user workflows
8. **Mobile App** - iOS/Android companion

### Enterprise Features (New)
1. **Natural Language Interface** - Conversational campaign management
2. **Predictive Analytics** - AI-powered performance forecasting
3. **Smart Recommendations** - Context-aware optimization
4. **Advanced Integrations** - Third-party tool connectivity
5. **Performance Optimization** - System scaling and monitoring

## Implementation Phases

### Phase 1: Foundation Architecture (Weeks 1-4)
**Core Infrastructure:**
- TypeScript/Node.js modular architecture
- OAuth 2.0 + AWS Signature V4 authentication
- Amazon Advertising API and Partner API clients
- PostgreSQL schema with comprehensive data models
- Basic dashboard with campaign overview

**Key Deliverables:**
- Authentication system with multi-account support
- API client architecture with rate limiting
- Database schema with performance indexes
- Basic UI framework with Mantine components

### Phase 2: Essential Features (Weeks 5-8)
**Campaign Management:**
- Full CRUD operations with bulk actions
- Keyword management and optimization tools
- Basic automation with 6 core rule types
- Reporting system with custom analytics
- Alert framework with basic notifications

**Key Deliverables:**
- Complete campaign management interface
- Keyword optimization tools
- Basic automation rule engine
- Performance reporting dashboard

### Phase 3: Advanced Automation (Weeks 9-12)
**Automation Engine:**
- 9-entity automation system implementation
- Custom variables with mathematical formulas
- AI presets system with ML recommendations
- MCP integration for AI agent connectivity
- Multi-channel notification system

**Key Deliverables:**
- Advanced automation rule builder
- AI-powered preset recommendations
- MCP server with tool registration
- Comprehensive notification system

### Phase 4: Enterprise Features (Weeks 13-16)
**Admin & Management:**
- Complete administrative interface
- Subscription system with package management
- Team collaboration workflows
- Advanced analytics with predictive insights
- Mobile app development

**Key Deliverables:**
- Full admin panel with user management
- Subscription and billing system
- Team collaboration features
- Mobile companion app

### Phase 5: AI & Optimization (Weeks 17-20)
**AI Integration:**
- Natural language interface implementation
- Predictive analytics with forecasting
- Smart recommendations engine
- Advanced third-party integrations
- Performance optimization and scaling

**Key Deliverables:**
- Conversational campaign management
- AI-powered performance predictions
- Context-aware optimization system
- Production deployment and monitoring

## Quality Standards

### Code Quality Requirements
- **TypeScript**: Strict mode with comprehensive type definitions
- **Testing**: 90%+ code coverage with unit, integration, and E2E tests
- **Architecture**: Modular design following SOLID principles
- **Documentation**: Complete API documentation and code comments
- **Security**: Enterprise-grade security with audit logging

### Performance Benchmarks
- **Page Load**: <1.5 seconds for dashboard initialization
- **API Response**: <300ms for most endpoints
- **Database Queries**: <50ms for optimized queries
- **Real-time Updates**: <100ms WebSocket latency
- **Memory Usage**: Efficient resource management

### Security Standards
- **Authentication**: OAuth 2.0 with JWT and refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encryption at rest and in transit
- **API Security**: Rate limiting and request validation
- **Audit Logging**: Comprehensive activity tracking

## Success Criteria

### Functional Requirements
1. **Complete Feature Parity** - All DataFuel features replicated and enhanced
2. **AI Integration** - Successful MCP implementation with AI agent access
3. **Automation System** - 9-entity automation with custom variables
4. **Admin Panel** - Complete administrative control and monitoring
5. **Notification System** - Multi-channel alert delivery

### Performance Requirements
1. **Scalability** - Support for 1000+ concurrent users
2. **Data Processing** - Handle millions of records efficiently
3. **Real-time Updates** - Sub-second data synchronization
4. **API Performance** - 99.9% uptime with <300ms response times
5. **Mobile Performance** - Smooth experience on all devices

### Business Requirements
1. **User Experience** - Intuitive interface exceeding DataFuel's UX
2. **Data Accuracy** - Precise KPI calculations matching Amazon data
3. **Enterprise Readiness** - Production-grade security and monitoring
4. **Competitive Advantage** - AI-powered features beyond competitors
5. **Market Differentiation** - Revolutionary MCP integration

## Implementation Guidelines

### Development Approach
1. **Documentation-Driven** - Follow comprehensive specifications
2. **Test-Driven Development** - Write tests before implementation
3. **Incremental Delivery** - Build and deploy in phases
4. **Performance-First** - Optimize from the beginning
5. **Security-by-Design** - Implement security at every layer

### Code Organization
```
src/
├── api/              # API client implementations
├── auth/             # Authentication and security
├── automation/       # Automation engine and rules
├── mcp/              # Model Context Protocol server
├── notifications/    # Multi-channel notification system
├── admin/            # Administrative panel
├── dashboard/        # Main application interface
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and helpers
```

### Quality Assurance
- **Code Reviews** - Mandatory peer review for all changes
- **Automated Testing** - CI/CD pipeline with comprehensive tests
- **Performance Monitoring** - Real-time application monitoring
- **Security Scanning** - Automated vulnerability assessment
- **User Testing** - Regular UX validation and feedback

## Available Documentation

### Core Documentation
- **Master Documentation** (`docs/MASTER_DOCUMENTATION.md`) - Complete system overview
- **DataFuel Analysis** (`docs/datafuel_analysis.md`) - Application analysis
- **Implementation Guide** (`docs/implementation_guide.md`) - Technical specifications

### Advanced Features Documentation
- **Automation System** (`docs/automation_system_architecture.md`) - Complete automation specs
- **AI Presets** (`docs/ai_automation_presets.md`) - ML-powered recommendations
- **Notification System** (`docs/notification_system.md`) - Multi-channel alerts
- **Admin Panel** (`docs/admin_panel_requirements.md`) - Administrative features
- **MCP Analysis** (`docs/amazon_seller_mcp_analysis.md`) - AI integration strategy

### Specialized Documentation
- **Subscription System** (`docs/admin_subscription_manager.md`) - Package management
- **User Notifications** (`docs/user_notification_center.md`) - Notification center
- **Requirements** (`docs/datafuel_replication_requirements.md`) - Technical requirements

## Next Steps

1. **Review Documentation** - Study all provided specifications thoroughly
2. **Set Up Architecture** - Implement modular TypeScript foundation
3. **Build Core Features** - Start with authentication and basic dashboard
4. **Implement Automation** - Create advanced automation engine
5. **Add AI Integration** - Implement MCP server and AI connectivity
6. **Deploy Enterprise Features** - Complete admin panel and notifications
7. **Optimize and Scale** - Performance tuning and production deployment

This master prompt provides the complete blueprint for building Amazon FDC Tool as a revolutionary Amazon advertising management platform with cutting-edge AI integration and enterprise-grade capabilities.