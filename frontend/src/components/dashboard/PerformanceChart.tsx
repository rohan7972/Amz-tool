// ... imports
import { ActionIcon, Card, Checkbox, Divider, Group, Paper, Popover, ScrollArea, Stack, Text, useMantineTheme } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ChartDataPoint {
  date: string;
  sales: number;
  adSales: number;
  adSpend: number;
  totalOrders: number;
  adOrders: number;
  unitsSold: number;
  clicks: number;
  impressions: number;
  cpc: number;
  ctr: number;
  cvr: number;
  acos: number;
  roas: number;
  tacos: number;
  cpa: number;
  aov: number;
  [key: string]: any; // Allow indexing
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
  loading?: boolean;
}

type MetricCategory = 'Performance Metrics' | 'Derived Metrics' | 'Other Metrics';

interface MetricConfigItem {
  key: string;
  label: string;
  category: MetricCategory;
  color: string;
  formatter: 'currency' | 'percent' | 'number';
}

const METRIC_CONFIG: MetricConfigItem[] = [
  // Performance Metrics
  { key: 'adSales', label: 'Ad Sales', category: 'Performance Metrics', color: '#4ADE80', formatter: 'currency' }, // Green
  { key: 'adSpend', label: 'Ad Spend', category: 'Performance Metrics', color: '#FB923C', formatter: 'currency' }, // Orange
  { key: 'clicks', label: 'Clicks', category: 'Performance Metrics', color: '#FACC15', formatter: 'number' }, // Yellow
  { key: 'impressions', label: 'Impressions', category: 'Performance Metrics', color: '#22D3EE', formatter: 'number' }, // Cyan
  { key: 'adOrders', label: 'Ad Orders', category: 'Performance Metrics', color: '#A3E635', formatter: 'number' }, // Lime

  // Derived Metrics
  { key: 'cpc', label: 'CPC', category: 'Derived Metrics', color: '#D9F99D', formatter: 'currency' }, // Light Lime
  { key: 'ctr', label: 'CTR', category: 'Derived Metrics', color: '#67E8F9', formatter: 'percent' }, // Light Cyan
  { key: 'cvr', label: 'CVR', category: 'Derived Metrics', color: '#38BDF8', formatter: 'percent' }, // Sky Blue
  { key: 'acos', label: 'ACoS', category: 'Derived Metrics', color: '#34D399', formatter: 'percent' }, // Emerald
  { key: 'roas', label: 'RoAS', category: 'Derived Metrics', color: '#8884d8', formatter: 'number' }, // Purple

  // Other Metrics
  { key: 'sales', label: 'Total Sales', category: 'Other Metrics', color: '#7C3AED', formatter: 'currency' }, // Violet
  { key: 'totalOrders', label: 'Total Orders', category: 'Other Metrics', color: '#F97316', formatter: 'number' }, // Orange Red
  { key: 'unitsSold', label: 'Units Sold', category: 'Other Metrics', color: '#84CC16', formatter: 'number' }, // Lime Green
  { key: 'tacos', label: 'TACoS', category: 'Other Metrics', color: '#10B981', formatter: 'percent' }, // Emerald
  { key: 'cpa', label: 'CPA', category: 'Other Metrics', color: '#EA580C', formatter: 'currency' }, // Burnt Orange
  { key: 'aov', label: 'AOV', category: 'Other Metrics', color: '#8B5CF6', formatter: 'currency' }, // Violet
];

export function PerformanceChart({ data, loading = false }: PerformanceChartProps) {
  const theme = useMantineTheme();
  // Default to Total Sales & Ad Sales as before
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['sales', 'adSales']);

  const formatValue = (value: number, type: 'currency' | 'percent' | 'number') => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      case 'percent':
        return `${value.toFixed(2)}%`;
      case 'number':
        return new Intl.NumberFormat('en-IN').format(value);
      default:
        return `${value}`;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const handleMetricToggle = (key: string) => {
    setSelectedMetrics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper shadow="md" p="md" radius="md" style={{ backgroundColor: 'white', border: '1px solid #f0f0f0' }}>
          <Text size="sm" fw={700} mb={5}>{label}</Text>
          {payload.map((entry: any, index: number) => {
            const config = METRIC_CONFIG.find(m => m.key === entry.dataKey);
            return (
              <Group key={index} justify="space-between" gap="xl" mb={4}>
                <Text size="sm" c={entry.color} fw={600}>
                  {entry.name}:
                </Text>
                <Text size="sm" fw={700} c={entry.color}>
                  {config ? formatValue(entry.value, config.formatter) : entry.value}
                </Text>
              </Group>
            );
          })}
        </Paper>
      );
    }
    return null;
  };

  const renderMetricSelection = () => {
    const categories: MetricCategory[] = ['Performance Metrics', 'Derived Metrics', 'Other Metrics'];

    return (
      <Popover width={300} position="bottom-end" withArrow shadow="md">
        <Popover.Target>
          <ActionIcon variant="transparent" color="gray">
            <IconSettings size={20} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown p={0}>
          <ScrollArea.Autosize mah={400} type="scroll">
            <Stack gap="xs" p="md">
              {categories.map((category) => (
                <div key={category}>
                  <Text size="xs" fw={700} c="dimmed" mb={4} tt="uppercase">
                    {category}
                  </Text>
                  <Stack gap={6}>
                    {METRIC_CONFIG.filter(m => m.category === category).map((metric) => (
                      <Checkbox
                        key={metric.key}
                        label={metric.label}
                        checked={selectedMetrics.includes(metric.key)}
                        onChange={() => handleMetricToggle(metric.key)}
                        color={metric.color}
                        size="sm"
                        styles={{
                          input: { borderColor: selectedMetrics.includes(metric.key) ? metric.color : undefined, backgroundColor: selectedMetrics.includes(metric.key) ? metric.color : undefined },
                          icon: { color: 'white' } // Ensure checkmark is white
                        }}
                      />
                    ))}
                  </Stack>
                  <Divider my="xs" />
                </div>
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Popover.Dropdown>
      </Popover>
    );
  };

  if (loading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text c="dimmed">Loading chart data...</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="lg">
        <Text size="xl" fw={600}>
          Performance Trend
        </Text>
        {renderMetricSelection()}
      </Group>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {selectedMetrics.map(key => {
              const metric = METRIC_CONFIG.find(m => m.key === key);
              if (!metric) return null;
              return (
                <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                </linearGradient>
              )
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => {
              const d = new Date(str);
              return d.toISOString().split('T')[0];
            }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value)}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />
          {selectedMetrics.map(key => {
            const metric = METRIC_CONFIG.find(m => m.key === key);
            if (!metric) return null;
            return (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={metric.color}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-${key})`}
                name={metric.label}
              />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}