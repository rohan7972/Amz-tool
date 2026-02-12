# DataFuel Replication - Complete Resources List

## Amazon APIs & Documentation

### 1. Amazon Selling Partner API (SP-API) - Successor to MWS
**Official Documentation**: https://developer-docs.amazon.com/sp-api/

#### Key API Endpoints:
- **Orders API**: Get order information and buyer information
- **Catalog Items API**: Get item details and search for items
- **Inventory API**: Get inventory summaries
- **Reports API**: Get various business reports
- **Notifications API**: Get real-time notifications
- **Feeds API**: Submit inventory and order data
- **FBA Inventory API**: Get FBA inventory information
- **Sales API**: Get sales metrics and data

#### Authentication:
- **LWA (Login with Amazon)**: OAuth 2.0 authentication
- **IAM Roles**: For secure API access
- **Refresh Tokens**: For maintaining long-term access

### 2. Amazon Advertising API
**Official Documentation**: https://advertising.amazon.com/API/docs/

#### Key API Endpoints:
- **Campaigns API**: Manage sponsored product, brand, and display campaigns
- **Ad Groups API**: Manage ad groups within campaigns
- **Keywords API**: Manage keyword targeting and bidding
- **Product Ads API**: Manage product advertisements
- **Reports API**: Get advertising performance reports
- **Portfolios API**: Manage campaign portfolios
- **Targeting API**: Manage audience and product targeting
- **Bid Recommendations API**: Get bid suggestions

#### Campaign Types:
- **Sponsored Products (SP)**: Product-targeted ads
- **Sponsored Brands (SB)**: Brand-focused advertising
- **Sponsored Display (SD)**: Display advertising

### 3. Amazon Product Advertising API (PA-API 5.0)
**Official Documentation**: https://webservices.amazon.com/paapi5/documentation/

#### Use Cases:
- Product search and discovery
- Product information retrieval
- Price and availability checking
- Customer reviews and ratings

## GitHub Repositories & SDKs

### Python Libraries

#### 1. Amazon SP-API Python SDK
- **Repository**: https://github.com/saleweaver/python-amazon-sp-api
- **Stars**: 609⭐
- **Description**: Python wrapper for Amazon Selling Partner API
- **Features**: Complete SP-API coverage, authentication handling, rate limiting
- **Installation**: `pip install python-amazon-sp-api`

#### 2. Python Amazon Advertising API
- **Repository**: https://github.com/denisneuf/python-amazon-ad-api
- **Stars**: 165⭐
- **Description**: Python Amazon Advertising API wrapper
- **Features**: Campaign management, reporting, bid optimization
- **Installation**: `pip install python-amazon-ad-api`

#### 3. Python Amazon MWS (Legacy)
- **Repository**: https://github.com/python-amazon-mws/python-amazon-mws
- **Stars**: 380⭐
- **Description**: Python wrapper for Amazon MWS API (deprecated)
- **Status**: Archived (use SP-API instead)

#### 4. Bottlenose (Product Advertising API)
- **Repository**: https://github.com/lionheart/bottlenose
- **Stars**: 267⭐
- **Description**: Python wrapper for Amazon Product Advertising API
- **Installation**: `pip install bottlenose`

### Node.js Libraries

#### 1. Amazon MWS API for Node.js
- **Repository**: https://github.com/beardon/mws-api
- **Stars**: 79⭐
- **Description**: Node.js wrapper for Amazon MWS API
- **Installation**: `npm install mws-api`

#### 2. Amazon SP-API Node.js SDK
- **Repository**: https://github.com/amzapi/selling-partner-api-sdk
- **Stars**: 70⭐
- **Description**: Golang toolkit (also has Node.js examples)

### Other Languages

#### 1. Ruby SP-API SDK
- **Repository**: https://github.com/ericcj/amz_sp_api
- **Stars**: 49⭐
- **Description**: Ruby gem for Amazon Selling Partner API
- **Installation**: `gem install amz_sp_api`

#### 2. Go SP-API SDK
- **Repository**: https://github.com/amzapi/selling-partner-api-sdk
- **Stars**: 70⭐
- **Description**: Golang toolkit for Amazon SP-API

## Frontend Technologies & UI Libraries

### React Dashboard Templates & Components

#### 1. HyperDX (Analytics Platform)
- **Repository**: https://github.com/hyperdxio/hyperdx
- **Stars**: 9,130⭐
- **Description**: Open source observability platform with React dashboard
- **Tech Stack**: TypeScript, React, ClickHouse, OpenTelemetry
- **Features**: Session replays, logs, metrics, traces

