import { Box, Title, Text, Card, Grid, Button, Group, Code, CopyButton, ActionIcon, Tooltip } from '@mantine/core';
import { IconApi, IconCopy, IconCheck, IconPlus } from '@tabler/icons-react';

export function AdminAPI() {
  const apiKeys = [
    { name: 'Production API Key', key: 'sk_live_abc123...', created: '2024-01-15', lastUsed: '2 hours ago' },
    { name: 'Development API Key', key: 'sk_test_xyz789...', created: '2024-01-10', lastUsed: '5 days ago' },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>API Management</Title>
          <Text c="dimmed" size="sm">
            Manage API keys, endpoints, and integrations
          </Text>
        </Box>
        <Button leftSection={<IconPlus size={16} />} color="blue">
          Generate New Key
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={12}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">API Endpoints</Title>
            <Box style={{ fontFamily: 'monospace', fontSize: '14px' }}>
              <Group gap="xs" mb="xs">
                <Code color="blue">GET</Code>
                <Text>/api/products</Text>
              </Group>
              <Group gap="xs" mb="xs">
                <Code color="green">POST</Code>
                <Text>/api/products</Text>
              </Group>
              <Group gap="xs" mb="xs">
                <Code color="yellow">PUT</Code>
                <Text>/api/products/:id</Text>
              </Group>
              <Group gap="xs" mb="xs">
                <Code color="red">DELETE</Code>
                <Text>/api/products/:id</Text>
              </Group>
            </Box>
          </Card>
        </Grid.Col>

        {apiKeys.map((key, idx) => (
          <Grid.Col key={idx} span={{ base: 12, md: 6 }}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Title order={4}>{key.name}</Title>
                <CopyButton value={key.key}>
                  {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied' : 'Copy'}>
                      <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </Group>
              <Code block>{key.key}</Code>
              <Text size="xs" c="dimmed" mt="md">
                Created: {key.created} • Last used: {key.lastUsed}
              </Text>
              <Group mt="md">
                <Button variant="light" size="xs">
                  Regenerate
                </Button>
                <Button variant="light" size="xs" color="red">
                  Revoke
                </Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
