import React, { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Group,
  Button,
  Select,

  Grid,
  Card,
  Text,
  Badge,
  Table,
  ActionIcon,
  Modal,
  Stack,
  TextInput,
  Checkbox,
  Tabs,
  Alert,
  Progress,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconDownload,
  IconCalendar,
  IconFileText,
  IconChartBar,
  IconTable,
  IconMail,
  IconClock,
  IconInfoCircle,
  IconCheck,
  IconX,
  IconRefresh,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Types
interface Report {
  id: string;
  name: string;
  type: 'campaign_performance' | 'keyword_performance' | 'search_terms' | 'product_performance' | 'custom';
  status: 'completed' | 'processing' | 'failed' | 'scheduled';
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  size?: string;
  recordCount?: number;
  schedule?: ReportSchedule;
}

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  recipients: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  metrics: string[];
  dimensions: string[];
  filters: any[];
}

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    name: 'Campaign Performance - December 2024',
    type: 'campaign_performance',
    status: 'completed',
    createdAt: new Date('2024-12-05T10:30:00'),
    completedAt: new Date('2024-12-05T10:35:00'),
    downloadUrl: '/reports/campaign-performance-dec-2024.xlsx',
    size: '2.4 MB',
    recordCount: 1250,
  },
  {
    id: '2',
    name: 'Weekly Keyword Report',
    type: 'keyword_performance',
    status: 'processing',
    createdAt: new Date('2024-12-06T09:00:00'),
    schedule: {
      frequency: 'weekly',
      time: '09:00',
      enabled: true,
      recipients: ['manager@company.com'],
    },
  },
  {
    id: '3',
    name: 'Search Terms Analysis',
    type: 'search_terms',
    status: 'failed',
    createdAt: new Date('2024-12-05T15:20:00'),
  },
];

const reportTemplates: ReportTemplate[] = [
  {
    id: 'campaign_performance',
    name: 'Campaign Performance',
    description: 'Comprehensive campaign metrics and KPIs',
    type: 'campaign_performance',
    metrics: ['impressions', 'clicks', 'spend', 'sales', 'acos', 'roas', 'ctr', 'cvr'],
    dimensions: ['campaign_name', 'campaign_type', 'targeting_type', 'date'],
    filters: ['date_range', 'campaign_status', 'campaign_type'],
  },
  {
    id: 'keyword_performance',
    name: 'Keyword Performance',
    description: 'Detailed keyword-level performance data',
    type: 'keyword_performance',
    metrics: ['impressions', 'clicks', 'spend', 'sales', 'acos', 'cpc', 'position'],
    dimensions: ['keyword', 'match_type', 'campaign_name', 'ad_group_name'],
    filters: ['date_range', 'match_type', 'bid_range'],
  },
  {
    id: 'search_terms',
    name: 'Search Terms Report',
    description: 'Search query performance and opportunities',
    type: 'search_terms',
    metrics: ['impressions', 'clicks', 'spend', 'sales', 'acos', 'cvr'],
    dimensions: ['search_term', 'keyword', 'match_type', 'campaign_name'],
    filters: ['date_range', 'min_impressions', 'conversion_status'],
  },
  {
    id: 'product_performance',
    name: 'Product Performance',
    description: 'Product-level advertising performance',
    type: 'product_performance',
    metrics: ['impressions', 'clicks', 'spend', 'sales', 'units_sold', 'acos'],
    dimensions: ['asin', 'product_title', 'campaign_name', 'ad_group_name'],
    filters: ['date_range', 'product_category', 'sales_range'],
  },
];

// Mock chart data
const performanceData = [
  { date: '2024-12-01', impressions: 12500, clicks: 450, sales: 2800 },
  { date: '2024-12-02', impressions: 13200, clicks: 520, sales: 3200 },
  { date: '2024-12-03', impressions: 11800, clicks: 380, sales: 2400 },
  { date: '2024-12-04', impressions: 14500, clicks: 610, sales: 3800 },
  { date: '2024-12-05', impressions: 13800, clicks: 580, sales: 3600 },
];

