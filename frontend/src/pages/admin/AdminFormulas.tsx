import { Box, Title, Text, Card, Grid, Button, Group } from '@mantine/core';
import { IconMathFunction, IconPlus } from '@tabler/icons-react';

export function AdminFormulas() {
  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>Formula Engine</Title>
          <Text c="dimmed" size="sm">
            Manage calculation formulas and pricing rules
          </Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Create Formula
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconMathFunction size={32} color="blue" style={{ marginBottom: 16 }} />
            <Title order={4}>FBA Fee Calculator</Title>
            <Text size="sm" c="dimmed" mt="xs">
              Calculate FBA fulfillment fees based on product dimensions and weight
            </Text>
            <Button variant="light" fullWidth mt="md">
              Edit Formula
            </Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconMathFunction size={32} color="green" style={{ marginBottom: 16 }} />
            <Title order={4}>Profit Margin</Title>
            <Text size="sm" c="dimmed" mt="xs">
              Calculate net profit margins after all fees and costs
            </Text>
            <Button variant="light" fullWidth mt="md">
              Edit Formula
            </Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <IconMathFunction size={32} color="orange" style={{ marginBottom: 16 }} />
            <Title order={4}>ROI Calculator</Title>
            <Text size="sm" c="dimmed" mt="xs">
              Calculate return on investment for products and campaigns
            </Text>
            <Button variant="light" fullWidth mt="md">
              Edit Formula
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
