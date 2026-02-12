import { Box, Title, Text, Card, Grid, Button, Group, Badge } from '@mantine/core';
import { IconRuler, IconPlus } from '@tabler/icons-react';

export function AdminRules() {
  const rules = [
    { name: 'Auto Price Adjustment', status: 'active', triggers: 5 },
    { name: 'Low Stock Alert', status: 'active', triggers: 12 },
    { name: 'Competitor Price Monitor', status: 'paused', triggers: 0 },
    { name: 'Campaign Budget Limit', status: 'active', triggers: 3 },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>Rules Engine</Title>
          <Text c="dimmed" size="sm">
            Configure automated business rules and triggers
          </Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Create Rule
        </Button>
      </Group>

      <Grid>
        {rules.map((rule, idx) => (
          <Grid.Col key={idx} span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Title order={4}>{rule.name}</Title>
                <Badge color={rule.status === 'active' ? 'green' : 'gray'}>
                  {rule.status}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Triggered {rule.triggers} times in the last 24 hours
              </Text>
              <Group mt="md">
                <Button variant="light" size="xs">
                  Edit
                </Button>
                <Button variant="light" size="xs" color="gray">
                  {rule.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
                <Button variant="light" size="xs" color="red">
                  Delete
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
