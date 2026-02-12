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
  Textarea,
  Alert,
  Divider,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconPlayerPlay,
  IconPlayerPause,
  IconInfoCircle,
  IconTarget,
  IconTrendingUp,
  IconTrendingDown,
  IconClock,
  IconBolt,
  IconShield,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

// Types for automation rules
interface AutomationRule {
  id: string;
  name: string;
  type: 'bid_optimization' | 'budget_management' | 'keyword_harvesting' | 'negative_keyword' | 'dayparting' | 'performance_alerts';
  entityType: 'campaign' | 'ad_group' | 'keyword' | 'product_ad';
  status: 'active' | 'paused' | 'draft';
  conditions: Condition[];
  actions: Action[];
  schedule: Schedule;
  lastRun?: Date;
  nextRun?: Date;
  runsCount: number;
  createdAt: Date;
}

interface Condition {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'between';
  value: number | string;
  timeframe: 'last_7_days' | 'last_14_days' | 'last_30_days' | 'yesterday' | 'today';
}

interface Action {
  type: 'adjust_bid' | 'adjust_budget' | 'pause_entity' | 'add_negative_keyword' | 'send_alert';
  value?: number | string;
  adjustment?: 'increase' | 'decrease' | 'set_to';
  percentage?: number;
}

interface Schedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'hourly';
  time?: string;
  timezone: string;
  enabled: boolean;
}

// Mock data
const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'High ACoS Bid Reduction',
    type: 'bid_optimization',
    entityType: 'keyword',
    status: 'active',
    conditions: [
      { metric: 'acos', operator: 'greater_than', value: 30, timeframe: 'last_7_days' }
    ],
    actions: [
      { type: 'adjust_bid', adjustment: 'decrease', percentage: 15 }
    ],
    schedule: { frequency: 'daily', time: '09:00', timezone: 'UTC', enabled: true },
    lastRun: new Date('2024-12-05'),
    nextRun: new Date('2024-12-06'),
    runsCount: 45,
    createdAt: new Date('2024-11-01'),
  },
  {
    id: '2',
    name: 'Low Impression Share Budget Increase',
    type: 'budget_management',
    entityType: 'campaign',
    status: 'active',
    conditions: [
      { metric: 'impression_share', operator: 'less_than', value: 50, timeframe: 'last_14_days' }
    ],
    actions: [
      { type: 'adjust_budget', adjustment: 'increase', percentage: 20 }
    ],
    schedule: { frequency: 'weekly', timezone: 'UTC', enabled: true },
    lastRun: new Date('2024-12-03'),
    nextRun: new Date('2024-12-10'),
    runsCount: 12,
    createdAt: new Date('2024-10-15'),
  },
];

const ruleTypes = [
  { value: 'bid_optimization', label: 'Bid Optimization', icon: IconTrendingUp, color: 'blue' },
  { value: 'budget_management', label: 'Budget Management', icon: IconTarget, color: 'green' },
  { value: 'keyword_harvesting', label: 'Keyword Harvesting', icon: IconBolt, color: 'orange' },
  { value: 'negative_keyword', label: 'Negative Keywords', icon: IconShield, color: 'red' },
  { value: 'dayparting', label: 'Day Parting', icon: IconClock, color: 'purple' },
  { value: 'performance_alerts', label: 'Performance Alerts', icon: IconInfoCircle, color: 'yellow' },
];

const entityTypes = [
  { value: 'campaign', label: 'Campaign' },
  { value: 'ad_group', label: 'Ad Group' },
  { value: 'keyword', label: 'Keyword' },
  { value: 'product_ad', label: 'Product Ad' },
];

const metrics = [
  { value: 'acos', label: 'ACoS (%)' },
  { value: 'roas', label: 'RoAS' },
  { value: 'cpc', label: 'CPC ($)' },
  { value: 'ctr', label: 'CTR (%)' },
  { value: 'cvr', label: 'CVR (%)' },
  { value: 'impression_share', label: 'Impression Share (%)' },
  { value: 'spend', label: 'Spend ($)' },
  { value: 'sales', label: 'Sales ($)' },
  { value: 'orders', label: 'Orders' },
  { value: 'impressions', label: 'Impressions' },
  { value: 'clicks', label: 'Clicks' },
];

