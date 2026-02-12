# 🏗️ Complete System Architecture Redesign

## Executive Summary

This document outlines a **complete system architecture redesign** using modern best practices, cutting-edge frameworks, and scalable patterns to transform the Amazon FDC Tool into an enterprise-grade SaaS platform.

---

## 🎯 Current Architecture Issues

### Problems with Current Setup

1. **Monolithic Structure**:
   - Single backend service handling everything
   - Tight coupling between modules
   - Difficult to scale individual components
   - No clear separation of concerns

2. **Limited Real-Time Capabilities**:
   - No WebSocket implementation
   - Polling for updates
   - Poor user experience for live data

3. **Basic State Management**:
   - Simple context API usage
   - No advanced caching strategies
   - State persistence issues

4. **No Microservices**:
   - Cannot scale services independently
   - Single point of failure
   - Resource allocation inefficiency

5. **Missing Advanced Features**:
   - No event-driven architecture
   - No message queue system
   - No service mesh
   - Limited observability

---

## 🚀 New Architecture Overview

### High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
├────────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite                                      │
│  State: Zustand + React Query + Jotai                              │
│  UI: Mantine UI + TailwindCSS                                      │
│  Real-time: Socket.io Client + WebRTC                              │
│  Charts: Apache ECharts + D3.js                                    │
└────────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS/WSS
┌────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                              │
├────────────────────────────────────────────────────────────────────┤
│  Kong / NGINX + Load Balancer                                      │
│  ├─ Rate Limiting                                                  │
│  ├─ Authentication (JWT validation)                                │
│  ├─ Request/Response transformation                                │
│  ├─ Circuit breaker                                                │
│  └─ API versioning                                                 │
└────────────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                              │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Auth       │  │    User      │  │   Campaign   │            │
│  │   Service    │  │   Service    │  │   Service    │            │
│  │              │  │              │  │              │            │
│  │  - Login     │  │  - CRUD      │  │  - CRUD      │            │
│  │  - Register  │  │  - Profile   │  │  - Analytics │            │
│  │  - OAuth     │  │  - Roles     │  │  - Bidding   │            │
│  │  - 2FA       │  │  - Perms     │  │  - Reports   │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Admin      │  │   Formula    │  │    Rules     │            │
│  │   Service    │  │   Service    │  │   Service    │            │
│  │              │  │              │  │              │            │
│  │  - Dashboard │  │  - Builder   │  │  - Engine    │            │
│  │  - Users     │  │  - Tester    │  │  - Triggers  │            │
│  │  - Config    │  │  - Executor  │  │  - Actions   │            │
│  │  - Logs      │  │  - Versions  │  │  - Scheduler │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ Notification │  │   Amazon     │  │   Analytics  │            │
│  │   Service    │  │   Service    │  │   Service    │            │
│  │              │  │              │  │              │            │
│  │  - Email     │  │  - SP-API    │  │  - Metrics   │            │
│  │  - SMS       │  │  - Ads API   │  │  - Reports   │            │
│  │  - Push      │  │  - OAuth     │  │  - ML Models │            │
│  │  - In-app    │  │  - Sync      │  │  - Forecasts │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Billing    │  │   Workflow   │  │  WebSocket   │            │
│  │   Service    │  │   Service    │  │   Service    │            │
│  │              │  │              │  │              │            │
│  │  - Stripe    │  │  - Builder   │  │  - Real-time │            │
│  │  - Invoices  │  │  - Executor  │  │  - Presence  │            │
│  │  - Subscr.   │  │  - Scheduler │  │  - Broadcast │            │
│  │  - Usage     │  │  - Status    │  │  - Rooms     │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────────────┐
│                      MESSAGE QUEUE LAYER                            │
├────────────────────────────────────────────────────────────────────┤
│  RabbitMQ / Apache Kafka                                           │
│  ├─ Event Bus                                                      │
│  ├─ Job Queue (BullMQ)                                             │
│  ├─ Dead Letter Queue                                              │
│  └─ Priority Queues                                                │
└────────────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                  │
├────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │ PostgreSQL  │  │    Redis    │  │  Elasticsearch              │
│  │             │  │             │  │             │               │
│  │ - Primary   │  │ - Cache     │  │ - Logs      │               │
│  │ - Relations │  │ - Sessions  │  │ - Search    │               │
│  │ - ACID      │  │ - Pub/Sub   │  │ - Analytics │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │  MongoDB    │  │  AWS S3     │  │  InfluxDB   │               │
│  │             │  │             │  │             │               │
│  │ - Documents │  │ - Files     │  │ - Time-series               │
│  │ - Logs      │  │ - Exports   │  │ - Metrics   │               │
│  │ - Configs   │  │ - Backups   │  │ - Events    │               │
│  └─────────────┘  └─────────────┘  └─────────────┘               │
└────────────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────────────┐
│                    OBSERVABILITY LAYER                              │
├────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │   Prometheus    │  │     Grafana     │  │     Sentry       │  │
│  │   (Metrics)     │  │  (Dashboards)   │  │  (Errors)        │  │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘  │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │      ELK        │  │     Jaeger      │  │   DataDog        │  │
│  │    (Logs)       │  │   (Tracing)     │  │  (APM)           │  │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend Architecture (React)

