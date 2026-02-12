import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserLoginForm as LoginForm } from './components/auth/UserLoginForm';
import { AdminLoginForm } from './components/auth/AdminLoginForm';
import { EnhancedRegisterForm as RegisterForm } from './components/auth/EnhancedRegisterForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { useAuthStore } from './stores/authStore';
import { Loader } from '@mantine/core';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CampaignManagement = lazy(() => import('./pages/CampaignManagement'));
const KeywordManagement = lazy(() => import('./pages/KeywordManagement'));
const AutomationRules = lazy(() => import('./pages/AutomationRules'));
const DailyReports = lazy(() => import('./pages/DailyReports').then(m => ({ default: m.DailyReports })));
const Reports = lazy(() => import('./pages/Reports'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

// Lazy load admin components
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminFormulas = lazy(() => import('./pages/admin/AdminFormulas').then(m => ({ default: m.AdminFormulas })));
const AdminRules = lazy(() => import('./pages/admin/AdminRules').then(m => ({ default: m.AdminRules })));
const AdminCustomization = lazy(() => import('./pages/admin/AdminCustomization').then(m => ({ default: m.AdminCustomization })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })));
const AdminAPI = lazy(() => import('./pages/admin/AdminAPI').then(m => ({ default: m.AdminAPI })));
const AdminMonitoring = lazy(() => import('./pages/admin/AdminMonitoring').then(m => ({ default: m.AdminMonitoring })));
const AdminAutomation = lazy(() => import('./pages/admin/AdminAutomation').then(m => ({ default: m.AdminAutomation })));
const AdminAIML = lazy(() => import('./pages/admin/AdminAIML').then(m => ({ default: m.AdminAIML })));
const AdminBilling = lazy(() => import('./pages/admin/AdminBilling').then(m => ({ default: m.AdminBilling })));
const AdminSecurity = lazy(() => import('./pages/admin/AdminSecurity').then(m => ({ default: m.AdminSecurity })));

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader size="xl" /></div>}>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginForm /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/adminmanager"
          element={!isAuthenticated ? <AdminLoginForm /> : <Navigate to="/admin/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardLayout><Dashboard /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/campaigns"
          element={isAuthenticated ? <DashboardLayout><CampaignManagement /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/keywords"
          element={isAuthenticated ? <DashboardLayout><KeywordManagement /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/automation"
          element={isAuthenticated ? <DashboardLayout><AutomationRules /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/daily-reports"
          element={isAuthenticated ? <DashboardLayout><DailyReports /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <DashboardLayout><Reports /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/alerts"
          element={isAuthenticated ? <DashboardLayout><Alerts /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <DashboardLayout><Profile /></DashboardLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <DashboardLayout><Settings /></DashboardLayout> : <Navigate to="/login" />}
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="formulas" element={<AdminFormulas />} />
          <Route path="rules" element={<AdminRules />} />
          <Route path="customization" element={<AdminCustomization />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="api" element={<AdminAPI />} />
          <Route path="monitoring" element={<AdminMonitoring />} />
          <Route path="automation" element={<AdminAutomation />} />
          <Route path="ai-ml" element={<AdminAIML />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="security" element={<AdminSecurity />} />
        </Route>
        
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;