const operators = [
  { value: 'greater_than', label: 'Greater than' },
  { value: 'less_than', label: 'Less than' },
  { value: 'equals', label: 'Equals' },
  { value: 'between', label: 'Between' },
];

const timeframes = [
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'today', label: 'Today' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_14_days', label: 'Last 14 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
];

export default function AutomationRules() {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  const handleCreateRule = () => {
    setSelectedRule(null);
    open();
  };

  const handleEditRule = (rule: AutomationRule) => {
    setSelectedRule(rule);
    open();
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'paused': return 'yellow';
      case 'draft': return 'gray';
      default: return 'gray';
    }
  };

  const getRuleTypeIcon = (type: string) => {
    const ruleType = ruleTypes.find(rt => rt.value === type);
    return ruleType ? <ruleType.icon size={16} /> : <IconBolt size={16} />;
  };

  const getRuleTypeColor = (type: string) => {
    const ruleType = ruleTypes.find(rt => rt.value === type);
    return ruleType?.color || 'gray';
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Automation Rules</Title>
          <Text c="dimmed" size="sm">
            Automate your Amazon advertising campaigns with intelligent rules
          </Text>
        </div>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreateRule}>
          Create Rule
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="templates">Rule Templates</Tabs.Tab>
          <Tabs.Tab value="history">Execution History</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          {/* Rule Type Cards */}
          <Grid mb="xl">
            {ruleTypes.map((ruleType) => {
              const activeRulesCount = rules.filter(r => r.type === ruleType.value && r.status === 'active').length;
              return (
                <Grid.Col key={ruleType.value} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card withBorder h="100%">
                    <Group justify="space-between" mb="xs">
                      <ruleType.icon size={24} color={`var(--mantine-color-${ruleType.color}-6)`} />
                      <Badge color={ruleType.color} variant="light">
                        {activeRulesCount} active
                      </Badge>
                    </Group>
                    <Text fw={500} size="sm" mb="xs">
                      {ruleType.label}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {ruleType.value === 'bid_optimization' && 'Automatically adjust bids based on performance metrics'}
                      {ruleType.value === 'budget_management' && 'Optimize campaign budgets for maximum efficiency'}
                      {ruleType.value === 'keyword_harvesting' && 'Discover and add high-performing search terms'}
                      {ruleType.value === 'negative_keyword' && 'Add negative keywords to improve targeting'}
                      {ruleType.value === 'dayparting' && 'Schedule ads for optimal time periods'}
                      {ruleType.value === 'performance_alerts' && 'Get notified of performance changes'}
                    </Text>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>

          {/* Rules Table */}
          <Paper withBorder>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Rule Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Entity</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Last Run</Table.Th>
                  <Table.Th>Next Run</Table.Th>
                  <Table.Th>Runs</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rules.map((rule) => (
                  <Table.Tr key={rule.id}>
                    <Table.Td>
                      <Group gap="xs">
                        {getRuleTypeIcon(rule.type)}
                        <Text size="sm" fw={500}>{rule.name}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getRuleTypeColor(rule.type)} variant="light" size="sm">
                        {ruleTypes.find(rt => rt.value === rule.type)?.label}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" tt="capitalize">{rule.entityType.replace('_', ' ')}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={getStatusColor(rule.status)} variant="light" size="sm">
                        {rule.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {rule.lastRun ? rule.lastRun.toLocaleDateString() : 'Never'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {rule.nextRun ? rule.nextRun.toLocaleDateString() : 'Not scheduled'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{rule.runsCount}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <ActionIcon
                          variant="subtle"
                          color={rule.status === 'active' ? 'yellow' : 'green'}
                          onClick={() => handleToggleRule(rule.id)}
                        >
                          {rule.status === 'active' ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => handleEditRule(rule)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() => handleDeleteRule(rule.id)}
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

        <Tabs.Panel value="templates" pt="md">
          <Alert icon={<IconInfoCircle size={16} />} mb="md">
            Pre-built rule templates to get you started quickly with common automation scenarios.
          </Alert>
          
          <Grid>
            {ruleTypes.map((template) => (
              <Grid.Col key={template.value} span={{ base: 12, md: 6 }}>
                <Card withBorder>
                  <Group justify="space-between" mb="md">
                    <Group>
                      <template.icon size={20} color={`var(--mantine-color-${template.color}-6)`} />
                      <Text fw={500}>{template.label}</Text>
                    </Group>
                    <Button size="xs" variant="light" color={template.color}>
                      Use Template
                    </Button>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {template.value === 'bid_optimization' && 'Reduce bids for high ACoS keywords and increase bids for profitable ones'}
                    {template.value === 'budget_management' && 'Automatically adjust campaign budgets based on performance and impression share'}
                    {template.value === 'keyword_harvesting' && 'Convert high-performing search terms into targeted keywords'}
                    {template.value === 'negative_keyword' && 'Add irrelevant search terms as negative keywords to improve targeting'}
                    {template.value === 'dayparting' && 'Pause ads during low-converting hours and boost during peak times'}
                    {template.value === 'performance_alerts' && 'Get notified when campaigns exceed spend limits or performance thresholds'}
                  </Text>
                  <Divider mb="sm" />
                  <Text size="xs" c="dimmed">
                    Recommended for: {template.value === 'bid_optimization' ? 'All campaign types' : 
                                     template.value === 'budget_management' ? 'High-volume campaigns' :
                                     template.value === 'keyword_harvesting' ? 'Auto campaigns' :
                                     template.value === 'negative_keyword' ? 'Broad match keywords' :
                                     template.value === 'dayparting' ? 'Time-sensitive products' :
                                     'All campaigns'}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="history" pt="md">
          <Alert icon={<IconInfoCircle size={16} />} mb="md">
            View the execution history and performance of your automation rules.
          </Alert>
          
          <Paper withBorder p="md">
            <Text ta="center" c="dimmed" py="xl">
              Execution history will be displayed here once rules start running.
            </Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Create/Edit Rule Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={selectedRule ? 'Edit Automation Rule' : 'Create Automation Rule'}
        size="lg"
      >
        <Stack>
          <TextInput
            label="Rule Name"
            placeholder="Enter a descriptive name for your rule"
            required
          />
          
          <Select
            label="Rule Type"
            placeholder="Select automation type"
            data={ruleTypes.map(rt => ({ value: rt.value, label: rt.label }))}
            required
          />
          
          <Select
            label="Entity Type"
            placeholder="Select what to automate"
            data={entityTypes}
            required
          />
          
          <Divider label="Conditions" labelPosition="left" />
          
          <Group grow>
            <Select
              label="Metric"
              placeholder="Select metric"
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
              label="Value"
              placeholder="Enter threshold value"
              required
            />
            <Select
              label="Timeframe"
              placeholder="Select timeframe"
              data={timeframes}
              required
            />
          </Group>
          
          <Divider label="Actions" labelPosition="left" />
          
          <Select
            label="Action Type"
            placeholder="Select action"
            data={[
              { value: 'adjust_bid', label: 'Adjust Bid' },
              { value: 'adjust_budget', label: 'Adjust Budget' },
              { value: 'pause_entity', label: 'Pause Entity' },
              { value: 'add_negative_keyword', label: 'Add Negative Keyword' },
              { value: 'send_alert', label: 'Send Alert' },
            ]}
            required
          />
          
          <Group grow>
            <Select
              label="Adjustment"
              placeholder="Select adjustment type"
              data={[
                { value: 'increase', label: 'Increase' },
                { value: 'decrease', label: 'Decrease' },
                { value: 'set_to', label: 'Set to' },
              ]}
            />
            <NumberInput
              label="Percentage (%)"
              placeholder="Enter percentage"
              min={1}
              max={100}
            />
          </Group>
          
          <Divider label="Schedule" labelPosition="left" />
          
          <Group grow>
            <Select
              label="Frequency"
              placeholder="Select frequency"
              data={[
                { value: 'hourly', label: 'Hourly' },
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              required
            />
            <TextInput
              label="Time"
              placeholder="HH:MM"
              type="time"
            />
          </Group>
          
          <Switch
            label="Enable rule"
            description="Rule will start running according to the schedule"
            defaultChecked
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={close}>
              {selectedRule ? 'Update Rule' : 'Create Rule'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}