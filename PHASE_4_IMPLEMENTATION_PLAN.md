# Phase 4: Enterprise Features - Implementation Plan

## 🎯 Overview

**Phase:** 4 of 5  
**Status:** In Progress 🚀  
**Duration:** 4 weeks (Weeks 13-16)  
**Started:** December 7, 2025  
**Expected Completion:** January 4, 2026  

---

## 📋 Objectives

Phase 4 transforms the Amazon FDC Tool from a functional application into an enterprise-ready platform with:
- Multi-tenancy and account management
- Role-based access control (RBAC)
- Subscription and billing system
- Team collaboration features
- Advanced notifications
- Comprehensive audit logging
- Enhanced reporting and analytics

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 4 ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌──────────────┐   ┌──────────────┐   │
│  │   Admin     │    │   Payment    │   │ Notification │   │
│  │   Panel     │───▶│   Gateway    │   │   System     │   │
│  │   (React)   │    │  (Stripe)    │   │ (Multi-Chan) │   │
│  └─────────────┘    └──────────────┘   └──────────────┘   │
│         │                    │                   │          │
│         ▼                    ▼                   ▼          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Backend API Layer                      │   │
│  │  • RBAC Middleware   • Subscription Manager         │   │
│  │  • Audit Logger      • Notification Router          │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                    │   │
│  │  • Roles & Permissions  • Subscriptions & Plans     │   │
│  │  • Audit Logs          • Organizations & Teams      │   │
│  │  • Payment Records     • Notification Settings      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Extensions

### New Tables (11 total)

```sql
-- 1. Organizations (Multi-tenancy)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    subscription_id UUID REFERENCES subscriptions(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_system BOOLEAN DEFAULT false,
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. User Roles (Many-to-Many)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id),
    granted_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, role_id, organization_id)
);

-- 4. Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Subscription Plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL, -- monthly, yearly
    features JSONB DEFAULT '[]',
    limits JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    trial_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    plan_id UUID REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active', -- active, cancelled, expired, trial
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    trial_ends_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Payment Records
CREATE TABLE payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    organization_id UUID REFERENCES organizations(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL, -- succeeded, pending, failed
    stripe_payment_intent_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 8. Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- 9. Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. Team Members
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- admin, member, viewer
    added_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- 11. Notification Preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- email, sms, slack, in_app
    event_type VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, channel, event_type)
);
```

### Modified Tables

```sql
-- Add organization_id to existing tables
ALTER TABLE users ADD COLUMN organization_id UUID REFERENCES organizations(id);
ALTER TABLE campaigns ADD COLUMN team_id UUID REFERENCES teams(id);
ALTER TABLE campaigns ADD COLUMN created_by UUID REFERENCES users(id);
```

---

## 🔧 Implementation Breakdown

### Week 1: Foundation & RBAC (Dec 7-13)

#### Day 1-2: Database Schema & Migrations
- [ ] Create migration files for 11 new tables
- [ ] Add organization_id to existing tables
- [ ] Create indexes for performance
- [ ] Seed default roles and permissions

**Files to Create:**
```
backend/database/migrations/
  └── 20251207_phase4_enterprise_schema.ts
  └── 20251207_seed_default_roles.ts
  └── 20251207_seed_subscription_plans.ts
```

#### Day 3-4: RBAC Implementation
- [ ] Create permission checking middleware
- [ ] Implement role-based route protection
- [ ] Add organization context middleware
- [ ] Create permission utility functions

**Files to Create:**
```
backend/src/middleware/
  └── rbac.ts
  └── organization.ts
  └── audit.ts

backend/src/utils/
  └── permissions.ts
  └── roles.ts
```

#### Day 5-7: Admin API Endpoints
- [ ] Organizations CRUD
- [ ] Roles & Permissions API
- [ ] User-Role assignment API
- [ ] Audit logs API

**Files to Create:**
```
backend/src/routes/
  └── organizationRoutes.ts
  └── roleRoutes.ts
  └── auditRoutes.ts

backend/src/services/
  └── organizationService.ts
  └── roleService.ts
  └── auditService.ts
```

---

### Week 2: Subscription & Billing (Dec 14-20)

#### Day 1-3: Subscription System
- [ ] Subscription plans CRUD API
- [ ] Subscription management API
- [ ] Usage tracking system
- [ ] Feature flag implementation

