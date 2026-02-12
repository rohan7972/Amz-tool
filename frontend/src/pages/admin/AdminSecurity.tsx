import { Box, Title, Text, Card, Grid, Button, Group, Badge, Switch, Stack } from '@mantine/core';
import { IconLock, IconShield, IconAlertTriangle } from '@tabler/icons-react';
import { useState } from 'react';

export function AdminSecurity() {
  const [twoFactor, setTwoFactor] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(true);
  const [passwordPolicy, setPasswordPolicy] = useState(true);

  const securityAlerts = [
    { type: 'warning', message: '3 failed login attempts from IP 192.168.1.100', time: '10 mins ago' },
    { type: 'info', message: 'Security scan completed - No issues found', time: '2 hours ago' },
    { type: 'success', message: 'SSL certificate renewed successfully', time: '1 day ago' },
  ];

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>Security Center</Title>
          <Text c="dimmed" size="sm">
            Security settings, alerts, and access control
          </Text>
        </Box>
        <Button leftSection={<IconShield size={16} />} color="blue">
          Run Security Scan
        </Button>
      </Group>

      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconLock size={24} color="blue" />
              <Title order={4}>Security Settings</Title>
            </Group>
            <Stack gap="md">
              <Group justify="space-between">
                <Box>
                  <Text size="sm" fw={500}>Two-Factor Authentication</Text>
                  <Text size="xs" c="dimmed">Require 2FA for all admin users</Text>
                </Box>
                <Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.currentTarget.checked)} />
              </Group>
              <Group justify="space-between">
                <Box>
                  <Text size="sm" fw={500}>IP Whitelist</Text>
                  <Text size="xs" c="dimmed">Restrict access to specific IPs</Text>
                </Box>
                <Switch checked={ipWhitelist} onChange={(e) => setIpWhitelist(e.currentTarget.checked)} />
              </Group>
              <Group justify="space-between">
                <Box>
                  <Text size="sm" fw={500}>Session Timeout</Text>
                  <Text size="xs" c="dimmed">Auto logout after 30 minutes</Text>
                </Box>
                <Switch checked={sessionTimeout} onChange={(e) => setSessionTimeout(e.currentTarget.checked)} />
              </Group>
              <Group justify="space-between">
                <Box>
                  <Text size="sm" fw={500}>Strong Password Policy</Text>
                  <Text size="xs" c="dimmed">Enforce complex passwords</Text>
                </Box>
                <Switch checked={passwordPolicy} onChange={(e) => setPasswordPolicy(e.currentTarget.checked)} />
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconAlertTriangle size={24} color="orange" />
              <Title order={4}>Security Alerts</Title>
            </Group>
            <Stack gap="md">
              {securityAlerts.map((alert, idx) => (
                <Box key={idx}>
                  <Group justify="space-between" mb="xs">
                    <Badge
                      color={
                        alert.type === 'warning'
                          ? 'orange'
                          : alert.type === 'success'
                          ? 'green'
                          : 'blue'
                      }
                      variant="light"
                    >
                      {alert.type.toUpperCase()}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {alert.time}
                    </Text>
                  </Group>
                  <Text size="sm">{alert.message}</Text>
                </Box>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{ textAlign: 'center' }}>
            <IconShield size={48} color="green" style={{ margin: '0 auto 16px' }} />
            <Title order={3}>A+</Title>
            <Text size="sm" c="dimmed">Security Score</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{ textAlign: 'center' }}>
            <IconLock size={48} color="blue" style={{ margin: '0 auto 16px' }} />
            <Title order={3}>24</Title>
            <Text size="sm" c="dimmed">Active Sessions</Text>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{ textAlign: 'center' }}>
            <IconAlertTriangle size={48} color="orange" style={{ margin: '0 auto 16px' }} />
            <Title order={3}>3</Title>
            <Text size="sm" c="dimmed">Security Warnings</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