### Modern React Architecture

```typescript
// Project Structure
frontend/
├── src/
│   ├── app/                      # App-level configuration
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── providers/            # Global providers
│   │       ├── AuthProvider.tsx
│   │       ├── ThemeProvider.tsx
│   │       └── SocketProvider.tsx
│   │
│   ├── features/                 # Feature-based modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── store/
│   │   │   └── types/
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── formulas/
│   │   │   ├── rules/
│   │   │   └── settings/
│   │   │
│   │   ├── campaigns/
│   │   ├── keywords/
│   │   └── reports/
│   │
│   ├── shared/                   # Shared/common code
│   │   ├── components/           # Reusable components
│   │   │   ├── ui/              # Basic UI components
│   │   │   ├── layout/          # Layout components
│   │   │   ├── forms/           # Form components
│   │   │   └── charts/          # Chart components
│   │   │
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useSocket.ts
│   │   │   └── useAsync.ts
│   │   │
│   │   ├── utils/               # Utility functions
│   │   ├── constants/           # Constants
│   │   ├── types/               # Shared types
│   │   └── api/                 # API client
│   │
│   ├── store/                   # Global state management
│   │   ├── auth.store.ts        # Zustand stores
│   │   ├── ui.store.ts
│   │   └── socket.store.ts
│   │
│   └── styles/                  # Global styles
│       ├── global.css
│       └── themes/
│
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── package.json
```

### State Management Strategy

```typescript
// 1. ZUSTAND for Global UI State (simple, fast)
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIStore {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Notification) => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        theme: 'light',
        sidebarCollapsed: false,
        notifications: [],
        toggleTheme: () => set((state) => ({ 
          theme: state.theme === 'light' ? 'dark' : 'light' 
        })),
        toggleSidebar: () => set((state) => ({ 
          sidebarCollapsed: !state.sidebarCollapsed 
        })),
        addNotification: (notification) => set((state) => ({
          notifications: [...state.notifications, notification]
        })),
      }),
      { name: 'ui-storage' }
    )
  )
);

// 2. REACT QUERY for Server State (caching, sync)
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query example
export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
  });
}

// Mutation example
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (user: CreateUserDTO) => userService.createUser(user),
    onSuccess: () => {
      // Invalidate users query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// 3. JOTAI for Component-Level State (atoms)
import { atom, useAtom } from 'jotai';

// Simple atom
export const searchQueryAtom = atom('');

// Derived atom
export const filteredUsersAtom = atom((get) => {
  const users = get(usersAtom);
  const query = get(searchQueryAtom);
  return users.filter(u => u.name.includes(query));
});

// Usage in component
function UserSearch() {
  const [query, setQuery] = useAtom(searchQueryAtom);
  const [filteredUsers] = useAtom(filteredUsersAtom);
  
  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <UserList users={filteredUsers} />
    </div>
  );
}
```

### Component Architecture

```typescript
// Smart/Container Component (handles logic)
export function UserManagementContainer() {
  const { data: users, isLoading, error } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  const handleCreate = async (userData: CreateUserDTO) => {
    await createUser.mutateAsync(userData);
    showNotification({ message: 'User created successfully' });
  };
  
  return (
    <UserManagementView
      users={users}
      isLoading={isLoading}
      error={error}
      onCreate={handleCreate}
      onUpdate={updateUser.mutate}
      onDelete={deleteUser.mutate}
    />
  );
}

// Presentational Component (UI only)
interface UserManagementViewProps {
  users?: User[];
  isLoading: boolean;
  error: Error | null;
  onCreate: (user: CreateUserDTO) => void;
  onUpdate: (id: string, user: UpdateUserDTO) => void;
  onDelete: (id: string) => void;
}

export function UserManagementView({
  users,
  isLoading,
  error,
  onCreate,
  onUpdate,
  onDelete,
}: UserManagementViewProps) {
  // Only UI logic here
  return (
    <Stack>
      <UserTable users={users} onUpdate={onUpdate} onDelete={onDelete} />
      <CreateUserModal onCreate={onCreate} />
    </Stack>
  );
}
```