**Files to Create:**
```
backend/src/routes/
  └── subscriptionRoutes.ts
  └── planRoutes.ts

backend/src/services/
  └── subscriptionService.ts
  └── usageTracker.ts
  └── featureFlags.ts
```

#### Day 4-7: Payment Integration
- [ ] Stripe integration setup
- [ ] Payment processing API
- [ ] Webhook handlers (Stripe events)
- [ ] Invoice generation
- [ ] Payment history API

**Files to Create:**
```
backend/src/integrations/
  └── stripe.ts

backend/src/routes/
  └── paymentRoutes.ts
  └── webhookRoutes.ts

backend/src/services/
  └── paymentService.ts
  └── invoiceService.ts
```

---

### Week 3: Multi-Tenancy & Teams (Dec 21-27)

#### Day 1-3: Multi-Account Support
- [ ] Organization switcher API
- [ ] Cross-organization data isolation
- [ ] Account invitation system
- [ ] Organization settings API

**Files to Create:**
```
backend/src/services/
  └── multiTenancy.ts
  └── invitationService.ts
```

#### Day 4-7: Team Collaboration
- [ ] Teams CRUD API
- [ ] Team member management
- [ ] Shared workspace API
- [ ] Team permissions system

**Files to Create:**
```
backend/src/routes/
  └── teamRoutes.ts

backend/src/services/
  └── teamService.ts
  └── collaborationService.ts
```

---

### Week 4: Notifications & Frontend (Dec 28 - Jan 3)

#### Day 1-3: Notification System
- [ ] Email integration (SendGrid/AWS SES)
- [ ] SMS integration (Twilio)
- [ ] Slack integration
- [ ] In-app notifications API
- [ ] Notification preferences API

**Files to Create:**
```
backend/src/services/
  └── notificationService.ts
  └── emailProvider.ts
  └── smsProvider.ts
  └── slackProvider.ts

backend/src/routes/
  └── notificationRoutes.ts
```

#### Day 4-7: Admin Panel UI
- [ ] Admin layout component
- [ ] Users management page
- [ ] Roles & permissions page
- [ ] Organizations page
- [ ] Subscription management page
- [ ] Billing & payments page
- [ ] Audit logs viewer
- [ ] Teams management page

**Files to Create:**
```
frontend/src/pages/admin/
  └── AdminLayout.tsx
  └── UsersManagement.tsx
  └── RolesManagement.tsx
  └── OrganizationsManagement.tsx
  └── SubscriptionManagement.tsx
  └── BillingPayments.tsx
  └── AuditLogs.tsx
  └── TeamsManagement.tsx

frontend/src/services/
  └── adminService.ts
  └── subscriptionService.ts
  └── billingService.ts
```

---

## 📊 API Endpoints (Phase 4)

### Organizations (6 endpoints)
```
GET    /api/organizations          - List organizations
POST   /api/organizations          - Create organization
GET    /api/organizations/:id      - Get organization
PUT    /api/organizations/:id      - Update organization
DELETE /api/organizations/:id      - Delete organization
POST   /api/organizations/:id/switch - Switch current organization
```

### Roles & Permissions (8 endpoints)
```
GET    /api/roles                  - List roles
POST   /api/roles                  - Create role
GET    /api/roles/:id              - Get role
PUT    /api/roles/:id              - Update role
DELETE /api/roles/:id              - Delete role
GET    /api/permissions            - List all permissions
POST   /api/users/:id/roles        - Assign role to user
DELETE /api/users/:id/roles/:roleId - Remove role from user
```

### Subscriptions (10 endpoints)
```
GET    /api/subscription-plans     - List plans
POST   /api/subscription-plans     - Create plan (admin)
GET    /api/subscription-plans/:id - Get plan details
PUT    /api/subscription-plans/:id - Update plan (admin)
GET    /api/subscriptions          - Get current subscription
POST   /api/subscriptions          - Create subscription
PUT    /api/subscriptions/:id      - Update subscription
POST   /api/subscriptions/:id/cancel - Cancel subscription
GET    /api/subscriptions/usage    - Get usage metrics
POST   /api/subscriptions/upgrade  - Upgrade plan
```

