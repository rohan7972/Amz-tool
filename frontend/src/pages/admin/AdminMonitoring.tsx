import { Box, Title, Text, Card, Grid, Badge, Group, ScrollArea, Timeline } from '@mantine/core';
import { IconFileAnalytics, IconCheck, IconAlertTriangle, IconX } from '@tabler/icons-react';

export function AdminMonitoring() {
  const logs = [
    { time: '10:32:15', level: 'info', message: 'User login: admin@amazonfdc.com', icon: IconCheck, color: 'green' },
    { time: '10:30:42', level: 'warning', message: 'High API usage detected', icon: IconAlertTriangle, color: 'yellow' },
    { time: '10:28:11', level: 'error', message: 'Failed to connect to external service', icon: IconX, color: 'red' },
    { time: '10:25:33', level: 'info', message: 'Scheduled backup completed', icon: IconCheck, color: 'green' },
    { time: '10:20:07', level: 'info', message: 'Cache cleared successfully', icon: IconCheck, color: 'green' },
  ];

  const metrics = [
    { label: 'API Calls (24h)', value: '45,231', change: '+12%', color: 'blue' },
    { label: 'Error Rate', value: '0.3%', change: '-0.1%', color: 'green' },
    { label: 'Avg Response Time', value: '145ms', change: '+5ms', color: 'yellow' },
    { label: 'Active Users', value: '1,234', change: '+8%', color: 'cyan' },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>Monitoring & Logs</Title>
          <Text c="dimmed" size="sm">
            System health, logs, and performance metrics
          </Text>
        </Box>
      </Group>

      <Grid mb="xl">
        {metrics.map((metric, idx) => (
          <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {metric.label}
              </Text>
              <Group justify="space-between" mt="xs">
                <Text size="xl" fw={700}>
                  {metric.value}
                </Text>
                <Badge color={metric.color} variant="light">
                  {metric.change}
                </Badge>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group mb="md">
          <IconFileAnalytics size={24} color="blue" />
          <Title order={4}>Recent Activity Logs</Title>
        </Group>
        <ScrollArea h={400}>
          <Timeline active={logs.length} bulletSize={24} lineWidth={2}>
            {logs.map((log, idx) => {
              const Icon = log.icon;
              return (
                <Timeline.Item
                  key={idx}
                  bullet={<Icon size={12} />}
                  title={
                    <Group gap="xs">
                      <Badge size="xs" color={log.color}>
                        {log.level.toUpperCase()}
                      </Badge>
                      <Text size="sm" c="dimmed">
                        {log.time}
                      </Text>
                    </Group>
                  }
                >
                  <Text size="sm">{log.message}</Text>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </ScrollArea>
      </Card>
    </Box>
  );
}