### Advanced Hooks Patterns

```typescript
// Custom hook with all the logic
export function useUserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const users = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setModalOpen(true);
  };
  
  const handleSubmit = async (data: UserFormData) => {
    if (selectedUser) {
      await updateUser.mutateAsync({ id: selectedUser.id, data });
    } else {
      await createUser.mutateAsync(data);
    }
    setModalOpen(false);
    setSelectedUser(null);
  };
  
  return {
    users,
    selectedUser,
    modalOpen,
    setModalOpen,
    handleEdit,
    handleSubmit,
    handleDelete: deleteUser.mutate,
  };
}

// Component becomes super simple
export function UserManagement() {
  const {
    users,
    modalOpen,
    setModalOpen,
    handleEdit,
    handleSubmit,
    handleDelete,
  } = useUserManagement();
  
  return (
    <>
      <UserTable
        users={users.data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

### Real-Time Integration

```typescript
// Socket.io client setup
import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

interface SocketStore {
  socket: Socket | null;
  connected: boolean;
  connect: (token: string) => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  connected: false,
  
  connect: (token: string) => {
    const socket = io(API_BASE_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    
    socket.on('connect', () => {
      console.log('Socket connected');
      set({ connected: true });
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ connected: false });
    });
    
    set({ socket });
  },
  
  disconnect: () => {
    const { socket } = get();
    socket?.disconnect();
    set({ socket: null, connected: false });
  },
  
  emit: (event, data) => {
    const { socket } = get();
    socket?.emit(event, data);
  },
  
  on: (event, callback) => {
    const { socket } = get();
    socket?.on(event, callback);
  },
}));

// Real-time hook
export function useRealTimeUpdates() {
  const queryClient = useQueryClient();
  const { on } = useSocketStore();
  
  useEffect(() => {
    // Listen for real-time updates
    on('user:created', (user: User) => {
      queryClient.setQueryData(['users'], (old: User[] = []) => [...old, user]);
    });
    
    on('user:updated', (user: User) => {
      queryClient.setQueryData(['users'], (old: User[] = []) =>
        old.map(u => u.id === user.id ? user : u)
      );
    });
    
    on('user:deleted', (userId: string) => {
      queryClient.setQueryData(['users'], (old: User[] = []) =>
        old.filter(u => u.id !== userId)
      );
    });
    
    on('system:alert', (alert: Alert) => {
      showNotification({ type: 'warning', message: alert.message });
    });
  }, [on, queryClient]);
}
```

---

## 🔧 Backend Architecture (Node.js)

### Microservices Structure

```typescript
// Monorepo structure with workspaces
backend/
├── packages/                    # Shared packages
│   ├── common/                 # Common utilities
│   │   ├── errors/
│   │   ├── logger/
│   │   ├── validation/
│   │   └── types/
│   │
│   ├── database/               # Database client
│   │   ├── prisma/
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   └── events/                 # Event types & emitters
│       ├── types.ts
│       └── emitter.ts
│
├── services/                    # Microservices
│   ├── auth/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── index.ts
│   │   ├── tests/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── user/
│   ├── admin/
│   ├── campaign/
│   ├── formula/
│   ├── rules/
│   ├── notification/
│   ├── amazon/
│   ├── analytics/
│   ├── billing/
│   └── workflow/
│
├── gateway/                     # API Gateway
│   ├── kong.yml
│   └── nginx.conf
│
├── docker-compose.yml
└── package.json
```

### Service Template (Best Practices)

```typescript
// services/user/src/index.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { logger } from '@package/common/logger';
import { errorHandler } from '@package/common/errors';
import { routes } from './routes';
import { connectDatabase } from '@package/database';
import { registerService, healthCheck } from './utils/service-registry';

const app = express();
const PORT = process.env.PORT || 3002;
const SERVICE_NAME = 'user-service';

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(compression()); // Gzip compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    service: SERVICE_NAME,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  next();
});

// Routes
app.use('/api/users', routes);