### Payments (6 endpoints)
```
POST   /api/payments               - Create payment
GET    /api/payments               - List payments
GET    /api/payments/:id           - Get payment details
POST   /api/payments/setup-intent  - Create setup intent (Stripe)
POST   /api/webhooks/stripe        - Stripe webhook handler
GET    /api/invoices               - List invoices
```

### Teams (8 endpoints)
```
GET    /api/teams                  - List teams
POST   /api/teams                  - Create team
GET    /api/teams/:id              - Get team
PUT    /api/teams/:id              - Update team
DELETE /api/teams/:id              - Delete team
POST   /api/teams/:id/members      - Add team member
DELETE /api/teams/:id/members/:userId - Remove team member
PUT    /api/teams/:id/members/:userId - Update member role
```

### Audit Logs (3 endpoints)
```
GET    /api/audit-logs             - List audit logs (paginated)
GET    /api/audit-logs/:id         - Get audit log details
GET    /api/audit-logs/export      - Export audit logs (CSV)
```

### Notifications (6 endpoints)
```
GET    /api/notifications          - List user notifications
GET    /api/notifications/unread   - Get unread count
PUT    /api/notifications/:id/read - Mark as read
PUT    /api/notifications/read-all - Mark all as read
GET    /api/notification-preferences - Get preferences
PUT    /api/notification-preferences - Update preferences
```

**Total Phase 4 API Endpoints: 47 new endpoints**

---

## 🎨 UI Components

### Admin Panel Pages

1. **Admin Layout**
   - Sidebar navigation
   - Breadcrumbs
   - User menu with organization switcher

2. **Users Management**
   - User list with search & filters
   - User creation modal
   - User edit modal
   - Role assignment interface
   - Bulk actions

3. **Roles & Permissions**
   - Roles list
   - Role creation/edit
   - Permission matrix view
   - Permission assignment

4. **Organizations**
   - Organizations list
   - Organization details
   - Organization settings
   - Member management

5. **Subscription Management**
   - Current plan display
   - Plan comparison
   - Upgrade/downgrade UI
   - Usage metrics dashboard
   - Feature availability

6. **Billing & Payments**
   - Payment methods management
   - Payment history
   - Invoice list
   - Upcoming charges

7. **Audit Logs**
   - Log list with filters
   - Log details modal
   - Export functionality
   - Timeline view

8. **Teams Management**
   - Teams list
   - Team creation
   - Member management
   - Permission settings

---

## 🔒 Security & Permissions

### Permission Structure

```typescript
// Permission format: resource:action
const PERMISSIONS = {
  // Users
  'users:view': 'View users',
  'users:create': 'Create users',
  'users:update': 'Update users',
  'users:delete': 'Delete users',
  
  // Campaigns
  'campaigns:view': 'View campaigns',
  'campaigns:create': 'Create campaigns',
  'campaigns:update': 'Update campaigns',
  'campaigns:delete': 'Delete campaigns',
  
  // Admin
  'admin:view': 'Access admin panel',
  'roles:manage': 'Manage roles',
  'organizations:manage': 'Manage organizations',
  'subscriptions:manage': 'Manage subscriptions',
  'audit:view': 'View audit logs',
  
  // Teams
  'teams:view': 'View teams',
  'teams:manage': 'Manage teams',
  'teams:invite': 'Invite team members',
};
```

### Default Roles

```typescript
const DEFAULT_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Admin',
    permissions: ['*'], // All permissions
  },
  ADMIN: {
    name: 'Admin',
    permissions: [
      'users:*',
      'campaigns:*',
      'teams:*',
      'admin:view',
    ],
  },
  MANAGER: {
    name: 'Manager',
    permissions: [
      'campaigns:view',
      'campaigns:update',
      'teams:view',
      'users:view',
    ],
  },
  USER: {
    name: 'User',
    permissions: [
      'campaigns:view',
      'campaigns:create',
    ],
  },
  VIEWER: {
    name: 'Viewer',
    permissions: [
      'campaigns:view',
    ],
  },
};
```

---

## 💳 Subscription Plans

### Initial Plans

