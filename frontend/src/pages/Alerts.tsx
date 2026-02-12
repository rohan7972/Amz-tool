import React, { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Group,
  Button,
  Table,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Select,
  NumberInput,
  Switch,
  Stack,
  Text,
  Tabs,
  Card,
  Grid,
  Alert,
  Divider,
  Textarea,
  MultiSelect,
  Timeline,
  ThemeIcon,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBell,
  IconBellOff,
  IconMail,
  IconMessageCircle,
  IconWebhook,
  IconAlertTriangle,
  IconInfoCircle,
  IconTrendingUp,
  IconTrendingDown,
  IconTarget,
  IconClock,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

// Types
interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: 'performance' | 'budget' | 'inventory' | 'bid' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'paused';
  conditions: AlertCondition[];
  notifications: NotificationChannel[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  lastTriggered?: Date;
  triggerCount: number;
  createdAt: Date;
}

interface AlertCondition {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'between' | 'percentage_change';
  value: number | string;
  timeframe: 'last_hour' | 'last_24_hours' | 'last_7_days' | 'last_30_days';
  threshold?: number;
}

interface NotificationChannel {
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'in_app';
  target: string;
  enabled: boolean;
}

interface AlertHistory {
  id: string;
  alertRuleId: string;
  alertRuleName: string;
  severity: string;
  message: string;
  triggeredAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

// Mock data
const mockAlerts: AlertRule[] = [
  {
    id: '1',
    name: 'High ACoS Alert',
    description: 'Alert when campaign ACoS exceeds 35%',
    type: 'performance',
    severity: 'high',
    status: 'active',
    conditions: [
      { metric: 'acos', operator: 'greater_than', value: 35, timeframe: 'last_24_hours' }
    ],
    notifications: [
      { type: 'email', target: 'manager@company.com', enabled: true },
      { type: 'in_app', target: 'dashboard', enabled: true }
    ],
    frequency: 'immediate',
    lastTriggered: new Date('2024-12-05T14:30:00'),
    triggerCount: 12,
    createdAt: new Date('2024-11-15'),
  },
  {
    id: '2',
    name: 'Budget Depletion Warning',
    description: 'Alert when campaign budget is 80% depleted',
    type: 'budget',
    severity: 'medium',
    status: 'active',
    conditions: [
      { metric: 'budget_utilization', operator: 'greater_than', value: 80, timeframe: 'last_24_hours' }
    ],
    notifications: [
      { type: 'email', target: 'team@company.com', enabled: true },
      { type: 'slack', target: '#advertising-alerts', enabled: true }
    ],
    frequency: 'daily',
    lastTriggered: new Date('2024-12-04T16:45:00'),
    triggerCount: 8,
    createdAt: new Date('2024-11-20'),
  },
  {
    id: '3',
    name: 'Low Impression Share',
    description: 'Alert when impression share drops below 40%',
    type: 'performance',
    severity: 'low',
    status: 'paused',
    conditions: [
      { metric: 'impression_share', operator: 'less_than', value: 40, timeframe: 'last_7_days' }
    ],
    notifications: [
      { type: 'email', target: 'analyst@company.com', enabled: true }
    ],
    frequency: 'weekly',
    triggerCount: 3,
    createdAt: new Date('2024-11-10'),
  },
];

const mockAlertHistory: AlertHistory[] = [
  {
    id: '1',
    alertRuleId: '1',
    alertRuleName: 'High ACoS Alert',
    severity: 'high',
    message: 'Campaign "Holiday Sale 2024" ACoS reached 38.5% (threshold: 35%)',
    triggeredAt: new Date('2024-12-05T14:30:00'),
    acknowledged: true,
    acknowledgedBy: 'John Doe',
    acknowledgedAt: new Date('2024-12-05T14:45:00'),
    resolved: true,
    resolvedAt: new Date('2024-12-05T15:20:00'),
  },
  {
    id: '2',
    alertRuleId: '2',
    alertRuleName: 'Budget Depletion Warning',
    severity: 'medium',
    message: 'Campaign "Brand Defense" budget 85% depleted ($850 of $1000 spent)',
    triggeredAt: new Date('2024-12-04T16:45:00'),
    acknowledged: true,
    acknowledgedBy: 'Jane Smith',
    acknowledgedAt: new Date('2024-12-04T17:00:00'),
    resolved: false,
  },
  {
    id: '3',
    alertRuleId: '1',
    alertRuleName: 'High ACoS Alert',
    severity: 'high',
    message: 'Campaign "Product Launch Widget" ACoS reached 42.1% (threshold: 35%)',
    triggeredAt: new Date('2024-12-03T11:15:00'),
    acknowledged: false,
    resolved: false,
  },
];

const alertTypes = [
  { value: 'performance', label: 'Performance Alert', icon: IconTrendingUp, color: 'blue' },
  { value: 'budget', label: 'Budget Alert', icon: IconTarget, color: 'green' },
  { value: 'inventory', label: 'Inventory Alert', icon: IconAlertTriangle, color: 'orange' },
  { value: 'bid', label: 'Bid Alert', icon: IconTrendingDown, color: 'purple' },
  { value: 'custom', label: 'Custom Alert', icon: IconBell, color: 'gray' },
];

const severityLevels = [
  { value: 'low', label: 'Low', color: 'blue' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' },
];

const metrics = [
  { value: 'acos', label: 'ACoS (%)' },
  { value: 'roas', label: 'RoAS' },
  { value: 'cpc', label: 'CPC ($)' },
  { value: 'ctr', label: 'CTR (%)' },
  { value: 'cvr', label: 'CVR (%)' },
  { value: 'impression_share', label: 'Impression Share (%)' },
  { value: 'budget_utilization', label: 'Budget Utilization (%)' },
  { value: 'spend', label: 'Spend ($)' },
  { value: 'sales', label: 'Sales ($)' },
  { value: 'orders', label: 'Orders' },
];

const operators = [
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'equals', label: 'Equals' },
  { value: 'between', label: 'Between' },
  { value: 'percentage_change', label: 'Percentage change' },
];

const timeframes = [
  { value: 'last_hour', label: 'Last hour' },
  { value: 'last_24_hours', label: 'Last 24 hours' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertRule[]>(mockAlerts);
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>(mockAlertHistory);
  const [selectedAlert, setSelectedAlert] = useState<AlertRule | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('alerts');

  const handleCreateAlert = () => {
    setSelectedAlert(null);
    open();
  };

  const handleEditAlert = (alert: AlertRule) => {
    setSelectedAlert(alert);
    open();
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleToggleAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: alert.status === 'active' ? 'paused' : 'active' }
        : alert
    ));
  };

  const handleAcknowledgeAlert = (historyId: string) => {
    setAlertHistory(alertHistory.map(item =>
      item.id === historyId
        ? { 
            ...item, 
            acknowledged: true, 
            acknowledgedBy: 'Current User',
            acknowledgedAt: new Date()
          }
        : item
    ));
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'green' : 'gray';
  };

  const getSeverityColor = (severity: string) => {
    const level = severityLevels.find(s => s.value === severity);
    return level?.color || 'gray';
  };

  const getAlertTypeIcon = (type: string) => {
    const alertType = alertTypes.find(at => at.value === type);
    return alertType ? <alertType.icon size={16} /> : <IconBell size={16} />;
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Alert Management</Title>
          <Text c="dimmed" size="sm">
            Monitor your campaigns and get notified of important changes
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreateAlert}>
          Create Alert
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="alerts">Alert Rules</Tabs.Tab>
          <Tabs.Tab value="history">Alert History</Tabs.Tab>
          <Tabs.Tab value="settings">Notification Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="alerts" pt="md">
          {/* Alert Type Cards */}
          <Grid mb="xl">
            {alertTypes.map((alertType) => {
              const activeAlertsCount = alerts.filter(a => a.type === alertType.value && a.status === 'active').length;
              return (
                <Grid.Col key={alertType.value} span={{ base: 12, sm: 6, md: 4, lg: 2.4 }}>
                  <Card withBorder h="100%">
                    <Group justify="space-between" mb="xs">
                      <alertType.icon size={24} color={`var(--mantine-color-${alertType.color}-6)`} />
                      <Badge color={alertType.color} variant="light">
                        {activeAlertsCount}
                      </Badge>
                    </Group>
                    <Text fw={500} size="sm">
                      {alertType.label}
                    </Text>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>

          {/* Alerts Table */}
          <Paper withBorder>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Alert Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Severity</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Last Triggered</Table.Th>
                  <Table.Th>Trigger Count</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {alerts.map((alert) => (
                  <Table.Tr key={alert.id}>
                    <Table.Td>
                      <div>
                        <Group gap="xs" mb="xs">
                          {getAlertTypeIcon(alert.type)}
                          <Text size="sm" fw={500}>{alert.name}</Text>
                        </Group>
                        <Text size="xs" c="dimmed">{alert.description}</Text>
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" size="sm">
                        {alertTypes.find(at => at.value === alert.type)?.label}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getSeverityColor(alert.severity)} variant="light" size="sm">
                        {alert.severity}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(alert.status)} variant="light" size="sm">
                        {alert.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {alert.lastTriggered ? alert.lastTriggered.toLocaleString() : 'Never'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{alert.triggerCount}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color={alert.status === 'active' ? 'yellow' : 'green'}
                          onClick={() => handleToggleAlert(alert.id)}
                        >
                          {alert.status === 'active' ? <IconBellOff size={16} /> : <IconBell size={16} />}
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleEditAlert(alert)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="md">
          {/* Alert History Stats */}
          <Grid mb="xl">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Alerts
                </Text>
                <Text fw={700} size="xl">
                  {alertHistory.length}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Unacknowledged
                </Text>
                <Text fw={700} size="xl" c="red">
                  {alertHistory.filter(h => !h.acknowledged).length}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Resolved
                </Text>
                <Text fw={700} size="xl" c="green">
                  {alertHistory.filter(h => h.resolved).length}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Today
                </Text>
                <Text fw={700} size="xl">
                  {alertHistory.filter(h => 
                    h.triggeredAt.toDateString() === new Date().toDateString()
                  ).length}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Alert History Timeline */}
          <Paper withBorder p="md">
            <Title order={4} mb="md">Recent Alert Activity</Title>
            <Timeline active={alertHistory.length} bulletSize={24} lineWidth={2}>
              {alertHistory.map((item) => (
                <Timeline.Item
                  key={item.id}
                  bullet={
                    <ThemeIcon
                      size={24}
                      variant="filled"
                      color={getSeverityColor(item.severity)}
                    >
                      {item.resolved ? <IconCheck size={12} /> : 
                       item.acknowledged ? <IconClock size={12} /> : 
                       <IconAlertTriangle size={12} />}
                    </ThemeIcon>
                  }
                  title={item.alertRuleName}
                >
                  <Text c="dimmed" size="sm">
                    {item.message}
                  </Text>
                  <Text size="xs" mt={4} c="dimmed">
                    {item.triggeredAt.toLocaleString()}
                  </Text>
                  {!item.acknowledged && (
                    <Button
                      size="xs"
                      variant="light"
                      mt="xs"
                      onClick={() => handleAcknowledgeAlert(item.id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                  {item.acknowledged && (
                    <Text size="xs" c="green" mt="xs">
                      Acknowledged by {item.acknowledgedBy} at {item.acknowledgedAt?.toLocaleString()}
                    </Text>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="md">
          <Alert icon={<IconInfoCircle size={16} />} mb="md">
            Configure your notification preferences and channels for receiving alerts.
          </Alert>
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="md">
                <Title order={4} mb="md">Email Notifications</Title>
                <Stack>
                  <TextInput
                    label="Primary Email"
                    placeholder="your-email@company.com"
                    leftSection={<IconMail size={16} />}
                  />
                  <MultiSelect
                    label="Additional Recipients"
                    placeholder="Add team members"
                    data={[
                      'manager@company.com',
                      'team@company.com',
                      'analyst@company.com',
                    ]}
                  />
                  <Switch
                    label="Enable email notifications"
                    description="Receive alerts via email"
                    defaultChecked
                  />
                </Stack>
              </Paper>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="md">
                <Title order={4} mb="md">Slack Integration</Title>
                <Stack>
                  <TextInput
                    label="Slack Webhook URL"
                    placeholder="https://hooks.slack.com/services/..."
                    leftSection={<IconMessageCircle size={16} />}
                  />
                  <TextInput
                    label="Default Channel"
                    placeholder="#advertising-alerts"
                  />
                  <Switch
                    label="Enable Slack notifications"
                    description="Send alerts to Slack channels"
                  />
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>

      {/* Create/Edit Alert Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedAlert ? 'Edit Alert Rule' : 'Create Alert Rule'}
        size="lg"
      >
        <Stack>
          <TextInput
            label="Alert Name"
            placeholder="Enter a descriptive name for your alert"
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Describe what this alert monitors"
            rows={2}
          />
          
          <Group grow>
            <Select
              label="Alert Type"
              placeholder="Select alert type"
              data={alertTypes.map(at => ({ value: at.value, label: at.label }))}
              required
            />
            <Select
              label="Severity"
              placeholder="Select severity level"
              data={severityLevels.map(sl => ({ value: sl.value, label: sl.label }))}
              required
            />
          </Group>
          
          <Divider label="Conditions" labelPosition="left" />
          
          <Group grow>
            <Select
              label="Metric"
              placeholder="Select metric to monitor"
              data={metrics}
              required
            />
            <Select
              label="Operator"
              placeholder="Select operator"
              data={operators}
              required
            />
          </Group>
          
          <Group grow>
            <NumberInput
              label="Threshold Value"
              placeholder="Enter threshold"
              required
            />
            <Select
              label="Timeframe"
              placeholder="Select timeframe"
              data={timeframes}
              required
            />
          </Group>
          
          <Divider label="Notifications" labelPosition="left" />
          
          <MultiSelect
            label="Notification Channels"
            placeholder="Select notification methods"
            data={[
              { value: 'email', label: 'Email' },
              { value: 'slack', label: 'Slack' },
              { value: 'sms', label: 'SMS' },
              { value: 'webhook', label: 'Webhook' },
              { value: 'in_app', label: 'In-App' },
            ]}
          />
          
          <Select
            label="Frequency"
            placeholder="Select notification frequency"
            data={[
              { value: 'immediate', label: 'Immediate' },
              { value: 'hourly', label: 'Hourly' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
            ]}
            defaultValue="immediate"
          />
          
          <Switch
            label="Enable alert"
            description="Alert will start monitoring according to the conditions"
            defaultChecked
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={close}>
              {selectedAlert ? 'Update Alert' : 'Create Alert'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}