#### 2. ChartBrew (Dashboard Builder)
- **Repository**: https://github.com/chartbrew/chartbrew
- **Stars**: 3,497⭐
- **Description**: Open-source dashboard builder with React frontend
- **Tech Stack**: React, Node.js, Chart.js
- **Features**: API connections, real-time dashboards, multiple data sources

#### 3. Datart (Data Visualization)
- **Repository**: https://github.com/running-elephant/datart
- **Stars**: 2,950⭐
- **Description**: Next generation data visualization platform
- **Tech Stack**: React, TypeScript, Spring Boot
- **Features**: Interactive dashboards, data analysis, visualization

#### 4. Mantine Admin Dashboard
- **Repository**: https://github.com/mantinedev/mantine-admin-dashboard-template
- **Stars**: 342⭐
- **Description**: Modern admin dashboard template
- **Tech Stack**: React, TypeScript, Mantine UI
- **Features**: Full calendar, data tables, charts, authentication

#### 5. Propel UI Kit
- **Repository**: https://github.com/propeldata/ui-kit
- **Stars**: 123⭐
- **Description**: React components for data visualization
- **Features**: Analytics dashboards, data visualization components

### Chart & Visualization Libraries

#### 1. Chart.js
- **Website**: https://www.chartjs.org/
- **NPM**: `npm install chart.js react-chartjs-2`
- **Features**: Responsive charts, animations, multiple chart types

#### 2. Recharts
- **Website**: https://recharts.org/
- **NPM**: `npm install recharts`
- **Features**: React-specific charts, composable components

#### 3. ApexCharts
- **Website**: https://apexcharts.com/
- **NPM**: `npm install apexcharts react-apexcharts`
- **Features**: Interactive charts, real-time updates, modern design

#### 4. D3.js
- **Website**: https://d3js.org/
- **NPM**: `npm install d3`
- **Features**: Custom visualizations, data manipulation, SVG rendering

#### 5. Victory
- **Website**: https://formidable.com/open-source/victory/
- **NPM**: `npm install victory`
- **Features**: React-native compatible, modular, accessible

### UI Component Libraries

#### 1. Material-UI (MUI)
- **Website**: https://mui.com/
- **NPM**: `npm install @mui/material @emotion/react @emotion/styled`
- **Features**: Google Material Design, comprehensive components

#### 2. Ant Design
- **Website**: https://ant.design/
- **NPM**: `npm install antd`
- **Features**: Enterprise-class UI, extensive components, TypeScript support

#### 3. Mantine
- **Website**: https://mantine.dev/
- **NPM**: `npm install @mantine/core @mantine/hooks`
- **Features**: Modern design, dark theme, data tables, notifications

#### 4. Chakra UI
- **Website**: https://chakra-ui.com/
- **NPM**: `npm install @chakra-ui/react @emotion/react @emotion/styled`
- **Features**: Simple, modular, accessible components

#### 5. React Bootstrap
- **Website**: https://react-bootstrap.github.io/
- **NPM**: `npm install react-bootstrap bootstrap`
- **Features**: Bootstrap components for React

### Data Table Libraries

#### 1. React Table (TanStack Table)
- **Website**: https://tanstack.com/table/v8
- **NPM**: `npm install @tanstack/react-table`
- **Features**: Headless, sorting, filtering, pagination, virtualization

#### 2. AG Grid
- **Website**: https://www.ag-grid.com/
- **NPM**: `npm install ag-grid-react ag-grid-community`
- **Features**: Enterprise features, virtual scrolling, Excel export

#### 3. Mantine DataTable
- **NPM**: `npm install mantine-datatable`
- **Features**: Built on Mantine, sorting, filtering, selection

## Backend Technologies

### Node.js Frameworks

#### 1. Express.js
- **NPM**: `npm install express`
- **Features**: Minimal, flexible, middleware support

#### 2. Fastify
- **NPM**: `npm install fastify`
- **Features**: High performance, schema validation, plugins

#### 3. NestJS
- **NPM**: `npm install @nestjs/core @nestjs/common`
- **Features**: TypeScript, decorators, dependency injection, modular

### Python Frameworks

#### 1. FastAPI
- **PyPI**: `pip install fastapi uvicorn`
- **Features**: Async support, automatic API docs, type hints

#### 2. Django + Django REST Framework
- **PyPI**: `pip install django djangorestframework`
- **Features**: Full-featured, ORM, admin interface

#### 3. Flask
- **PyPI**: `pip install flask`
- **Features**: Lightweight, flexible, extensive ecosystem

### Database Solutions

#### 1. PostgreSQL
- **Features**: ACID compliance, JSON support, full-text search
- **Python**: `pip install psycopg2-binary`
- **Node.js**: `npm install pg`

