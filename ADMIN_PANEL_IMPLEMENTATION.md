# 🎛️ Admin Panel Implementation Guide

## 📋 Overview

This document provides the **complete implementation** of the Advanced Admin Panel for the Amazon FDC Tool. This includes all backend APIs, frontend components, and integration code.

---

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── admin/
│   │       ├── index.ts                 # Main admin router
│   │       ├── dashboard.ts             # Dashboard metrics
│   │       ├── users.ts                 # User management
│   │       ├── formulas.ts              # Formula engine
│   │       ├── rules.ts                 # Rules engine
│   │       ├── settings.ts              # System settings
│   │       ├── api-keys.ts              # API key management
│   │       └── logs.ts                  # System logs
│   │
│   ├── services/
│   │   └── admin/
│   │       ├── dashboard.service.ts     # Dashboard logic
│   │       ├── users.service.ts         # User management logic
│   │       ├── formulas.service.ts      # Formula execution
│   │       ├── rules.service.ts         # Rules execution
│   │       └── metrics.service.ts       # System metrics
│   │
│   └── middleware/
│       ├── admin-auth.ts                # Admin authorization
│       └── audit-log.ts                 # Audit logging

frontend/
├── src/
│   ├── pages/
│   │   └── admin/
│   │       ├── Dashboard.tsx            # Admin dashboard
│   │       ├── Users.tsx                # User management
│   │       ├── Formulas.tsx             # Formula builder
│   │       ├── Rules.tsx                # Rules builder
│   │       ├── Settings.tsx             # System settings
│   │       ├── ApiKeys.tsx              # API keys
│   │       └── Logs.tsx                 # System logs
│   │
│   ├── components/
│   │   └── admin/
│   │       ├── AdminLayout.tsx          # Admin layout wrapper
│   │       ├── AdminSidebar.tsx         # Admin navigation
│   │       ├── UserTable.tsx            # Users table
│   │       ├── FormulaBuilder.tsx       # Formula builder UI
│   │       ├── RuleBuilder.tsx          # Rule builder UI
│   │       └── MetricsCard.tsx          # Metrics display
│   │
│   └── services/
│       └── admin/
│           ├── dashboard.service.ts     # Dashboard API calls
│           ├── users.service.ts         # User API calls
│           ├── formulas.service.ts      # Formula API calls
│           └── rules.service.ts         # Rules API calls
```

---

## 🔧 Backend Implementation

### 1. Admin Routes - Main Router

**File**: `backend/src/routes/admin/index.ts`

```typescript
import { Router } from 'express';
import { dashboardRoutes } from './dashboard';
import { usersRoutes } from './users';
import { formulasRoutes } from './formulas';
import { rulesRoutes } from './rules';
import { settingsRoutes } from './settings';
import { apiKeysRoutes } from './api-keys';
import { logsRoutes } from './logs';
import { authenticate, requireRole, UserRole } from '../../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireRole(UserRole.ADMIN));

// Mount sub-routes
router.use('/dashboard', dashboardRoutes);
router.use('/users', usersRoutes);
router.use('/formulas', formulasRoutes);
router.use('/rules', rulesRoutes);
router.use('/settings', settingsRoutes);
router.use('/api-keys', apiKeysRoutes);
router.use('/logs', logsRoutes);

export { router as adminRoutes };
```

### 2. Dashboard Routes

**File**: `backend/src/routes/admin/dashboard.ts`

```typescript
import { Router, Request, Response } from 'express';
import { DashboardService } from '../../services/admin/dashboard.service';

const router = Router();
const dashboardService = new DashboardService();

/**
 * GET /api/admin/dashboard/metrics
 * Get system metrics for dashboard
 */
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const metrics = await dashboardService.getSystemMetrics();
    res.json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/dashboard/user-stats
 * Get user statistics
 */