// Health check endpoint
app.get('/health', healthCheck);

// Error handling
app.use(errorHandler);

// Start server
async function start() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected');
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`${SERVICE_NAME} started on port ${PORT}`);
    });
    
    // Register service with service registry
    await registerService(SERVICE_NAME, PORT);
    
  } catch (error) {
    logger.error('Failed to start service', { error });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  // Close database connections, etc.
  process.exit(0);
});

start();
```

### Controller Pattern (Clean Architecture)

```typescript
// services/user/src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { validate } from '@package/common/validation';
import { HttpException } from '@package/common/errors';

export class UserController {
  constructor(private userService: UserService) {}
  
  // GET /api/users
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 50, search, role, status } = req.query;
      
      const result = await this.userService.findAll({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        role: role as string,
        status: status as string,
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
    } catch (error) {
      next(error);
    }
  }
  
  // GET /api/users/:id
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      
      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
  
  // POST /api/users
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = await validate(CreateUserDTO, req.body);
      const user = await this.userService.create(dto);
      
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
  
  // PATCH /api/users/:id
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const dto = await validate(UpdateUserDTO, req.body);
      const user = await this.userService.update(id, dto);
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
  
  // DELETE /api/users/:id
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.userService.delete(id);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
```

### Service Layer (Business Logic)

```typescript
// services/user/src/services/user.service.ts
import { UserRepository } from '../repositories/user.repository';
import { EventEmitter } from '@package/events';
import { logger } from '@package/common/logger';
import { HttpException } from '@package/common/errors';
import bcrypt from 'bcryptjs';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private eventEmitter: EventEmitter
  ) {}
  
  async findAll(filters: UserFilters) {
    const users = await this.userRepository.findMany(filters);
    const total = await this.userRepository.count(filters);
    
    return { users, total };
  }
  
  async findById(id: string) {
    return this.userRepository.findById(id);
  }
  
  async create(data: CreateUserDTO) {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new HttpException(409, 'User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    
    // Emit event
    this.eventEmitter.emit('user:created', user);
    
    // Log
    logger.info('User created', { userId: user.id, email: user.email });
    
    return user;
  }
  
  async update(id: string, data: UpdateUserDTO) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    // Update user
    const updatedUser = await this.userRepository.update(id, data);
    
    // Emit event
    this.eventEmitter.emit('user:updated', updatedUser);
    
    return updatedUser;
  }
  
  async delete(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    // Soft delete
    await this.userRepository.softDelete(id);
    
    // Emit event
    this.eventEmitter.emit('user:deleted', { id });
    
    logger.info('User deleted', { userId: id });
  }
}
```

### Repository Pattern (Data Access)

```typescript
// services/user/src/repositories/user.repository.ts
import { PrismaClient } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findMany(filters: UserFilters) {
    const { page, limit, search, role, status } = filters;
    
    return this.prisma.user.findMany({
      where: {
        ...(search && {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(role && { role }),
        ...(status && { status }),
        deletedAt: null, // Exclude soft deleted
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });
  }
  
  async count(filters: UserFilters) {
    const { search, role, status } = filters;
    
    return this.prisma.user.count({
      where: {
        ...(search && {
          OR: [
            { email: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        }),
        ...(role && { role }),
        ...(status && { status }),
        deletedAt: null,
      },
    });
  }
  
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  
  async create(data: CreateUserData) {
    return this.prisma.user.create({
      data,
    });
  }
  
  async update(id: string, data: UpdateUserData) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }
  
  async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
```

### Event-Driven Architecture

```typescript
// packages/events/emitter.ts
import { EventEmitter2 } from 'eventemitter2';
import { RabbitMQAdapter } from './adapters/rabbitmq';
import { logger } from '@package/common/logger';

export class AppEventEmitter {
  private emitter: EventEmitter2;
  private messageQueue?: RabbitMQAdapter;
  
  constructor() {
    this.emitter = new EventEmitter2({
      wildcard: true,
      delimiter: ':',
      maxListeners: 100,
    });
    
    // Connect to message queue
    this.connectMessageQueue();
  }
  
  private async connectMessageQueue() {
    try {
      this.messageQueue = new RabbitMQAdapter(process.env.RABBITMQ_URL!);
      await this.messageQueue.connect();
      logger.info('Connected to message queue');
    } catch (error) {
      logger.error('Failed to connect to message queue', { error });
    }
  }
  
  emit(event: string, data: any) {
    // Emit locally
    this.emitter.emit(event, data);
    
    // Publish to message queue (for inter-service communication)
    if (this.messageQueue) {
      this.messageQueue.publish(event, data);
    }
    
    logger.debug('Event emitted', { event, data });
  }
  
  on(event: string, listener: (data: any) => void) {
    this.emitter.on(event, listener);
  }
  
  async subscribe(event: string, handler: (data: any) => Promise<void>) {
    if (this.messageQueue) {
      await this.messageQueue.subscribe(event, handler);
    }
  }
}

export const eventEmitter = new AppEventEmitter();
```

### Message Queue Integration

```typescript
// packages/events/adapters/rabbitmq.ts
import amqp from 'amqplib';
import { logger } from '@package/common/logger';

export class RabbitMQAdapter {
  private connection?: amqp.Connection;
  private channel?: amqp.Channel;
  private exchange = 'app_events';
  
  constructor(private url: string) {}
  
  async connect() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
    
    await this.channel.assertExchange(this.exchange, 'topic', {
      durable: true,
    });
    
    logger.info('RabbitMQ connected');
  }
  
  async publish(event: string, data: any) {
    if (!this.channel) return;
    
    const message = JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString(),
    });
    
    this.channel.publish(
      this.exchange,
      event,
      Buffer.from(message),
      { persistent: true }
    );
  }
  
  async subscribe(pattern: string, handler: (data: any) => Promise<void>) {
    if (!this.channel) return;
    
    const queue = await this.channel.assertQueue('', { exclusive: true });
    
    await this.channel.bindQueue(queue.queue, this.exchange, pattern);
    
    this.channel.consume(queue.queue, async (msg) => {
      if (msg) {
        try {
          const { event, data } = JSON.parse(msg.content.toString());
          await handler(data);
          this.channel!.ack(msg);
        } catch (error) {
          logger.error('Failed to handle message', { error });
          this.channel!.nack(msg, false, false); // Dead letter queue
        }
      }
    });
  }
  
  async close() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
```

---

## 🗄️ Database Architecture

### Multi-Database Strategy

```typescript
// Primary Database: PostgreSQL (Relational data)
// - Users, Campaigns, Keywords, etc.
// - ACID transactions
// - Complex queries with joins

// Cache: Redis (Fast access)
// - Session data
// - Frequently accessed data
// - Real-time pub/sub
// - Rate limiting

// Document Store: MongoDB (Flexible schemas)
// - Logs
// - Analytics events
// - Configuration documents
// - Audit trails

// Search Engine: Elasticsearch (Full-text search)
// - Log search
// - User search
// - Campaign search
// - Advanced analytics

// Time-Series: InfluxDB (Metrics)
// - System metrics
// - API performance
// - User activity
// - Real-time monitoring

// Object Storage: AWS S3 (Files)
// - Export files
// - Backups
// - User uploads
```

### Prisma Schema (PostgreSQL)

```prisma
// packages/database/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  password          String
  firstName         String
  lastName          String
  role              UserRole  @default(USER)
  status            UserStatus @default(ACTIVE)
  emailVerified     Boolean   @default(false)
  twoFactorEnabled  Boolean   @default(false)
  lastLoginAt       DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?
  
  // Relations
  subscription      Subscription?
  campaigns         Campaign[]
  amazonAccounts    AmazonAccount[]
  apiKeys           ApiKey[]
  sessions          Session[]
  notifications     Notification[]
  auditLogs         AuditLog[]
  
  @@index([email])
  @@index([role])
  @@index([status])
  @@map("users")
}

enum UserRole {
  SUPER_ADMIN
  ADMIN
  MANAGER
  USER
  VIEWER
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  PENDING
  DELETED
}

model Subscription {
  id                    String    @id @default(uuid())
  userId                String    @unique
  user                  User      @relation(fields: [userId], references: [id])
  planId                String
  status                SubscriptionStatus
  billingCycle          BillingCycle
  currentPeriodStart    DateTime
  currentPeriodEnd      DateTime
  cancelAtPeriodEnd     Boolean   @default(false)
  trialEndsAt           DateTime?
  stripeCustomerId      String?
  stripeSubscriptionId  String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  @@index([userId])
  @@index([status])
  @@map("subscriptions")
}

enum SubscriptionStatus {
  ACTIVE
  TRIAL
  PAST_DUE
  CANCELLED
  EXPIRED
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

model Formula {
  id          String    @id @default(uuid())
  name        String
  description String?
  formula     String    // Mathematical expression
  variables   Json      // Variable definitions
  category    String
  version     Int       @default(1)
  isActive    Boolean   @default(true)
  testCases   Json?     // Test cases
  createdBy   String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([category])
  @@index([isActive])
  @@map("formulas")
}

model AutomationRule {
  id                String    @id @default(uuid())
  name              String
  description       String?
  enabled           Boolean   @default(true)
  priority          Int       @default(0)
  trigger           Json      // Trigger configuration
  conditions        Json      // Condition array
  actions           Json      // Action array
  schedule          String?   // Cron expression
  throttle          Json?     // Throttle config
  version           Int       @default(1)
  executionCount    Int       @default(0)
  lastExecutedAt    DateTime?
  createdBy         String
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([enabled])
  @@index([priority])
  @@map("automation_rules")
}

model ApiKey {
  id              String    @id @default(uuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  name            String
  keyHash         String    @unique
  type            ApiKeyType @default(MASTER)
  scopes          Json?
  rateLimit       Json?
  ipWhitelist     Json?
  expiresAt       DateTime?
  lastUsedAt      DateTime?
  usageCount      Int       @default(0)
  revoked         Boolean   @default(false)
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([keyHash])
  @@map("api_keys")
}

enum ApiKeyType {
  MASTER
  READ_ONLY
  WRITE_ONLY
  CUSTOM
}

model AuditLog {
  id            String    @id @default(uuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  action        String
  resourceType  String
  resourceId    String?
  changes       Json?     // Before/after
  ipAddress     String?
  userAgent     String?
  metadata      Json?
  createdAt     DateTime  @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([resourceType])
  @@index([createdAt])
  @@map("audit_logs")
}

model Session {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  token       String    @unique
  ipAddress   String?
  userAgent   String?
  device      Json?
  location    Json?
  expiresAt   DateTime
  lastActivity DateTime @default(now())
  createdAt   DateTime  @default(now())
  
  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}

model Notification {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  type      NotificationType
  title     String
  message   String
  action    Json?
  read      Boolean   @default(false)
  createdAt DateTime  @default(now())
  expiresAt DateTime?
  
  @@index([userId])
  @@index([read])
  @@index([createdAt])
  @@map("notifications")
}

enum NotificationType {
  INFO
  SUCCESS
  WARNING
  ERROR
}
```

### Redis Cache Strategy

```typescript
// packages/database/redis/cache.service.ts
import Redis from 'ioredis';
import { logger } from '@package/common/logger';

export class CacheService {
  private redis: Redis;
  private defaultTTL = 3600; // 1 hour
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
    
    this.redis.on('connect', () => {
      logger.info('Redis connected');
    });
    
    this.redis.on('error', (error) => {
      logger.error('Redis error', { error });
    });
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error', { key, error });
      return null;
    }
  }
  
  async set<T>(key: string, value: T, ttl: number = this.defaultTTL): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error('Cache set error', { key, error });
    }
  }
  
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      logger.error('Cache delete error', { key, error });
    }
  }
  
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      logger.error('Cache delete pattern error', { pattern, error });
    }
  }
  
  // Cache-aside pattern
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = this.defaultTTL
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached) return cached;
    
    // Fetch from source
    const value = await fetcher();
    
    // Store in cache
    await this.set(key, value, ttl);
    
    return value;
  }
  
  // Pub/Sub for real-time updates
  async publish(channel: string, message: any): Promise<void> {
    await this.redis.publish(channel, JSON.stringify(message));
  }
  
  subscribe(channel: string, handler: (message: any) => void): void {
    const subscriber = this.redis.duplicate();
    subscriber.subscribe(channel);
    subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        handler(JSON.parse(msg));
      }
    });
  }
}

