import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  RingProgress,
  Timeline,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconUsers,
  IconApi,
  IconMathFunction,
  IconRocket,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    activePercentage: number;
  };
  api: {
    callsToday: number;
    avgResponseTime: number;
    growth: number;
  };
  formulas: {
    total: number;
    active: number;
  };
  rules: {
    total: number;
    enabled: number;
  };
}

interface Activity {
  id: string;
  message: string;
  timeAgo: string;
  action: string;
}

export function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [metricsRes, activityRes] = await Promise.all([
        axios.get(`${API_URL}/admin/dashboard/metrics`, { headers }),
        axios.get(`${API_URL}/admin/dashboard/activity?limit=10`, { headers }),
      ]);

      setMetrics(metricsRes.data.data);
      setActivity(activityRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">
        Admin Dashboard
      </Title>

      <Grid gutter="md">
        {/* User Stats */}
        <Grid.Col span={12} md={6} lg={3}>
          <Paper p="md" shadow="sm" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>
                  Total Users
                </Text>
                <Text size="xl" fw={700}>
                  {metrics?.users.total || 0}
                </Text>
                <Text size="xs" color="green" mt="xs">
                  <IconTrendingUp size={16} /> +{metrics?.users.newThisMonth || 0} this month
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: metrics?.users.activePercentage || 0, color: 'blue' }]}
                label={
                  <Text size="xs" align="center" weight={700}>
                    {metrics?.users.activePercentage || 0}%
                  </Text>
                }
              />
            </Group>
          </Paper>
        </Grid.Col>

        {/* API Stats */}
        <Grid.Col span={12} md={6} lg={3}>
          <Paper p="md" shadow="sm" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>
                  API Calls Today
                </Text>
                <Text size="xl" fw={700}>
                  {metrics?.api.callsToday?.toLocaleString() || 0}
                </Text>
                <Text size="xs" color="dimmed" mt="xs">
                  Avg: {metrics?.api.avgResponseTime || 0}ms
                </Text>
              </div>
              <IconApi size={40} color="green" />
            </Group>
          </Paper>
        </Grid.Col>

        {/* Formulas Stats */}
        <Grid.Col span={12} md={6} lg={3}>
          <Paper p="md" shadow="sm" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>
                  Formulas
                </Text>
                <Text size="xl" fw={700}>
                  {metrics?.formulas.total || 0}
                </Text>
                <Text size="xs" color="dimmed" mt="xs">
                  {metrics?.formulas.active || 0} active
                </Text>
              </div>
              <IconMathFunction size={40} color="violet" />
            </Group>
          </Paper>
        </Grid.Col>

        {/* Rules Stats */}
        <Grid.Col span={12} md={6} lg={3}>
          <Paper p="md" shadow="sm" withBorder>
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" tt="uppercase" fw={700}>
                  Rules
                </Text>
                <Text size="xl" fw={700}>
                  {metrics?.rules.total || 0}
                </Text>
                <Text size="xs" color="dimmed" mt="xs">
                  {metrics?.rules.enabled || 0} enabled
                </Text>
              </div>
              <IconRocket size={40} color="orange" />
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Recent Activity */}
      <Paper p="md" mt="xl" shadow="sm" withBorder>
        <Title order={4} mb="md">
          Recent Activity
        </Title>
        <Timeline active={activity.length} bulletSize={24} lineWidth={2}>
          {activity.map((item) => (
            <Timeline.Item key={item.id} title={item.message}>
              <Text size="xs" color="dimmed">
                {item.timeAgo}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
        {activity.length === 0 && (
          <Text color="dimmed" align="center" py="xl">
            No recent activity
          </Text>
        )}
      </Paper>
    </Container>
  );
}