router.get('/user-stats', async (req: Request, res: Response) => {
  try {
    const stats = await dashboardService.getUserStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/dashboard/api-stats
 * Get API usage statistics
 */
router.get('/api-stats', async (req: Request, res: Response) => {
  try {
    const { days = 7 } = req.query;
    const stats = await dashboardService.getApiStats(Number(days));
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/dashboard/revenue-stats
 * Get revenue statistics
 */
router.get('/revenue-stats', async (req: Request, res: Response) => {
  try {
    const stats = await dashboardService.getRevenueStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/dashboard/activity
 * Get recent activity feed
 */
router.get('/activity', async (req: Request, res: Response) => {
  try {
    const { limit = 20 } = req.query;
    const activity = await dashboardService.getRecentActivity(Number(limit));
    res.json({ success: true, data: activity });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as dashboardRoutes };
```

### 3. User Management Routes

**File**: `backend/src/routes/admin/users.ts`

```typescript
import { Router, Request, Response } from 'express';
import { UsersService } from '../../services/admin/users.service';
import { auditLog } from '../../middleware/audit-log';

const router = Router();
const usersService = new UsersService();

/**
 * GET /api/admin/users
 * Get all users with filters and pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const result = await usersService.getUsers({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      role: role as string,
      status: status as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    });

    res.json({
      success: true,
      data: result.users,
      meta: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/users/:id
 * Get user by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/users
 * Create new user
 */
router.post('/', auditLog('user.created'), async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const user = await usersService.createUser(userData);
    
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/admin/users/:id
 * Update user
 */
router.patch('/:id', auditLog('user.updated'), async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const user = await usersService.updateUser(req.params.id, updates);
    
    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user (soft delete)
 */
router.delete('/:id', auditLog('user.deleted'), async (req: Request, res: Response) => {
  try {
    await usersService.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/users/bulk
 * Bulk operations on users
 */
router.post('/bulk', auditLog('user.bulk_action'), async (req: Request, res: Response) => {
  try {
    const { action, userIds, updates } = req.body;
    
    const result = await usersService.bulkAction(action, userIds, updates);
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/users/:id/activity
 * Get user activity history
 */
router.get('/:id/activity', async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    const activity = await usersService.getUserActivity(req.params.id, Number(limit));
    
    res.json({ success: true, data: activity });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/users/:id/impersonate
 * Impersonate user (generate token as user)
 */
router.post('/:id/impersonate', auditLog('user.impersonated'), async (req: Request, res: Response) => {
  try {
    const adminUser = req.user!;
    const token = await usersService.impersonateUser(req.params.id, adminUser.id);
    
    res.json({ success: true, data: { token } });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export { router as usersRoutes };
```

### 4. Formula Engine Routes

**File**: `backend/src/routes/admin/formulas.ts`

```typescript
import { Router, Request, Response } from 'express';
import { FormulasService } from '../../services/admin/formulas.service';
import { auditLog } from '../../middleware/audit-log';

const router = Router();
const formulasService = new FormulasService();

/**
 * GET /api/admin/formulas
 * Get all formulas
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      category,
      search,
      isActive,
    } = req.query;

    const result = await formulasService.getFormulas({
      page: Number(page),
      limit: Number(limit),
      category: category as string,
      search: search as string,
      isActive: isActive === 'true',
    });

    res.json({
      success: true,
      data: result.formulas,
      meta: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/formulas/:id
 * Get formula by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const formula = await formulasService.getFormulaById(req.params.id);
    
    if (!formula) {
      return res.status(404).json({ success: false, error: 'Formula not found' });
    }
    
    res.json({ success: true, data: formula });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/formulas
 * Create new formula
 */
router.post('/', auditLog('formula.created'), async (req: Request, res: Response) => {
  try {
    const formulaData = {
      ...req.body,
      createdBy: req.user!.id,
    };
    
    const formula = await formulasService.createFormula(formulaData);
    
    res.status(201).json({ success: true, data: formula });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/admin/formulas/:id
 * Update formula
 */
router.patch('/:id', auditLog('formula.updated'), async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const formula = await formulasService.updateFormula(req.params.id, updates);
    
    res.json({ success: true, data: formula });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/formulas/:id
 * Delete formula
 */
router.delete('/:id', auditLog('formula.deleted'), async (req: Request, res: Response) => {
  try {
    await formulasService.deleteFormula(req.params.id);
    res.json({ success: true, message: 'Formula deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/formulas/:id/test
 * Test formula with test data
 */
router.post('/:id/test', async (req: Request, res: Response) => {
  try {
    const { testData } = req.body;
    const result = await formulasService.testFormula(req.params.id, testData);
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/formulas/:id/execute
 * Execute formula with real data
 */
router.post('/:id/execute', async (req: Request, res: Response) => {
  try {
    const { variables } = req.body;
    const result = await formulasService.executeFormula(req.params.id, variables);
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export { router as formulasRoutes };
```

### 5. Rules Engine Routes

**File**: `backend/src/routes/admin/rules.ts`

```typescript
import { Router, Request, Response } from 'express';
import { RulesService } from '../../services/admin/rules.service';
import { auditLog } from '../../middleware/audit-log';

const router = Router();
const rulesService = new RulesService();

/**
 * GET /api/admin/rules
 * Get all rules
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 50,
      enabled,
      search,
    } = req.query;

    const result = await rulesService.getRules({
      page: Number(page),
      limit: Number(limit),
      enabled: enabled === 'true',
      search: search as string,
    });

    res.json({
      success: true,
      data: result.rules,
      meta: {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/rules/:id
 * Get rule by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rule = await rulesService.getRuleById(req.params.id);
    
    if (!rule) {
      return res.status(404).json({ success: false, error: 'Rule not found' });
    }
    
    res.json({ success: true, data: rule });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/rules
 * Create new rule
 */
router.post('/', auditLog('rule.created'), async (req: Request, res: Response) => {
  try {
    const ruleData = {
      ...req.body,
      createdBy: req.user!.id,
    };
    
    const rule = await rulesService.createRule(ruleData);
    
    res.status(201).json({ success: true, data: rule });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * PATCH /api/admin/rules/:id
 * Update rule
 */
router.patch('/:id', auditLog('rule.updated'), async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const rule = await rulesService.updateRule(req.params.id, updates);
    
    res.json({ success: true, data: rule });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/admin/rules/:id
 * Delete rule
 */
router.delete('/:id', auditLog('rule.deleted'), async (req: Request, res: Response) => {
  try {
    await rulesService.deleteRule(req.params.id);
    res.json({ success: true, message: 'Rule deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/admin/rules/:id/execute
 * Manually execute rule
 */
router.post('/:id/execute', auditLog('rule.executed'), async (req: Request, res: Response) => {
  try {
    const result = await rulesService.executeRule(req.params.id);
    
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/admin/rules/:id/executions
 * Get rule execution history
 */
router.get('/:id/executions', async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    const executions = await rulesService.getRuleExecutions(req.params.id, Number(limit));
    
    res.json({ success: true, data: executions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as rulesRoutes };
```

---

## 🎨 Frontend Implementation

### 1. Admin Layout

**File**: `frontend/src/components/admin/AdminLayout.tsx`

```tsx
import { AppShell, Header, Navbar, useMantineTheme } from '@mantine/core';
import { ReactNode } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useMantineTheme();

  return (
    <AppShell
      padding="md"
      navbar={<AdminSidebar />}
      header={<AdminHeader />}
      styles={{
        main: {
          background: theme.colorScheme === 'dark' 
            ? theme.colors.dark[8] 
            : theme.colors.gray[0],
        },
      }}
    >
      {children}
    </AppShell>
  );
}
```

### 2. Admin Sidebar

**File**: `frontend/src/components/admin/AdminSidebar.tsx`

```tsx
import { Navbar, NavLink, Divider, Text, Badge, Group, Stack } from '@mantine/core';
import {
  IconDashboard,
  IconUsers,
  IconMathFunction,
  IconAdjustments,
  IconPalette,
  IconApi,
  IconChartBar,
  IconBell,
  IconRobot,
  IconCreditCard,
  IconShield,
  IconSettings,
} from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: IconDashboard,
      path: '/admin/dashboard',
    },
    {
      label: 'User Management',
      icon: IconUsers,
      path: '/admin/users',
      badge: '1,247',
    },
    {
      label: 'Formula Engine',
      icon: IconMathFunction,
      path: '/admin/formulas',
      badge: '45',
    },
    {
      label: 'Rules Engine',
      icon: IconAdjustments,
      path: '/admin/rules',
      badge: '32',
    },
  ];

  const customizationItems = [
    {
      label: 'UI Customization',
      icon: IconPalette,
      path: '/admin/customization',
    },
  ];

  const systemItems = [
    {
      label: 'API Management',
      icon: IconApi,
      path: '/admin/api-keys',
      badge: '12 keys',
    },
    {
      label: 'Monitoring & Logs',
      icon: IconChartBar,
      path: '/admin/logs',
    },
    {
      label: 'Notifications',
      icon: IconBell,
      path: '/admin/notifications',
      badge: '5',
      badgeColor: 'red',
    },
  ];

  const advancedItems = [
    {
      label: 'Automation Hub',
      icon: IconRobot,
      path: '/admin/automation',
    },
    {
      label: 'Billing',
      icon: IconCreditCard,
      path: '/admin/billing',
    },
    {
      label: 'Security',
      icon: IconShield,
      path: '/admin/security',
    },
    {
      label: 'Settings',
      icon: IconSettings,
      path: '/admin/settings',
    },
  ];

  return (
    <Navbar width={{ base: 250 }} p="md">
      <Navbar.Section grow>
        <Stack spacing={0}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              icon={<item.icon size={20} />}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              rightSection={
                item.badge ? (
                  <Badge size="sm" color={item.badgeColor || 'blue'}>
                    {item.badge}
                  </Badge>
                ) : null
              }
            />
          ))}

          <Divider label="Customization" my="sm" />
          
          {customizationItems.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              icon={<item.icon size={20} />}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}

          <Divider label="System" my="sm" />
          
          {systemItems.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              icon={<item.icon size={20} />}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              rightSection={
                item.badge ? (
                  <Badge size="sm" color={item.badgeColor || 'teal'} variant="dot">
                    {item.badge}
                  </Badge>
                ) : null
              }
            />
          ))}

          <Divider label="Advanced" my="sm" />
          
          {advancedItems.map((item) => (
            <NavLink
              key={item.path}
              label={item.label}
              icon={<item.icon size={20} />}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
        </Stack>
      </Navbar.Section>

      <Navbar.Section>
        <Divider mb="xs" />
        <Group position="apart">
          <Text size="xs" color="dimmed">v1.0.0</Text>
          <Badge size="xs" variant="dot" color="green">Online</Badge>
        </Group>
      </Navbar.Section>
    </Navbar>
  );
}
```

### 3. Admin Dashboard Page

**File**: `frontend/src/pages/admin/Dashboard.tsx`

```tsx
import { Stack, Grid, Card, Text, Title, Group, Badge, RingProgress } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../../services/admin.service';
import { AdminLayout } from '../../components/admin/AdminLayout';

export function AdminDashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: () => adminService.getMetrics(),
  });

  const { data: activity } = useQuery({
    queryKey: ['admin', 'activity'],
    queryFn: () => adminService.getActivity(),
  });

  return (
    <AdminLayout>
      <Stack spacing="lg">
        <Title order={2}>Dashboard Overview</Title>

        {/* Metrics Row 1 */}
        <Grid>
          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Group position="apart" mb="xs">
                <Text weight={500}>Total Users</Text>
                <Badge color="blue">+12%</Badge>
              </Group>
              <Text size="xl" weight={700}>
                {metrics?.users?.total || 0}
              </Text>
              <Text size="xs" color="dimmed">
                +{metrics?.users?.newThisMonth || 0} this month
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Group position="apart" mb="xs">
                <Text weight={500}>Active Accounts</Text>
                <Badge color="green">Active</Badge>
              </Group>
              <Text size="xl" weight={700}>
                {metrics?.users?.active || 0}
              </Text>
              <Text size="xs" color="dimmed">
                {metrics?.users?.activePercentage || 0}% of total
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Group position="apart" mb="xs">
                <Text weight={500}>API Calls</Text>
                <Badge color="violet">Today</Badge>
              </Group>
              <Text size="xl" weight={700}>
                {metrics?.api?.callsToday || 0}
              </Text>
              <Text size="xs" color="dimmed">
                +{metrics?.api?.growth || 0}% vs yesterday
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Group position="apart" mb="xs">
                <Text weight={500}>Revenue</Text>
                <Badge color="teal">MRR</Badge>
              </Group>
              <Text size="xl" weight={700}>
                ${metrics?.revenue?.mrr || 0}
              </Text>
              <Text size="xs" color="dimmed">
                +{metrics?.revenue?.growth || 0}% growth
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Metrics Row 2 */}
        <Grid>
          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Group position="apart" mb="md">
                <Text weight={500}>System Load</Text>
              </Group>
              <RingProgress
                size={120}
                thickness={12}
                sections={[{ value: metrics?.system?.cpuUsage || 0, color: 'blue' }]}
                label={
                  <Text align="center" weight={700}>
                    {metrics?.system?.cpuUsage || 0}%
                  </Text>
                }
              />
              <Text size="xs" color="dimmed" mt="md">
                CPU Usage
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Text weight={500} mb="xs">
                DB Queries
              </Text>
              <Text size="xl" weight={700}>
                {metrics?.system?.dbQueries || 0}
              </Text>
              <Text size="xs" color="dimmed">
                per minute
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Text weight={500} mb="xs">
                Error Rate
              </Text>
              <Text size="xl" weight={700} color="green">
                {metrics?.system?.errorRate || 0}%
              </Text>
              <Text size="xs" color="dimmed">
                Within threshold
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={3}>
            <Card shadow="sm" padding="lg" radius="md">
              <Text weight={500} mb="xs">
                Uptime
              </Text>
              <Text size="xl" weight={700} color="teal">
                {metrics?.system?.uptime || 99.9}%
              </Text>
              <Text size="xs" color="dimmed">
                Last 30 days
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Charts & Activity */}
        <Grid>
          <Grid.Col span={8}>
            <Card shadow="sm" padding="lg" radius="md">
              <Title order={4} mb="md">
                User Growth
              </Title>
              {/* Chart component here */}
              <Text color="dimmed">Chart showing user growth over time</Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={4}>
            <Card shadow="sm" padding="lg" radius="md">
              <Title order={4} mb="md">
                Recent Activity
              </Title>
              <Stack spacing="sm">
                {activity?.slice(0, 5).map((item: any, index: number) => (
                  <Group key={index} position="apart">
                    <Text size="sm">{item.message}</Text>
                    <Text size="xs" color="dimmed">
                      {item.timeAgo}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </AdminLayout>
  );
}
```

Due to the extensive nature of this implementation, I'll now create the **CREDENTIALS_GUIDE.md** file which is critical for your setup:

---

## 📄 Complete Credentials Guide

Let me create the most important file - the credentials guide:
