# 🚀 Building Admin Panel - Step by Step Guide

## ✅ What We've Created So Far

1. **Database Migration** ✅
   - File: `backend/src/database/migrations/002_admin_panel_schema.ts`
   - Tables: formulas, rules, settings, API keys, logs, metrics, security

2. **Admin Seed Data** ✅
   - File: `backend/src/database/seeds/02_admin_user.ts`
   - Admin User: admin@amazonfdc.com / admin123

3. **Admin Middleware** ✅
   - File: `backend/src/middleware/admin.ts`
   - Functions: requireAdmin, auditLog

4. **Dashboard Routes** ✅
   - File: `backend/src/routes/admin/dashboard.ts`
   - Endpoints: /metrics, /activity, /charts

---

## 🔧 Next Steps to Complete Admin Panel

### Step 1: Run Database Migrations

```bash
cd /workspace/Amazon-FDC-Tool-amazon-tool-v4/backend

# Run migrations
npm run migrate

# Run seeds
npm run seed
```

### Step 2: Update Main App to Mount Admin Routes

Edit `backend/src/index.ts`:

```typescript
import adminRoutes from './routes/admin';
import { requireAdmin } from './middleware/admin';
import { authenticate } from './middleware/auth';

// ... existing code ...

// Mount admin routes (protected)
app.use('/api/admin', authenticate, requireAdmin, adminRoutes);
```

### Step 3: Create Remaining Admin Route Files

I'll create these files now:

1. `backend/src/routes/admin/index.ts` - Main router
2. `backend/src/routes/admin/users.ts` - User management
3. `backend/src/routes/admin/formulas.ts` - Formula engine
4. `backend/src/routes/admin/rules.ts` - Rules engine  
5. `backend/src/routes/admin/settings.ts` - System settings
6. `backend/src/routes/admin/api-keys.ts` - API management
7. `backend/src/routes/admin/logs.ts` - System logs

### Step 4: Create Frontend Admin Components

1. `frontend/src/pages/admin/Dashboard.tsx`
2. `frontend/src/pages/admin/Users.tsx`
3. `frontend/src/pages/admin/Formulas.tsx`
4. `frontend/src/pages/admin/Rules.tsx`
5. `frontend/src/pages/admin/Settings.tsx`
6. `frontend/src/components/admin/AdminLayout.tsx`
7. `frontend/src/components/admin/AdminSidebar.tsx`

### Step 5: Add Admin Routes to React Router

Edit `frontend/src/main.tsx` or `App.tsx`:

```typescript
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
// ... other imports

<Route path="/admin" element={<AdminProtectedRoute />}>
  <Route index element={<Navigate to="/admin/dashboard" />} />
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="formulas" element={<AdminFormulas />} />
  <Route path="rules" element={<AdminRules />} />
  <Route path="settings" element={<AdminSettings />} />
</Route>
```

---

## 📦 Installation Commands

### Backend Dependencies

```bash
cd backend
npm install mathjs bcrypt jsonwebtoken socket.io
```

### Frontend Dependencies

```bash
cd frontend  
npm install @mantine/core @mantine/hooks @tabler/icons-react socket.io-client
```

---

## 🎯 Testing the Admin Panel

### 1. Start Backend

```bash
cd backend
npm run dev
```

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

### 3. Login as Admin

1. Go to: http://localhost:3000
2. Click "Login"
3. Enter:
   - Email: `admin@amazonfdc.com`
   - Password: `admin123`
4. Navigate to: http://localhost:3000/admin

### 4. Test Each Module

- ✅ Dashboard - View metrics
- ✅ Users - Create/edit/delete users
- ✅ Formulas - Create formulas and test
- ✅ Rules - Create automation rules
- ✅ Settings - Modify system settings
- ✅ API Keys - Generate API keys
- ✅ Logs - View system logs

---

## 🔍 Verification Checklist

### Database
- [ ] Migrations run successfully
- [ ] Admin user created in database
- [ ] All tables exist (formulas, rules, settings, etc.)

### Backend
- [ ] Admin routes accessible at `/api/admin/*`
- [ ] Authentication middleware working
- [ ] Admin role check working
- [ ] Audit logging enabled

### Frontend
- [ ] Admin pages render correctly
- [ ] Sidebar navigation working
- [ ] Can login as admin user
- [ ] All CRUD operations work

### Security
- [ ] Non-admin users blocked from `/admin`
- [ ] All actions logged in security_audit_logs
- [ ] Session management working
- [ ] Password hashed with bcrypt

---

## 🚨 Common Issues & Solutions

### Issue 1: "Admin user not found"
**Solution**: Run seed again
```bash
npm run seed
```

### Issue 2: "Permission denied"
**Solution**: Check user role in database
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@amazonfdc.com';
```

### Issue 3: "Cannot access /admin routes"
**Solution**: Check if admin routes are mounted in index.ts

### Issue 4: "Database connection error"
**Solution**: Check DATABASE_URL in .env file

---

## 📝 Next: Complete All Route Files

Let me now create all the remaining backend route files...
