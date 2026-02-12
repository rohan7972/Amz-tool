import { Button, Container, Grid, Group, Menu, Select, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconAd, IconCalendar, IconChartLine, IconClick, IconCoin, IconCurrencyDollar, IconDownload, IconEye, IconPackage, IconPercentage, IconRefresh, IconShoppingCart, IconTarget, IconTrendingUp, IconUserCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { fadeInUp, staggerContainer, staggerItem } from '../animations';
import { KPICard } from '../components/dashboard/KPICard';
import { OrderDistributionChart } from '../components/dashboard/OrderDistributionChart';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { ProductTable } from '../components/dashboard/ProductTable';
import { AnimatedPage } from '../components/ui/AnimatedPage';

// Mock data - replace with actual API calls
const mockKPIData = {
  totalSales: { value: 125430, change: 12.5, changeType: 'increase' as const },
  orders: { value: 1247, change: 8.3, changeType: 'increase' as const },
  units: { value: 2156, change: -2.1, changeType: 'decrease' as const },
  aov: { value: 100.58, change: 4.7, changeType: 'increase' as const },
  adSpend: { value: 18750, change: 15.2, changeType: 'increase' as const },
  acos: { value: 14.95, change: -1.8, changeType: 'decrease' as const },
  roas: { value: 6.69, change: 9.4, changeType: 'increase' as const },
  adSales: { value: 89045, change: 18.5, changeType: 'increase' as const }, // New
  adOrders: { value: 684, change: 14.2, changeType: 'increase' as const }, // New
  tacos: { value: 8.5, change: -0.5, changeType: 'decrease' as const },
  impressions: { value: 2456789, change: 22.1, changeType: 'increase' as const },
  clicks: { value: 35678, change: 18.4, changeType: 'increase' as const },
  ctr: { value: 1.45, change: 1.2, changeType: 'increase' as const },
  cvr: { value: 3.50, change: -0.8, changeType: 'decrease' as const },
  cpa: { value: 15.04, change: 2.1, changeType: 'decrease' as const },
  cpc: { value: 0.52, change: -1.5, changeType: 'decrease' as const }, // New
};

// Helper to generate dynamic dates relative to today
const generateMockData = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 2000) + 3000,
      adSpend: Math.floor(Math.random() * 500) + 400,
      orders: Math.floor(Math.random() * 20) + 30,
      acos: (Math.random() * 5) + 12, // Randomize slightly
      roas: (Math.random() * 2) + 5,
      adSales: Math.floor(Math.random() * 2000) + 2500,
      totalOrders: Math.floor(Math.random() * 20) + 30,
      adOrders: Math.floor(Math.random() * 10) + 10,
      unitsSold: Math.floor(Math.random() * 30) + 40,
      clicks: Math.floor(Math.random() * 200) + 300,
      impressions: Math.floor(Math.random() * 5000) + 15000,
      cpc: Number((Math.random() * 0.5 + 1.2).toFixed(2)),
      ctr: Number((Math.random() * 1 + 1.5).toFixed(2)),
      cvr: Number((Math.random() * 2 + 3).toFixed(2)),
      tacos: (Math.random() * 5) + 8,
      cpa: Number((Math.random() * 10 + 25).toFixed(2)),
      aov: Number((Math.random() * 20 + 90).toFixed(2))
    });
  }
  return data;
};

const mockChartData = generateMockData(90); // Generate 90 days of data