#### 2. MongoDB
- **Features**: Document database, flexible schema, aggregation
- **Python**: `pip install pymongo`
- **Node.js**: `npm install mongodb`

#### 3. Redis
- **Features**: In-memory cache, pub/sub, data structures
- **Python**: `pip install redis`
- **Node.js**: `npm install redis`

#### 4. ClickHouse
- **Features**: Columnar database, analytics, high performance
- **Python**: `pip install clickhouse-driver`
- **Node.js**: `npm install @clickhouse/client`

### Queue Systems

#### 1. Bull Queue (Node.js)
- **NPM**: `npm install bull`
- **Features**: Redis-based, job scheduling, retries

#### 2. Celery (Python)
- **PyPI**: `pip install celery`
- **Features**: Distributed task queue, scheduling, monitoring

#### 3. BullMQ (Node.js)
- **NPM**: `npm install bullmq`
- **Features**: Modern Bull replacement, TypeScript support

## Authentication & Security

### Authentication Libraries

#### 1. NextAuth.js
- **NPM**: `npm install next-auth`
- **Features**: OAuth providers, JWT, session management

#### 2. Auth0
- **Website**: https://auth0.com/
- **Features**: Identity platform, social logins, MFA

#### 3. Firebase Auth
- **NPM**: `npm install firebase`
- **Features**: Google's authentication service, real-time database

#### 4. Passport.js (Node.js)
- **NPM**: `npm install passport`
- **Features**: Authentication middleware, 500+ strategies

### JWT Libraries

#### 1. jsonwebtoken (Node.js)
- **NPM**: `npm install jsonwebtoken`
- **Features**: JWT creation and verification

#### 2. PyJWT (Python)
- **PyPI**: `pip install pyjwt`
- **Features**: JWT implementation for Python

## Development Tools & Utilities

### Date/Time Libraries

#### 1. date-fns
- **NPM**: `npm install date-fns`
- **Features**: Modern date utility library, tree-shakable

#### 2. Day.js
- **NPM**: `npm install dayjs`
- **Features**: Lightweight moment.js alternative

#### 3. Luxon
- **NPM**: `npm install luxon`
- **Features**: DateTime library, timezone support

### HTTP Clients

#### 1. Axios
- **NPM**: `npm install axios`
- **Features**: Promise-based, request/response interceptors

#### 2. Fetch API
- **Built-in**: Modern browsers and Node.js 18+
- **Features**: Native, promise-based, streaming

#### 3. Requests (Python)
- **PyPI**: `pip install requests`
- **Features**: Simple HTTP library, session management

### Validation Libraries

#### 1. Zod (TypeScript)
- **NPM**: `npm install zod`
- **Features**: TypeScript-first schema validation

#### 2. Joi (Node.js)
- **NPM**: `npm install joi`
- **Features**: Object schema validation

#### 3. Pydantic (Python)
- **PyPI**: `pip install pydantic`
- **Features**: Data validation using Python type annotations

## DevOps & Infrastructure

### Containerization

#### 1. Docker
- **Website**: https://www.docker.com/
- **Features**: Containerization, multi-stage builds, compose

#### 2. Docker Compose
- **Features**: Multi-container applications, development environments

### Cloud Platforms

#### 1. AWS Services
- **EC2**: Virtual servers
- **RDS**: Managed databases
- **ElastiCache**: Managed Redis/Memcached
- **S3**: Object storage
- **CloudWatch**: Monitoring and logging
- **Lambda**: Serverless functions

#### 2. Google Cloud Platform
- **Compute Engine**: Virtual machines
- **Cloud SQL**: Managed databases
- **Cloud Storage**: Object storage
- **Cloud Functions**: Serverless

#### 3. Azure
- **Virtual Machines**: Compute instances
- **Azure Database**: Managed databases
- **Blob Storage**: Object storage
- **Azure Functions**: Serverless

### Monitoring & Logging

#### 1. New Relic
- **Website**: https://newrelic.com/
- **Features**: APM, infrastructure monitoring, alerts

#### 2. DataDog
- **Website**: https://www.datadoghq.com/
- **Features**: Monitoring, logging, APM, dashboards

#### 3. Prometheus + Grafana
- **Features**: Open-source monitoring, metrics collection, visualization

#### 4. Sentry
- **Website**: https://sentry.io/
- **Features**: Error tracking, performance monitoring

### CI/CD

#### 1. GitHub Actions
- **Features**: Integrated CI/CD, marketplace actions

#### 2. GitLab CI
- **Features**: Built-in CI/CD, Docker registry

#### 3. Jenkins
- **Features**: Open-source automation, extensive plugins

