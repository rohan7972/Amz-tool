import { Box, Title, Text, Card, Grid, Button, Group, Table, Badge } from '@mantine/core';
import { IconCoin, IconDownload } from '@tabler/icons-react';

export function AdminBilling() {
  const subscriptions = [
    { user: 'john@example.com', plan: 'Pro', amount: '$49/mo', status: 'active', nextBilling: '2024-02-15' },
    { user: 'jane@example.com', plan: 'Enterprise', amount: '$199/mo', status: 'active', nextBilling: '2024-02-10' },
    { user: 'bob@example.com', plan: 'Basic', amount: '$19/mo', status: 'past_due', nextBilling: '2024-01-30' },
  ];

  const revenue = [
    { label: 'Monthly Revenue', value: '$12,450', change: '+18%', color: 'green' },
    { label: 'Active Subscriptions', value: '156', change: '+12', color: 'blue' },
    { label: 'Churn Rate', value: '2.3%', change: '-0.5%', color: 'green' },
    { label: 'Avg Revenue Per User', value: '$79.81', change: '+$4.20', color: 'cyan' },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>Revenue & Billing</Title>
          <Text c="dimmed" size="sm">
            Subscription management and revenue analytics
          </Text>
        </Box>
        <Button leftSection={<IconDownload size={16} />} color="blue">
          Export Report
        </Button>
      </Group>

      <Grid mb="xl">
        {revenue.map((item, idx) => (
          <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 3 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group gap="xs" mb="xs">
                <IconCoin size={20} color={item.color} />
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {item.label}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="xl" fw={700}>
                  {item.value}
                </Text>
                <Badge color={item.color} variant="light">
                  {item.change}
                </Badge>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">Recent Subscriptions</Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Plan</Table.Th>
              <Table.Th>Amount</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Next Billing</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {subscriptions.map((sub, idx) => (
              <Table.Tr key={idx}>
                <Table.Td>{sub.user}</Table.Td>
                <Table.Td>
                  <Badge variant="light">{sub.plan}</Badge>
                </Table.Td>
                <Table.Td>{sub.amount}</Table.Td>
                <Table.Td>
                  <Badge color={sub.status === 'active' ? 'green' : 'red'}>
                    {sub.status}
                  </Badge>
                </Table.Td>
                <Table.Td>{sub.nextBilling}</Table.Td>
                <Table.Td>
                  <Button variant="subtle" size="xs">
                    Manage
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Box>
  );
}