export const cacheService = new CacheService();
```

---

## 🔐 Authentication & Authorization

### JWT Strategy with Refresh Tokens

```typescript
// services/auth/src/services/token.service.ts
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

export class TokenService {
  private accessTokenSecret = process.env.JWT_SECRET!;
  private refreshTokenSecret = process.env.JWT_REFRESH_SECRET!;
  private accessTokenExpiry = '15m';
  private refreshTokenExpiry = '7d';
  
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }
  
  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
    });
  }
  
  generateTokenPair(payload: Omit<TokenPayload, 'sessionId'>) {
    const sessionId = uuidv4();
    const fullPayload = { ...payload, sessionId };
    
    return {
      accessToken: this.generateAccessToken(fullPayload),
      refreshToken: this.generateRefreshToken(fullPayload),
      sessionId,
    };
  }
  
  verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
  }
  
  verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
  }
  
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}
```

### Role-Based Access Control (RBAC)

```typescript
// packages/common/authorization/rbac.ts
import { UserRole } from '@prisma/client';

type Resource = 'users' | 'campaigns' | 'formulas' | 'rules' | 'settings' | 'billing';
type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

type Permission = `${Resource}:${Action}`;

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: ['*:*'], // All permissions
  
  ADMIN: [
    'users:read',
    'users:update',
    'campaigns:*',
    'formulas:*',
    'rules:*',
    'settings:read',
    'settings:update',
  ],
  
  MANAGER: [
    'users:read',
    'campaigns:*',
    'formulas:read',
    'rules:read',
    'rules:create',
  ],
  
  USER: [
    'campaigns:read',
    'campaigns:create',
    'campaigns:update',
    'formulas:read',
    'rules:read',
  ],
  
  VIEWER: [
    'campaigns:read',
    'formulas:read',
    'rules:read',
  ],
};

export function hasPermission(
  role: UserRole,
  resource: Resource,
  action: Action
): boolean {
  const permissions = rolePermissions[role];
  
  // Check for wildcard permission
  if (permissions.includes('*:*')) return true;
  
  // Check for exact permission
  const permission: Permission = `${resource}:${action}`;
  if (permissions.includes(permission)) return true;
  
  // Check for resource wildcard
  const resourceWildcard: Permission = `${resource}:*`;
  if (permissions.includes(resourceWildcard)) return true;
  
  return false;
}

// Middleware
export function authorize(resource: Resource, action: Action) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Set by authenticate middleware
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!hasPermission(user.role, resource, action)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
}

// Usage:
// router.post('/users', authorize('users', 'create'), createUser);
```

---

## 📊 Monitoring & Observability

### Prometheus Metrics

```typescript
// packages/common/monitoring/metrics.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export class MetricsService {
  private registry: Registry;
  
  // HTTP metrics
  public httpRequestsTotal: Counter;
  public httpRequestDuration: Histogram;
  public httpRequestsInProgress: Gauge;
  
  // Business metrics
  public usersTotal: Gauge;
  public campaignsActive: Gauge;
  public apiCallsTotal: Counter;
  
  constructor() {
    this.registry = new Registry();
    
    // HTTP request counter
    this.httpRequestsTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });
    
    // HTTP request duration
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
    
    // HTTP requests in progress
    this.httpRequestsInProgress = new Gauge({
      name: 'http_requests_in_progress',
      help: 'HTTP requests in progress',
      labelNames: ['method', 'route'],
      registers: [this.registry],
    });
    
    // Business metrics
    this.usersTotal = new Gauge({
      name: 'users_total',
      help: 'Total number of users',
      registers: [this.registry],
    });
    
    this.campaignsActive = new Gauge({
      name: 'campaigns_active',
      help: 'Number of active campaigns',
      registers: [this.registry],
    });
    
    this.apiCallsTotal = new Counter({
      name: 'api_calls_total',
      help: 'Total API calls to external services',
      labelNames: ['service', 'endpoint'],
      registers: [this.registry],
    });
  }
  
  getMetrics(): string {
    return this.registry.metrics();
  }
}

export const metricsService = new MetricsService();

// Middleware to track HTTP metrics
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const { method, route } = req;
  
  // Increment in-progress
  metricsService.httpRequestsInProgress.inc({ method, route: route?.path });
  
  // On response finish
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const { statusCode } = res;
    
    // Record metrics
    metricsService.httpRequestsTotal.inc({
      method,
      route: route?.path,
      status_code: statusCode,
    });
    
    metricsService.httpRequestDuration.observe(
      { method, route: route?.path, status_code: statusCode },
      duration
    );
    
    metricsService.httpRequestsInProgress.dec({ method, route: route?.path });
  });
  
  next();
}
```

### Distributed Tracing

```typescript
// packages/common/tracing/tracer.ts
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

export class TracingService {
  private tracer;
  
  constructor(serviceName: string) {
    const provider = new NodeTracerProvider();
    
    const exporter = new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT,
    });
    
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    provider.register();
    
    this.tracer = trace.getTracer(serviceName);
  }
  
  async traceFunction<T>(
    name: string,
    fn: () => Promise<T>,
    attributes?: Record<string, any>
  ): Promise<T> {
    const span = this.tracer.startSpan(name, { attributes });
    
    try {
      const result = await context.with(
        trace.setSpan(context.active(), span),
        fn
      );
      
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  }
}
```

---

## 🚀 Deployment Architecture

### Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway
  gateway:
    image: kong:latest
    ports:
      - "8000:8000"  # Proxy
      - "8001:8001"  # Admin API
    environment:
      KONG_DATABASE: postgres
      KONG_PG_HOST: postgres
      KONG_PG_USER: kong
      KONG_PG_PASSWORD: kong
    depends_on:
      - postgres
    networks:
      - app-network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://gateway:8000
    networks:
      - app-network

  # Auth Service
  auth-service:
    build:
      context: ./backend/services/auth
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/amazon_fdc
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - postgres
      - redis
      - rabbitmq
    networks:
      - app-network

  # User Service
  user-service:
    build:
      context: ./backend/services/user
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/amazon_fdc
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  # Admin Service
  admin-service:
    build:
      context: ./backend/services/admin
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/amazon_fdc
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  # Formula Service
  formula-service:
    build:
      context: ./backend/services/formula
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/amazon_fdc
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  # Rules Service
  rules-service:
    build:
      context: ./backend/services/rules
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/amazon_fdc
      REDIS_URL: redis://redis:6379
      RABBITMQ_URL: amqp://rabbitmq:5672
    depends_on:
      - postgres
      - redis
      - rabbitmq
    networks:
      - app-network

  # WebSocket Service
  websocket-service:
    build:
      context: ./backend/services/websocket
      dockerfile: Dockerfile
    ports:
      - "3010:3010"
    environment:
      REDIS_URL: redis://redis:6379
    depends_on:
      - redis
    networks:
      - app-network

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: amazon_fdc
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  # RabbitMQ
  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"  # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    networks:
      - app-network

  # MongoDB
  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  # Elasticsearch
  elasticsearch:
    image: elasticsearch:8.10.0
    ports:
      - "9200:9200"
    environment:
      discovery.type: single-node
      xpack.security.enabled: false
    volumes:
      - es-data:/usr/share/elasticsearch/data
    networks:
      - app-network

  # Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - app-network

  # Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:
  rabbitmq-data:
  mongo-data:
  es-data:
  prometheus-data:
  grafana-data:

networks:
  app-network:
    driver: bridge
```