const mockProductData = [
  {
    id: '1',
    rank: 1,
    image: 'https://placehold.co/40x40?text=T',
    title: 'FreshDcart Room Temperature Thermometer',
    asin: 'B07GTN94PC',
    sku: 'FDC-THERM-001',
    revenue: {
      total: 95960.82,
      change: -23.3,
      ad: 44959.50,
      adChange: -35.1,
      organic: 51001.32,
      organicChange: -8.5,
    },
    spend: {
      value: 9238.39,
      change: -26.5,
    },
    orders: {
      total: 252,
      change: -17.9,
      ad: 141,
      adChange: -32.2,
      organic: 111,
      organicChange: 12.1,
    },
    units: {
      total: 332,
      change: -21.9,
      ad: 176,
      adChange: -37.4,
      organic: 156,
      organicChange: 8.3,
    },
    cr: {
      ad: 18.18,
      change: 6.4,
    },
    ctr: {
      ad: 1.28,
      change: -0.1,
    },
    aov: {
      total: 380.05,
      change: -6.7,
      ad: 318.40,
      adChange: -4.4,
      organic: 455.53,
      organicChange: -19.1,
    },
    roas: {
      ad: 4.85,
      change: -12.1,
    },
    acos: {
      ad: 20.64,
      change: 2.5,
    },
    tacos: {
      value: 9.52,
      change: 0.5,
    },
    cpc: {
      value: 11.95,
      change: 9.5,
    },
  },
  {
    id: '2',
    rank: 2,
    image: 'https://placehold.co/40x40?text=C',
    title: 'FreshDcart 5-Digit Tally Clicker Counter',
    asin: 'B07NY4W7RL',
    sku: 'FDC-CPLACEHOLDER-002',
    revenue: {
      total: 66576.00,
      change: -9.6,
      ad: 34384.71,
      adChange: -4.4,
      organic: 32191.29,
      organicChange: -14.5,
    },
    spend: {
      value: 12029.27,
      change: -4.7,
    },
    orders: {
      total: 286,
      change: -10.1,
      ad: 169,
      adChange: -2.9,
      organic: 117,
      organicChange: -18.8,
    },
    units: {
      total: 297,
      change: -8.3,
      ad: 176,
      adChange: -1.1,
      organic: 121,
      organicChange: -17.1,
    },
    cr: {
      ad: 14.98,
      change: -3.8,
    },
    ctr: {
      ad: 0.97,
      change: -0.5,
    },
    aov: {
      total: 232.72,
      change: 0.5,
      ad: 203.28,
      adChange: -1.7,
      organic: 275.62,
      organicChange: 5.4,
    },
    roas: {
      ad: 2.83,
      change: 0.8,
    },
    acos: {
      ad: 35.38,
      change: 0.3,
    },
    tacos: {
      value: 18.33,
      change: 1.2,
    },
    cpc: {
      value: 10.78,
      change: -6.6,
    },
  },
  {
    id: '3',
    rank: 3,
    image: 'https://placehold.co/40x40?text=W',
    title: 'FreshDcart Gold Weight Machine',
    asin: 'B07R8PBWXT',
    sku: 'FDC-WEIGHT-003',
    revenue: {
      total: 50400.00,
      change: 4.0,
      ad: 23186.88,
      adChange: -3.6,
      organic: 27213.12,
      organicChange: 11.6,
    },
    spend: {
      value: 5813.42,
      change: -17.1,
    },
    orders: {
      total: 187,
      change: 9.4,
      ad: 90,
      adChange: 1.1,
      organic: 97,
      organicChange: 18.3,
    },
    units: {
      total: 195,
      change: 7.7,
      ad: 91,
      adChange: -4.2,
      organic: 104,
      organicChange: 20.9,
    },
    cr: {
      ad: 11.86,
      change: 5.2,
    },
    ctr: {
      ad: 0.58,
      change: 0.1,
    },
    aov: {
      total: 269.52,
      change: -4.9,
      ad: 257.63,
      adChange: -4.7,
      organic: 280.55,
      organicChange: -5.7,
    },
    roas: {
      ad: 3.99,
      change: 16.3,
    },
    acos: {
      ad: 25.07,
      change: -4.1,
    },
    tacos: {
      value: 11.53,
      change: -3.0,
    },
    cpc: {
      value: 7.66,
      change: -4.0,
    },
  },
  {
    id: '4',
    rank: 4,
    image: 'https://placehold.co/40x40?text=J',
    title: 'FreshDcart Naam Jap Counter',
    asin: 'B0CGHPXCHQ',
    sku: 'FDC-JAP-004',
    revenue: {
      total: 67262.00,
      change: 11.2,
      ad: 22444.14,
      adChange: 28.0,
      organic: 44817.86,
      organicChange: 4.3,
    },
    spend: {
      value: 4960.20,
      change: 10.3,
    },
    orders: {
      total: 138,
      change: 13.1,
      ad: 55,
      adChange: 14.6,
      organic: 83,
      organicChange: 12.2,
    },
    units: {
      total: 173,
      change: 12.3,
      ad: 68,
      adChange: 25.9,
      organic: 105,
      organicChange: 5.0,
    },
    cr: {
      ad: 4.93,
      change: 0.6,
    },
    ctr: {
      ad: 0.53,
      change: 0.0,
    },
    aov: {
      total: 487.41,
      change: -1.7,
      ad: 408.08,
      adChange: 11.7,
      organic: 539.97,
      organicChange: -7.0,
    },
    roas: {
      ad: 4.45,
      change: 14.1,
    },
    acos: {
      ad: 22.49,
      change: 3.2,
    },
    tacos: {
      value: 7.50,
      change: 0.1,
    },
    cpc: {
      value: 4.52,
      change: 4.5,
    },
  },
  {
    id: '5',
    rank: 5,
    image: 'https://placehold.co/40x40?text=E',
    title: 'FreshDcart FDC-12A Electric Engraving',
    asin: 'B07GQZHLGP',
    sku: 'FDC-ENGRAVE-005',
    revenue: {
      total: 36176.00,
      change: 14.3,
      ad: 11106.75,
      adChange: 12.3,
      organic: 25069.25,
      organicChange: 15.3,
    },
    spend: {
      value: 2955.02,
      change: 6.2,
    },
    orders: {
      total: 153,
      change: 13.3,
      ad: 49,
      adChange: 8.9,
      organic: 104,
      organicChange: 15.6,
    },
    units: {
      total: 158,
      change: 15.3,
      ad: 50,
      adChange: 8.7,
      organic: 108,
      organicChange: 18.7,
    },
    cr: {
      ad: 9.94,
      change: 2.0,
    },
    ctr: {
      ad: 2.07,
      change: 0.2,
    },
    aov: {
      total: 236.46,
      change: 0.9,
      ad: 226.67,
      adChange: 3.1,
      organic: 240.99,
      organicChange: 0.3,
    },
    roas: {
      ad: 3.74,
      change: 5.1,
    },
    acos: {
      ad: 26.77,
      change: -1.4,
    },
    tacos: {
      value: 8.11,
      change: -0.7,
    },
    cpc: {
      value: 6.03,
      change: -0.5,
    },
  },
];

