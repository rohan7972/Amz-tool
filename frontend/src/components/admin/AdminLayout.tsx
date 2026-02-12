import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppShell,
  Text,
  Burger,
  Group,
  Avatar,
  Menu,
  ActionIcon,
  Title,
  NavLink,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDashboard,
  IconUsers,
  IconMathFunction,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconActivity,
  IconShieldCheck,
  IconChartBar,
  IconRuler,
  IconPalette,
  IconServer,
  IconApi,
  IconFileAnalytics,
  IconRobot,
  IconBrain,
  IconCoin,
  IconLock,
} from '@tabler/icons-react';
import { useAuthStore } from '@/stores/authStore';

export function AdminLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard & Analytics', icon: IconChartBar, path: '/admin/dashboard' },
    { label: 'User Management', icon: IconUsers, path: '/admin/users' },
    { label: 'Formula Engine', icon: IconMathFunction, path: '/admin/formulas' },
    { label: 'Rules Engine', icon: IconRuler, path: '/admin/rules' },
    { label: 'UI/UX Customization', icon: IconPalette, path: '/admin/customization' },
    { label: 'System Configuration', icon: IconSettings, path: '/admin/settings' },
    { label: 'API Management', icon: IconApi, path: '/admin/api' },
    { label: 'Monitoring & Logs', icon: IconFileAnalytics, path: '/admin/monitoring' },
    { label: 'Automation Hub', icon: IconRobot, path: '/admin/automation' },
    { label: 'AI/ML Features', icon: IconBrain, path: '/admin/ai-ml' },
    { label: 'Revenue & Billing', icon: IconCoin, path: '/admin/billing' },
    { label: 'Security Center', icon: IconLock, path: '/admin/security' },
  ];

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        <IconShieldCheck size={64} color="red" />
        <Title order={2}>Access Denied</Title>
        <Text c="dimmed">You need admin privileges to access this panel.</Text>
        <Text 
          component="a" 
          href="/dashboard" 
          style={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}
        >
          Go to Dashboard
        </Text>
      </Box>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap="xs">
              <IconShieldCheck size={24} color="red" />
              <Text size="lg" fw={700}>
                Amazon FDC Tool - Admin
              </Text>
            </Group>
          </Group>

          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="lg">
                <Avatar radius="xl" size="sm" color="red">
                  {user?.firstName?.[0]?.toUpperCase() || 'A'}
                </Avatar>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Admin Account</Menu.Label>
              <Menu.Item>
                {user?.firstName} {user?.lastName}
              </Menu.Item>
              <Menu.Item>
                <Text size="xs" c="dimmed">{user?.email}</Text>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconLogout size={14} />}
                onClick={handleLogout}
                color="red"
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow mt="md">
          <Title order={4} mb="lg" c="dimmed">
            Admin Panel
          </Title>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                label={item.label}
                leftSection={<Icon size={20} />}
                rightSection={<IconChevronRight size={14} />}
                active={isActive}
                onClick={() => {
                  navigate(item.path);
                  if (opened) toggle();
                }}
                style={{
                  borderRadius: '8px',
                  marginBottom: 4,
                }}
              />
            );
          })}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
