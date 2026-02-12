import { Box, Title, Text, Card, Grid, Button, Group, Progress, Badge } from '@mantine/core';
import { IconBrain, IconPlus } from '@tabler/icons-react';

export function AdminAIML() {
  const models = [
    { name: 'Price Prediction Model', accuracy: 94, status: 'active', lastTrained: '2 days ago' },
    { name: 'Demand Forecasting', accuracy: 89, status: 'active', lastTrained: '5 days ago' },
    { name: 'Customer Sentiment Analysis', accuracy: 87, status: 'training', lastTrained: 'In progress' },
    { name: 'Product Recommendation', accuracy: 92, status: 'inactive', lastTrained: '1 week ago' },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>AI/ML Features</Title>
          <Text c="dimmed" size="sm">
            Machine learning models and AI-powered insights
          </Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Train New Model
        </Button>
      </Group>

      <Grid>
        {models.map((model, idx) => (
          <Grid.Col key={idx} span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group>
                  <IconBrain size={24} color="purple" />
                  <Title order={4}>{model.name}</Title>
                </Group>
                <Badge
                  color={
                    model.status === 'active'
                      ? 'green'
                      : model.status === 'training'
                      ? 'blue'
                      : 'gray'
                  }
                >
                  {model.status}
                </Badge>
              </Group>
              <Box mb="md">
                <Group justify="space-between" mb="xs">
                  <Text size="sm" c="dimmed">
                    Model Accuracy
                  </Text>
                  <Text size="sm" fw={700}>
                    {model.accuracy}%
                  </Text>
                </Group>
                <Progress
                  value={model.accuracy}
                  size="sm"
                  color={model.accuracy > 90 ? 'green' : model.accuracy > 85 ? 'yellow' : 'red'}
                />
              </Box>
              <Text size="xs" c="dimmed" mb="md">
                Last trained: {model.lastTrained}
              </Text>
              <Group>
                <Button variant="light" size="xs">
                  View Details
                </Button>
                <Button variant="light" size="xs" color="blue">
                  Retrain
                </Button>
                <Button variant="light" size="xs" color={model.status === 'active' ? 'red' : 'green'}>
                  {model.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