## Testing Frameworks

### Frontend Testing

#### 1. Jest
- **NPM**: `npm install jest`
- **Features**: JavaScript testing, mocking, snapshots

#### 2. React Testing Library
- **NPM**: `npm install @testing-library/react`
- **Features**: React component testing, user-centric

#### 3. Cypress
- **NPM**: `npm install cypress`
- **Features**: End-to-end testing, real browser testing

### Backend Testing

#### 1. Supertest (Node.js)
- **NPM**: `npm install supertest`
- **Features**: HTTP assertion testing

#### 2. pytest (Python)
- **PyPI**: `pip install pytest`
- **Features**: Python testing framework, fixtures

#### 3. unittest (Python)
- **Built-in**: Python standard library
- **Features**: Unit testing framework

## Performance & Optimization

### Caching

#### 1. Redis
- **Features**: In-memory caching, data structures
- **Use Cases**: Session storage, API caching, real-time analytics

#### 2. Memcached
- **Features**: Distributed memory caching
- **Use Cases**: Database query caching, session storage

### Database Optimization

#### 1. Database Indexing
- **PostgreSQL**: B-tree, Hash, GiST, SP-GiST, GIN, BRIN indexes
- **MongoDB**: Single field, compound, multikey, text indexes

#### 2. Query Optimization
- **Tools**: EXPLAIN plans, query analyzers
- **Techniques**: Index optimization, query rewriting

### Frontend Optimization

#### 1. Code Splitting
- **React**: React.lazy(), Suspense
- **Webpack**: Dynamic imports, chunk splitting

#### 2. Bundle Optimization
- **Webpack**: Tree shaking, minification
- **Vite**: Fast build tool, ES modules

## API Documentation

### Documentation Tools

#### 1. Swagger/OpenAPI
- **NPM**: `npm install swagger-ui-express`
- **Features**: Interactive API documentation, code generation

#### 2. Postman
- **Website**: https://www.postman.com/
- **Features**: API testing, documentation, collaboration

#### 3. Insomnia
- **Website**: https://insomnia.rest/
- **Features**: API client, testing, documentation

## Real-time Features

### WebSocket Libraries

#### 1. Socket.io
- **NPM**: `npm install socket.io`
- **Features**: Real-time communication, fallbacks

#### 2. ws (Node.js)
- **NPM**: `npm install ws`
- **Features**: Simple WebSocket library

#### 3. WebSocket (Python)
- **PyPI**: `pip install websockets`
- **Features**: WebSocket implementation for Python

### Server-Sent Events

#### 1. EventSource API
- **Built-in**: Browser API for SSE
- **Features**: One-way real-time communication

## Data Processing

### ETL/Data Pipeline

#### 1. Apache Airflow
- **PyPI**: `pip install apache-airflow`
- **Features**: Workflow orchestration, scheduling

#### 2. Pandas (Python)
- **PyPI**: `pip install pandas`
- **Features**: Data manipulation, analysis

#### 3. NumPy (Python)
- **PyPI**: `pip install numpy`
- **Features**: Numerical computing, arrays

## Security Best Practices

### Security Libraries

#### 1. Helmet.js (Node.js)
- **NPM**: `npm install helmet`
- **Features**: Security headers, XSS protection

#### 2. bcrypt
- **NPM**: `npm install bcrypt`
- **PyPI**: `pip install bcrypt`
- **Features**: Password hashing

#### 3. express-rate-limit (Node.js)
- **NPM**: `npm install express-rate-limit`
- **Features**: Rate limiting middleware

### Environment Management

#### 1. dotenv
- **NPM**: `npm install dotenv`
- **PyPI**: `pip install python-dotenv`
- **Features**: Environment variable management

## Recommended Development Stack

### Full-Stack TypeScript
```
Frontend: React + TypeScript + Mantine/MUI + Recharts/ApexCharts
Backend: Node.js + Express/Fastify + TypeScript
Database: PostgreSQL + Redis
Authentication: NextAuth.js or Auth0
Testing: Jest + React Testing Library + Cypress
Deployment: Docker + AWS/GCP
Monitoring: New Relic or DataDog
```

### Python Backend Alternative
```
Frontend: React + TypeScript + Mantine/MUI + Recharts/ApexCharts
Backend: Python + FastAPI + Pydantic
Database: PostgreSQL + Redis
Authentication: JWT + OAuth2
Testing: pytest + Playwright
Deployment: Docker + AWS/GCP
Monitoring: New Relic or DataDog
```

This comprehensive resource list provides everything needed to build a DataFuel-like application, from Amazon API integrations to modern frontend frameworks and deployment strategies.