export function Dashboard() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Default to last 7 days
    new Date(),
  ]);
  const [account, setAccount] = useState<string | null>('all');
  const [loading, setLoading] = useState(false);

  // 1. Filter Chart Data based on Date Range
  const filteredData = useMemo(() => {
    if (!dateRange[0] || !dateRange[1]) return mockChartData;
    const start = dateRange[0];
    const end = dateRange[1];
    // Reset hours to compare dates only
    const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    return mockChartData.filter(item => {
      const itemDate = new Date(item.date);
      // Normalized item date
      const normalizedItemDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      return normalizedItemDate >= normalizedStart && normalizedItemDate <= normalizedEnd;
    });
  }, [dateRange]);

  // 2. Calculate KPIs dynamically from filtered data
  const currentKPIs = useMemo(() => {
    // Helper for summing
    const sum = (data: typeof mockChartData, key: keyof typeof mockChartData[0]) =>
      data.reduce((acc, curr) => acc + (curr[key] as number || 0), 0);

    // --- Current Period Calculation ---
    const totalSales = sum(filteredData, 'sales');
    const totalAdSales = sum(filteredData, 'adSales');
    const totalAdSpend = sum(filteredData, 'adSpend');
    const totalOrders = sum(filteredData, 'orders');
    const totalAdOrders = sum(filteredData, 'adOrders');
    const totalUnits = sum(filteredData, 'unitsSold');
    const totalImpressions = sum(filteredData, 'impressions');
    const totalClicks = sum(filteredData, 'clicks');

    // Calculated rates (Current)
    const acos = totalAdSales > 0 ? (totalAdSpend / totalAdSales) * 100 : 0;
    const roas = totalAdSpend > 0 ? totalAdSales / totalAdSpend : 0;
    const tacos = totalSales > 0 ? (totalAdSpend / totalSales) * 100 : 0;
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cvr = totalClicks > 0 ? (totalOrders / totalClicks) * 100 : 0;
    const aov = totalOrders > 0 ? totalSales / totalOrders : 0;
    const cpa = totalAdOrders > 0 ? totalAdSpend / totalAdOrders : 0; // FIXED: Uses Ad Orders
    const cpc = totalClicks > 0 ? totalAdSpend / totalClicks : 0;

    // --- Previous Period Calculation (for Trends) ---
    // Determine the length of the current period in milliseconds
    const currentStart = dateRange[0] ? dateRange[0].getTime() : new Date().getTime();
    const currentEnd = dateRange[1] ? dateRange[1].getTime() : new Date().getTime();
    const duration = currentEnd - currentStart;

    // Previous period is [start - duration - 1 day, start - 1 day]
    // 1 day buffer to avoid overlap if range is inclusive logic, usually we just shift by duration
    const prevStart = new Date(currentStart - duration);
    const prevEnd = new Date(currentStart);

    const prevFilteredData = mockChartData.filter(item => {
      const d = new Date(item.date).getTime();
      return d >= prevStart.getTime() && d < prevEnd.getTime();
    });

    const prevSales = sum(prevFilteredData, 'sales');
    const prevAdSales = sum(prevFilteredData, 'adSales');
    const prevAdSpend = sum(prevFilteredData, 'adSpend');
    const prevOrders = sum(prevFilteredData, 'orders');
    const prevAdOrders = sum(prevFilteredData, 'adOrders');
    const prevUnits = sum(prevFilteredData, 'unitsSold');
    const prevImpressions = sum(prevFilteredData, 'impressions');
    const prevClicks = sum(prevFilteredData, 'clicks');

    const prevAcos = prevAdSales > 0 ? (prevAdSpend / prevAdSales) * 100 : 0;
    const prevRoas = prevAdSpend > 0 ? prevAdSales / prevAdSpend : 0;
    const prevTacos = prevSales > 0 ? (prevAdSpend / prevSales) * 100 : 0;
    const prevCtr = prevImpressions > 0 ? (prevClicks / prevImpressions) * 100 : 0;
    const prevCvr = prevClicks > 0 ? (prevOrders / prevClicks) * 100 : 0;
    const prevAov = prevOrders > 0 ? prevSales / prevOrders : 0;
    const prevCpa = prevAdOrders > 0 ? prevAdSpend / prevAdOrders : 0;
    const prevCpc = prevClicks > 0 ? prevAdSpend / prevClicks : 0;

    // --- Trend Helper ---
    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    // Logic for "Good" or "Bad" change
    const getChangeType = (trend: number, metric: 'performance' | 'cost'): 'increase' | 'decrease' => {
      if (metric === 'cost') {
        // Cost went UP (trend > 0) -> Bad -> 'decrease' type (Red)
        // Cost went DOWN (trend < 0) -> Good -> 'increase' type (Green)
        return trend > 0 ? 'decrease' : 'increase';
      }
      return trend >= 0 ? 'increase' : 'decrease';
    };

    // --- Sparkline Data Generators ---
    // Sort by date ascending for charts
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const sparklines = {
      sales: sortedData.map(d => ({ value: d.sales })),
      orders: sortedData.map(d => ({ value: d.orders })),
      units: sortedData.map(d => ({ value: d.unitsSold })),
      aov: sortedData.map(d => ({ value: d.sales / (d.orders || 1) })),
      adSpend: sortedData.map(d => ({ value: d.adSpend })),
      acos: sortedData.map(d => ({ value: (d.adSpend / (d.adSales || 1)) * 100 })),
      roas: sortedData.map(d => ({ value: d.adSales / (d.adSpend || 1) })),
      adSales: sortedData.map(d => ({ value: d.adSales })),
      adOrders: sortedData.map(d => ({ value: d.adOrders })),
      tacos: sortedData.map(d => ({ value: (d.adSpend / (d.sales || 1)) * 100 })),
      impressions: sortedData.map(d => ({ value: d.impressions })),
      clicks: sortedData.map(d => ({ value: d.clicks })),
      ctr: sortedData.map(d => ({ value: (d.clicks / (d.impressions || 1)) * 100 })),
      cvr: sortedData.map(d => ({ value: (d.orders / (d.clicks || 1)) * 100 })),
      cpa: sortedData.map(d => ({ value: d.adSpend / (d.adOrders || 1) })), // Fixed
      cpc: sortedData.map(d => ({ value: d.adSpend / (d.clicks || 1) })),
    };


    return {
      totalSales: { value: totalSales, change: calcTrend(totalSales, prevSales), changeType: getChangeType(calcTrend(totalSales, prevSales), 'performance'), sparkline: sparklines.sales },
      orders: { value: totalOrders, change: calcTrend(totalOrders, prevOrders), changeType: getChangeType(calcTrend(totalOrders, prevOrders), 'performance'), sparkline: sparklines.orders },
      units: { value: totalUnits, change: calcTrend(totalUnits, prevUnits), changeType: getChangeType(calcTrend(totalUnits, prevUnits), 'performance'), sparkline: sparklines.units },
      aov: { value: aov, change: calcTrend(aov, prevAov), changeType: getChangeType(calcTrend(aov, prevAov), 'performance'), sparkline: sparklines.aov },
      adSpend: { value: totalAdSpend, change: calcTrend(totalAdSpend, prevAdSpend), changeType: getChangeType(calcTrend(totalAdSpend, prevAdSpend), 'cost'), sparkline: sparklines.adSpend },
      acos: { value: acos, change: calcTrend(acos, prevAcos), changeType: getChangeType(calcTrend(acos, prevAcos), 'cost'), sparkline: sparklines.acos }, // Cost metric
      roas: { value: roas, change: calcTrend(roas, prevRoas), changeType: getChangeType(calcTrend(roas, prevRoas), 'performance'), sparkline: sparklines.roas },
      adSales: { value: totalAdSales, change: calcTrend(totalAdSales, prevAdSales), changeType: getChangeType(calcTrend(totalAdSales, prevAdSales), 'performance'), sparkline: sparklines.adSales },
      adOrders: { value: totalAdOrders, change: calcTrend(totalAdOrders, prevAdOrders), changeType: getChangeType(calcTrend(totalAdOrders, prevAdOrders), 'performance'), sparkline: sparklines.adOrders },
      tacos: { value: tacos, change: calcTrend(tacos, prevTacos), changeType: getChangeType(calcTrend(tacos, prevTacos), 'cost'), sparkline: sparklines.tacos },
      impressions: { value: totalImpressions, change: calcTrend(totalImpressions, prevImpressions), changeType: getChangeType(calcTrend(totalImpressions, prevImpressions), 'performance'), sparkline: sparklines.impressions },
      clicks: { value: totalClicks, change: calcTrend(totalClicks, prevClicks), changeType: getChangeType(calcTrend(totalClicks, prevClicks), 'performance'), sparkline: sparklines.clicks },
      ctr: { value: ctr, change: calcTrend(ctr, prevCtr), changeType: getChangeType(calcTrend(ctr, prevCtr), 'performance'), sparkline: sparklines.ctr },
      cvr: { value: cvr, change: calcTrend(cvr, prevCvr), changeType: getChangeType(calcTrend(cvr, prevCvr), 'performance'), sparkline: sparklines.cvr },
      cpa: { value: cpa, change: calcTrend(cpa, prevCpa), changeType: getChangeType(calcTrend(cpa, prevCpa), 'cost'), sparkline: sparklines.cpa },
      cpc: { value: cpc, change: calcTrend(cpc, prevCpc), changeType: getChangeType(calcTrend(cpc, prevCpc), 'cost'), sparkline: sparklines.cpc },
    };
  }, [filteredData, dateRange]);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleExport = () => {
    const headers = ['Date', 'Sales', 'Ad Spend', 'Orders', 'ACoS', 'RoAS'];
    const csvContent = [
      headers.join(','),
      ...mockChartData.map(row =>
        [row.date, row.sales, row.adSpend, row.orders, row.acos, row.roas].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'dashboard_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const setPresetRange = (range: string) => {
    const end = new Date();
    const start = new Date();
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    switch (range) {
      case 'today':
        // start is already today 00:00
        break;
      case 'week':
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        start.setDate(diff);
        break;
      case 'last7':
        start.setDate(start.getDate() - 7);
        break;
      case 'last14':
        start.setDate(start.getDate() - 14);
        break;
      case 'last30':
        start.setDate(start.getDate() - 30);
        break;
      case 'last60':
        start.setDate(start.getDate() - 60);
        break;
    }
    setDateRange([start, end]);
  };

  useEffect(() => {
    // Load initial data
    handleRefresh();
  }, [dateRange, account]);

  return (
    <AnimatedPage>
      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Group justify="space-between">
              <div>
                <Text size="xl" fw={700}>
                  Dashboard
                </Text>
                <Text size="sm" c="dimmed">
                  Amazon advertising performance overview
                </Text>
              </div>

              <Group gap="sm">
                <Select
                  placeholder="Select Account"
                  data={[
                    { value: 'all', label: 'All Accounts' },
                    { value: 'account1', label: 'Account 1' },
                    { value: 'account2', label: 'Account 2' },
                  ]}
                  value={account}
                  onChange={setAccount}
                  style={{ width: 150 }}
                />

                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button variant="default" leftSection={<IconCalendar size={16} />}>Presets</Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => setPresetRange('today')}>Today</Menu.Item>
                    <Menu.Item onClick={() => setPresetRange('week')}>This Week</Menu.Item>
                    <Menu.Item onClick={() => setPresetRange('last7')}>Last 7 Days</Menu.Item>
                    <Menu.Item onClick={() => setPresetRange('last14')}>Last 14 Days</Menu.Item>
                    <Menu.Item onClick={() => setPresetRange('last30')}>Last 30 Days</Menu.Item>
                    <Menu.Item onClick={() => setPresetRange('last60')}>Last 60 Days</Menu.Item>
                  </Menu.Dropdown>
                </Menu>

                <DatePickerInput
                  type="range"
                  placeholder="Select date range"
                  value={dateRange}
                  onChange={setDateRange}
                  style={{ width: 220 }}
                />

                <Button
                  variant="light"
                  leftSection={<IconRefresh size={16} />}
                  onClick={handleRefresh}
                  loading={loading}
                >
                  Refresh
                </Button>

                <Button
                  variant="light"
                  leftSection={<IconDownload size={16} />}
                  onClick={handleExport}
                >
                  Export
                </Button>
              </Group>
            </Group>
          </motion.div>

          {/* KPI Cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <Grid>
              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Total Sales"
                    value={currentKPIs.totalSales.value}
                    icon={IconCurrencyDollar}
                    change={currentKPIs.totalSales.change}
                    changeType={currentKPIs.totalSales.changeType}
                    format="currency"
                    loading={loading}
                    sparklineData={currentKPIs.totalSales.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Orders"
                    value={currentKPIs.orders.value}
                    icon={IconShoppingCart}
                    change={currentKPIs.orders.change}
                    changeType={currentKPIs.orders.changeType}
                    format="number"
                    loading={loading}
                    sparklineData={currentKPIs.orders.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Units Sold"
                    value={currentKPIs.units.value}
                    icon={IconPackage}
                    change={currentKPIs.units.change}
                    changeType={currentKPIs.units.changeType}
                    format="number"
                    loading={loading}
                    sparklineData={currentKPIs.units.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="AOV"
                    value={currentKPIs.aov.value}
                    icon={IconTrendingUp}
                    change={currentKPIs.aov.change}
                    changeType={currentKPIs.aov.changeType}
                    format="currency"
                    loading={loading}
                    sparklineData={currentKPIs.aov.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Ad Spend"
                    value={currentKPIs.adSpend.value}
                    icon={IconAd}
                    change={currentKPIs.adSpend.change}
                    changeType={currentKPIs.adSpend.changeType}
                    format="currency"
                    loading={loading}
                    sparklineData={currentKPIs.adSpend.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="ACoS"
                    value={currentKPIs.acos.value}
                    icon={IconTarget}
                    change={currentKPIs.acos.change}
                    changeType={currentKPIs.acos.changeType}
                    format="percentage"
                    loading={loading}
                    sparklineData={currentKPIs.acos.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="RoAS"
                    value={currentKPIs.roas.value}
                    icon={IconChartLine}
                    change={currentKPIs.roas.change}
                    changeType={currentKPIs.roas.changeType}
                    format="number"
                    loading={loading}
                    sparklineData={currentKPIs.roas.sparkline}
                  />
                </motion.div>
              </Grid.Col>


              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Impressions"
                    value={currentKPIs.impressions.value}
                    icon={IconEye}
                    change={currentKPIs.impressions.change}
                    changeType={currentKPIs.impressions.changeType}
                    format="number"
                    loading={loading}
                    sparklineData={currentKPIs.impressions.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Ad Sales"
                    value={currentKPIs.adSales.value}
                    icon={IconCurrencyDollar}
                    change={currentKPIs.adSales.change}
                    changeType={currentKPIs.adSales.changeType}
                    format="currency"
                    loading={loading}
                    sparklineData={currentKPIs.adSales.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Ad Orders"
                    value={currentKPIs.adOrders.value}
                    icon={IconShoppingCart}
                    change={currentKPIs.adOrders.change}
                    changeType={currentKPIs.adOrders.changeType}
                    format="number"
                    loading={loading}
                    sparklineData={currentKPIs.adOrders.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="TACoS"
                    value={currentKPIs.tacos.value}
                    icon={IconPercentage}
                    change={currentKPIs.tacos.change}
                    changeType={currentKPIs.tacos.changeType}
                    format="percentage"
                    loading={loading}
                    sparklineData={currentKPIs.tacos.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="Clicks"
                    value={currentKPIs.clicks.value}
                    icon={IconClick}
                    change={currentKPIs.clicks.change}
                    changeType={currentKPIs.clicks.changeType}
                    format="number"
                    loading={loading}
                    sparklineData={currentKPIs.clicks.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="CTR"
                    value={currentKPIs.ctr.value}
                    icon={IconClick}
                    change={currentKPIs.ctr.change}
                    changeType={currentKPIs.ctr.changeType}
                    format="percentage"
                    loading={loading}
                    sparklineData={currentKPIs.ctr.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="CVR"
                    value={currentKPIs.cvr.value}
                    icon={IconUserCheck}
                    change={currentKPIs.cvr.change}
                    changeType={currentKPIs.cvr.changeType}
                    format="percentage"
                    loading={loading}
                    sparklineData={currentKPIs.cvr.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="CPA"
                    value={currentKPIs.cpa.value}
                    icon={IconCoin}
                    change={currentKPIs.cpa.change}
                    changeType={currentKPIs.cpa.changeType}
                    format="currency"
                    loading={loading}
                    sparklineData={currentKPIs.cpa.sparkline}
                  />
                </motion.div>
              </Grid.Col>

              <Grid.Col span={3}>
                <motion.div variants={staggerItem}>
                  <KPICard
                    title="CPC"
                    value={currentKPIs.cpc.value}
                    icon={IconCoin}
                    change={currentKPIs.cpc.change}
                    changeType={currentKPIs.cpc.changeType}
                    format="currency"
                    loading={loading}
                    sparklineData={currentKPIs.cpc.sparkline}
                  />
                </motion.div>
              </Grid.Col>
            </Grid>
          </motion.div>

          {/* Charts Row */}
          <Grid align="stretch">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                style={{ height: '100%' }}
              >
                <PerformanceChart data={filteredData} loading={loading} />
              </motion.div>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
                style={{ height: '100%' }}
              >
                <OrderDistributionChart
                  totalOrders={currentKPIs.orders.value}
                  adOrders={currentKPIs.adOrders.value}
                />
              </motion.div>
            </Grid.Col>
          </Grid>

          {/* Product Table */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.6 }}
          >
            <ProductTable
              data={mockProductData}
              loading={loading}
              totalCount={mockProductData.length}
              page={1}
              onPageChange={(page) => console.log('Page changed:', page)}
              onSearch={(query) => console.log('Search:', query)}
              onFilter={(filters) => console.log('Filter:', filters)}
              onExport={handleExport}
            />
          </motion.div>
        </Stack>
      </Container>
    </AnimatedPage>
  );
}