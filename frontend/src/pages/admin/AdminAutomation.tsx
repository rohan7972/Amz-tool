import { Box, Title, Text, Card, Grid, Button, Group, Badge, Progress } from '@mantine/core';
import { IconRobot, IconPlus } from '@tabler/icons-react';

export function AdminAutomation() {
  const automations = [
    { name: 'Daily Sales Report', status: 'running', progress: 75, schedule: 'Every day at 9:00 AM' },
    { name: 'Inventory Sync', status: 'idle', progress: 0, schedule: 'Every 2 hours' },
    { name: 'Price Update', status: 'running', progress: 30, schedule: 'Every 6 hours' },
    { name: 'Customer Email Campaign', status: 'scheduled', progress: 0, schedule: 'Tomorrow at 10:00 AM' },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>Automation Hub</Title>
          <Text c="dimmed" size="sm">
            Manage automated tasks and workflows
          </Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Create Automation
        </Button>
      </Group>

      <Grid>
        {automations.map((auto, idx) => (
          <Grid.Col key={idx} span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group>
                  <IconRobot size={24} color="blue" />
                  <Title order={4}>{auto.name}</Title>
                </Group>
                <Badge
                  color={
                    auto.status === 'running'
                      ? 'blue'
                      : auto.status === 'scheduled'
                      ? 'cyan'
                      : 'gray'
                  }
                >
                  {auto.status}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                {auto.schedule}
              </Text>
              {auto.status === 'running' && (
                <Progress value={auto.progress} size="sm" mb="md" color="blue" animated />
              )}
              <Group>
                <Button variant="light" size="xs">
                  Edit
                </Button>
                <Button variant="light" size="xs" color={auto.status === 'running' ? 'red' : 'green'}>
                  {auto.status === 'running' ? 'Stop' : 'Run Now'}
                </Button>
                <Button variant="light" size="xs" color="gray">
                  View Logs
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