### Kubernetes (Production)

```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
  labels:
    app: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: amazon-fdc/user-service:latest
        ports:
        - containerPort: 3002
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: redis-config
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3002
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3002
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 3002
  type: ClusterIP
```

---

## 📋 Summary: Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Mantine UI + TailwindCSS
- **State Management**: Zustand (UI) + React Query (Server) + Jotai (Atoms)
- **Charts**: Apache ECharts + Recharts
- **Tables**: TanStack Table
- **Forms**: React Hook Form + Zod
- **Real-time**: Socket.io Client
- **Testing**: Vitest + React Testing Library + Playwright

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Architecture**: Microservices
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Message Queue**: RabbitMQ / Apache Kafka
- **Search**: Elasticsearch
- **Storage**: AWS S3
- **Authentication**: JWT + Passport.js
- **Validation**: Zod / Joi
- **Testing**: Jest + Supertest

### DevOps
- **Container**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger / OpenTelemetry
- **Error Tracking**: Sentry
- **APM**: DataDog / New Relic

### Infrastructure
- **Cloud Provider**: AWS / GCP / Azure
- **Load Balancer**: NGINX / Kong
- **CDN**: CloudFlare
- **DNS**: Route 53
- **SSL**: Let's Encrypt
- **Database Backup**: Automated snapshots
- **Disaster Recovery**: Multi-region replication

---

## 🎯 Next Steps

1. **Review Architecture** - Approve the design
2. **Set Up Development Environment** - Docker Compose for local dev
3. **Implement Microservices** - Start with core services
4. **Build Admin Panel** - Frontend + backend integration
5. **Add Monitoring** - Prometheus + Grafana
6. **Deploy to Production** - Kubernetes cluster

**Estimated Timeline**: 10-12 weeks for complete migration

Would you like me to start implementing this architecture? We can begin with:
1. Setting up the microservices structure
2. Implementing the admin service
3. Creating the admin panel frontend

Let me know your priorities! 🚀
