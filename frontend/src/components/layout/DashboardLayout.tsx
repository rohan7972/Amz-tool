import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Menu,
  ScrollArea,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBell,
  IconBolt,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconFileText,
  IconLayoutGrid,
  IconLogout,
  IconRocket,
  IconSearch,
  IconSettings,
  IconShieldCheck,
  IconTrendingUp,
  IconUser,
  IconWand,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { NavbarLink } from './NavbarLink';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [opened, { toggle }] = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      icon: IconChartBar,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: IconLayoutGrid,
      label: 'Daily Report',
      path: '/daily-reports',
    },
    {
      icon: IconShieldCheck,
      label: 'Opportunity Keywords',
      path: '/opportunity-keywords',
    },
    {
      icon: IconSearch,
      label: 'SQP',
      path: '/sqp',
    },
    {
      icon: IconChartBar,
      label: 'N-gram Analysis',
      path: '/n-gram-analysis',
    },
    {
      icon: IconBolt,
      label: 'Automation',
      path: '/automation',
    },
    {
      icon: IconWand,
      label: 'Smart Labels',
      path: '/smart-labels',
    },
    {
      icon: IconFileText,
      label: 'Synopsis',
      path: '/dashboard/synopsis',
    },
    {
      icon: IconRocket,
      label: 'Campaign X',
      path: '/campaigns',
    },
    {
      icon: IconClock,
      label: 'Day Parting',
      path: '/day-parting',
    },
    {
      icon: IconTrendingUp,
      label: 'Keyword Tracker',
      path: '/keyword-tracker',
    },
    {
      icon: IconBell,
      label: 'Alerts',
      path: '/alerts',
    },
    {
      icon: IconSettings,
      label: 'Account Settings',
      path: '/settings',
    },
  ];

  const userMenuItems = [
    {
      icon: <IconUser size={14} />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      icon: <IconSettings size={14} />,
      label: 'Manage Accounts',
      onClick: () => navigate('/settings'),
    },
    {
      icon: <IconLogout size={14} />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AppShell
      navbar={{
        width: { sm: isHovered ? 250 : 80, lg: isHovered ? 280 : 80 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: false },
      }}
      header={{ height: { base: 50, md: 70 } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text size="xl" fw={600}>
              {navigationItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </Text>
          </Group>

          <Group gap={8}>
            <ActionIcon size="lg" variant="subtle" color="gray">
              <IconBell size={18} />
            </ActionIcon>

            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: `${rem(8)} ${rem(12)}`,
                    borderRadius: 'var(--mantine-radius-sm)',
                  }}
                >
                  <Avatar size={32} color="blue" mr={8}>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </Avatar>
                  <IconChevronDown size={14} />
                </UnstyledButton>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                {userMenuItems.map((item, index) => (
                  <Menu.Item key={index} leftSection={item.icon} onClick={item.onClick}>
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ transition: 'width 0.3s ease' }}
      >
        <AppShell.Section grow component={ScrollArea}>
          <Group mb="md" justify={!isHovered ? "center" : "flex-start"}>
            {!isHovered ? (
              <Text size="lg" fw={600} c="blue.6">A</Text>
            ) : (
              <Text size="lg" fw={600} c="blue.6">
                Amazon FDC Tool
              </Text>
            )}
          </Group>

          {navigationItems.map((item) => (
            <NavbarLink
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
              }}
              collapsed={!isHovered}
            />
          ))}
        </AppShell.Section>

        <AppShell.Section>
          <Box
            style={{
              paddingTop: 'var(--mantine-spacing-sm)',
              borderTop: '1px solid var(--mantine-color-gray-3)',
            }}
          >
            <UnstyledButton
              style={{
                display: 'block',
                width: '100%',
                padding: 'var(--mantine-spacing-xs)',
                borderRadius: 'var(--mantine-radius-sm)',
              }}
              onClick={() => navigate('/profile')}
            >
              <Group justify={!isHovered ? "center" : "flex-start"}>
                <Avatar size={40} color="blue">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
                {isHovered && (
                  <Box style={{ flex: 1 }}>
                    <Text size="sm" fw={500} lineClamp={1}>
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text c="dimmed" size="xs" lineClamp={1}>
                      {user?.email}
                    </Text>
                  </Box>
                )}
              </Group>
            </UnstyledButton>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}