```typescript
const SUBSCRIPTION_PLANS = [
  {
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'Up to 5 campaigns',
      'Basic reporting',
      'Email support',
    ],
    limits: {
      campaigns: 5,
      keywords: 100,
      users: 1,
      apiCalls: 1000,
    },
  },
  {
    name: 'Starter',
    price: 49,
    billingCycle: 'monthly',
    features: [
      'Up to 25 campaigns',
      'Advanced reporting',
      'Priority email support',
      'API access',
    ],
    limits: {
      campaigns: 25,
      keywords: 1000,
      users: 3,
      apiCalls: 10000,
    },
  },
  {
    name: 'Professional',
    price: 149,
    billingCycle: 'monthly',
    features: [
      'Up to 100 campaigns',
      'Custom reports',
      'Priority support',
      'API access',
      'Team collaboration',
      'Advanced automation',
    ],
    limits: {
      campaigns: 100,
      keywords: 10000,
      users: 10,
      apiCalls: 50000,
    },
  },
  {
    name: 'Enterprise',
    price: 499,
    billingCycle: 'monthly',
    features: [
      'Unlimited campaigns',
      'Custom everything',
      'Dedicated support',
      'API access',
      'Team collaboration',
      'Advanced automation',
      'White labeling',
    ],
    limits: {
      campaigns: -1, // Unlimited
      keywords: -1,
      users: -1,
      apiCalls: -1,
    },
  },
];
```

---

## 📧 Notification Events

### Event Types

```typescript
const NOTIFICATION_EVENTS = {
  // User events
  'user.invited': 'User invited to organization',
  'user.role_changed': 'User role changed',
  
  // Campaign events
  'campaign.performance_alert': 'Campaign performance alert',
  'campaign.budget_exceeded': 'Campaign budget exceeded',
  
  // Billing events
  'billing.payment_succeeded': 'Payment succeeded',
  'billing.payment_failed': 'Payment failed',
  'billing.subscription_expiring': 'Subscription expiring soon',
  
  // System events
  'system.maintenance': 'Scheduled maintenance',
  'system.feature_released': 'New feature released',
};
```

---

## 🧪 Testing Strategy

### Unit Tests
- RBAC middleware
- Permission checking
- Subscription logic
- Payment processing

### Integration Tests
- Organization creation flow
- User invitation flow
- Subscription upgrade flow
- Payment processing flow

### E2E Tests
- Admin panel workflows
- Multi-tenancy switching
- Team collaboration
- Billing management

---

## 📈 Success Metrics

### Technical Metrics
- [ ] All 47 API endpoints operational
- [ ] Response time < 200ms for admin endpoints
- [ ] 100% RBAC coverage
- [ ] Zero security vulnerabilities

### Feature Metrics
- [ ] 8 admin pages fully functional
- [ ] 4 subscription plans configured
- [ ] 3 notification channels working
- [ ] Multi-tenancy fully isolated

### Quality Metrics
- [ ] 80%+ code coverage
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Documentation complete

---

## 🚀 Deployment Checklist

- [ ] Database migrations tested
- [ ] Stripe integration configured
- [ ] Environment variables set
- [ ] Email provider configured
- [ ] SMS provider configured (optional)
- [ ] Slack app created (optional)
- [ ] Admin user created
- [ ] Default roles seeded
- [ ] Subscription plans seeded
- [ ] Production deployment
- [ ] SSL certificates updated
- [ ] Monitoring configured

---

## 📚 Documentation

### Required Documentation
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Admin panel user guide
- [ ] RBAC implementation guide
- [ ] Subscription management guide
- [ ] Payment integration guide
- [ ] Multi-tenancy guide

---

## 🎯 Phase 4 Completion Criteria

1. ✅ All 47 API endpoints implemented and tested
2. ✅ 11 new database tables created and indexed
3. ✅ RBAC system fully functional
4. ✅ Stripe payment integration working
5. ✅ Admin panel UI complete (8 pages)
6. ✅ Multi-tenancy working
7. ✅ Team collaboration features operational
8. ✅ Notification system functional (2+ channels)
9. ✅ Audit logging capturing all events
10. ✅ Production deployment successful
11. ✅ All tests passing
12. ✅ Documentation complete

---

**Phase 4 Start Date:** December 7, 2025  
**Phase 4 Target Completion:** January 4, 2026  
**Current Status:** Planning Complete - Ready to Implement 🚀