const topCampaigns = [
  { name: 'Holiday Campaign 2024', sales: 15420, spend: 3850, acos: 24.9, roas: 4.01 },
  { name: 'Brand Defense Campaign', sales: 12300, spend: 2460, acos: 20.0, roas: 5.00 },
  { name: 'Product Launch - Widget Pro', sales: 8900, spend: 2670, acos: 30.0, roas: 3.33 },
  { name: 'Competitor Targeting', sales: 6750, spend: 2025, acos: 30.0, roas: 3.33 },
];

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('reports');

  const handleGenerateReport = () => {
    if (!selectedTemplate) return;
    
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${reportTemplates.find(t => t.id === selectedTemplate)?.name} - ${new Date().toLocaleDateString()}`,
      type: selectedTemplate as any,
      status: 'processing',
      createdAt: new Date(),
    };
    
    setReports([newReport, ...reports]);
    
    // Simulate report processing
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id 
          ? { 
              ...r, 
              status: 'completed', 
              completedAt: new Date(),
              downloadUrl: `/reports/${selectedTemplate}-${Date.now()}.xlsx`,
              size: '1.8 MB',
              recordCount: Math.floor(Math.random() * 2000) + 500,
            }
          : r
      ));
    }, 3000);
    
    close();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'failed': return 'red';
      case 'scheduled': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <IconCheck size={16} />;
      case 'processing': return <Loader size={16} />;
      case 'failed': return <IconX size={16} />;
      case 'scheduled': return <IconClock size={16} />;
      default: return null;
    }
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Reports & Analytics</Title>
          <Text c="dimmed" size="sm">
            Generate detailed reports and analyze your advertising performance
          </Text>
        </div>
        <Button leftSection={<IconFileText size={16} />} onClick={open}>
          Generate Report
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="reports">My Reports</Tabs.Tab>
          <Tabs.Tab value="analytics">Analytics Dashboard</Tabs.Tab>
          <Tabs.Tab value="scheduled">Scheduled Reports</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="reports" pt="md">
          {/* Quick Stats */}
          <Grid mb="xl">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Reports
                </Text>
                <Text fw={700} size="xl">
                  {reports.length}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Completed Today
                </Text>
                <Text fw={700} size="xl">
                  {reports.filter(r => r.status === 'completed' && 
                    r.completedAt && 
                    r.completedAt.toDateString() === new Date().toDateString()).length}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Processing
                </Text>
                <Text fw={700} size="xl">
                  {reports.filter(r => r.status === 'processing').length}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Scheduled
                </Text>
                <Text fw={700} size="xl">
                  {reports.filter(r => r.schedule?.enabled).length}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          {/* Reports Table */}
          <Paper withBorder>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Report Name</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Records</Table.Th>
                  <Table.Th>Size</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {reports.map((report) => (
                  <Table.Tr key={report.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{report.name}</Text>
                      {report.schedule && (
                        <Text size="xs" c="dimmed">
                          Scheduled {report.schedule.frequency} at {report.schedule.time}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" size="sm">
                        {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {getStatusIcon(report.status)}
                        <Badge color={getStatusColor(report.status)} variant="light" size="sm">
                          {report.status}
                        </Badge>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{report.createdAt.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{report.recordCount?.toLocaleString() || '-'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{report.size || '-'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {report.status === 'completed' && (
                          <ActionIcon variant="subtle" color="blue">
                            <IconDownload size={16} />
                          </ActionIcon>
                        )}
                        {report.status === 'processing' && (
                          <ActionIcon variant="subtle" color="orange">
                            <IconRefresh size={16} />
                          </ActionIcon>
                        )}
                        {report.schedule && (
                          <ActionIcon variant="subtle" color="green">
                            <IconMail size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="analytics" pt="md">
          {/* Performance Charts */}
          <Grid mb="xl">
            <Grid.Col span={12}>
              <Paper withBorder p="md">
                <Title order={4} mb="md">Performance Trends (Last 7 Days)</Title>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="impressions" stroke="#228be6" name="Impressions" />
                    <Line type="monotone" dataKey="clicks" stroke="#40c057" name="Clicks" />
                    <Line type="monotone" dataKey="sales" stroke="#fd7e14" name="Sales ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid.Col>
          </Grid>

          {/* Top Campaigns */}
          <Paper withBorder p="md">
            <Title order={4} mb="md">Top Performing Campaigns</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Campaign Name</Table.Th>
                  <Table.Th>Sales</Table.Th>
                  <Table.Th>Spend</Table.Th>
                  <Table.Th>ACoS</Table.Th>
                  <Table.Th>RoAS</Table.Th>
                  <Table.Th>Performance</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {topCampaigns.map((campaign, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{campaign.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">${campaign.sales.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">${campaign.spend.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={campaign.acos <= 25 ? 'green' : campaign.acos <= 35 ? 'yellow' : 'red'} variant="light">
                        {campaign.acos}%
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{campaign.roas.toFixed(2)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Progress 
                        value={Math.min((campaign.roas / 5) * 100, 100)} 
                        color={campaign.roas >= 4 ? 'green' : campaign.roas >= 3 ? 'yellow' : 'red'}
                        size="sm"
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="scheduled" pt="md">
          <Alert icon={<IconInfoCircle size={16} />} mb="md">
            Set up automated reports to be generated and delivered on a regular schedule.
          </Alert>
          
          <Paper withBorder p="md">
            <Text ta="center" c="dimmed" py="xl">
              No scheduled reports configured. Create a report and enable scheduling to get started.
            </Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Generate Report Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Generate New Report"
        size="lg"
      >
        <Stack>
          <Select
            label="Report Template"
            placeholder="Select a report template"
            data={reportTemplates.map(template => ({
              value: template.id,
              label: template.name,
            }))}
            value={selectedTemplate}
            onChange={(value) => setSelectedTemplate(value || '')}
            required
          />
          
          {selectedTemplate && (
            <Alert icon={<IconInfoCircle size={16} />} variant="light">
              {reportTemplates.find(t => t.id === selectedTemplate)?.description}
            </Alert>
          )}
          
          <TextInput
            label="Date Range"
            placeholder="Select date range"
            value={dateRange[0] && dateRange[1] ? `${dateRange[0].toISOString().split('T')[0]} - ${dateRange[1].toISOString().split('T')[0]}` : ''}
            onChange={(event) => {
              // For now, just keep the current date range
              // In a real implementation, you'd parse the input
            }}
            required
          />
          
          <Group grow>
            <Select
              label="Format"
              placeholder="Select format"
              data={[
                { value: 'xlsx', label: 'Excel (.xlsx)' },
                { value: 'csv', label: 'CSV (.csv)' },
                { value: 'pdf', label: 'PDF (.pdf)' },
              ]}
              defaultValue="xlsx"
            />
            <Select
              label="Delivery"
              placeholder="Select delivery method"
              data={[
                { value: 'download', label: 'Download Only' },
                { value: 'email', label: 'Email + Download' },
                { value: 'schedule', label: 'Schedule Recurring' },
              ]}
              defaultValue="download"
            />
          </Group>
          
          <Checkbox
            label="Include charts and visualizations"
            defaultChecked
          />
          
          <Checkbox
            label="Apply current dashboard filters"
          />
          
          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateReport}
              disabled={!selectedTemplate || !dateRange[0] || !dateRange[1]}
            >
              Generate Report
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}