import {
    ActionIcon,
    Button,
    Container,
    Group,
    Image,
    Paper,
    ScrollArea,
    SegmentedControl,
    Select,
    Stack,
    Table,
    Text,
    TextInput
} from '@mantine/core';
import {
    IconChevronRight,
    IconDownload,
    IconInfoCircle,
    IconSearch,
    IconTrendingUp
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { DSRContent } from '../components/dashboard/DSRContent';
import { CustomDatePicker } from '../components/ui/CustomDatePicker';

// Mock Data Structure
// Mock Data Structure

// Mock Data Structure
interface DailyProductData {
    id: string;
    title: string;
    asin: string;
    sku: string;
    image: string;
    trend: { value: number }[];
    forecast: {
        current: number;
        lastMonth: number;
        change: number;
    };
    rangeTotal: {
        value: number;
        label: string;
    };
    daily: {
        [date: string]: { value: number; change: number };
    };
    weekly: {
        [week: string]: { value: number; change: number };
    };
    monthly: {
        [month: string]: { value: number; change: number };
    };
}

// Helper to generate dynamic mock data
const generateMockProducts = (count: number, daysHistory: number, metric: string) => {
    const products: DailyProductData[] = [];
    const titles = [
        'FreshDcart Room Temperature Sensor',
        'FreshDcart 5-Digit Tally Clicker Counter',
        'FreshDcart Naam Jap Counter',
        'karomouj Cut Resistant Gloves',
        'FreshDcart 3-in-1 pH Meter'
    ];

    for (let i = 0; i < count; i++) {
        const dailyData: Record<string, { value: number; change: number }> = {};
        const today = new Date();

        for (let d = 0; d < daysHistory; d++) {
            const date = new Date(today);
            date.setDate(date.getDate() - d);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
            dailyData[dateKey] = {
                value: Math.random() * 10000 + 5000,
                change: Math.random() * 20 - 10
            };
        }

        products.push({
            id: (i + 1).toString(),
            title: titles[i % titles.length],
            asin: `B0${Math.random().toString(36).substring(7).toUpperCase()}`,
            sku: 'FDC-ITEM-' + (i + 1),
            image: `https://placehold.co/40x40?text=${titles[i % titles.length].charAt(0)}`,
            trend: Array(7).fill(0).map(() => ({ value: Math.random() * 100 })),
            forecast: {
                current: Math.random() * 500000 + 200000,
                lastMonth: Math.random() * 500000 + 200000,
                change: Math.random() * 40 - 20,
            },
            rangeTotal: {
                value: 0, // Calculated dynamically
                label: 'Range',
            },
            weekly: {}, // Simplified for now
            monthly: {}, // Simplified for now
            daily: dailyData
        });
    }
    return products;
};



// removed static dateColumns because it's dynamic now

export function DailyReports() {
    const [reportType, setReportType] = useState('DRR');

    const [selectedMetric, setSelectedMetric] = useState('Total Sales');
    const [selectedFrequency, setSelectedFrequency] = useState('Daily');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        new Date('2025-12-01'),
        new Date('2025-12-08')
    ]);

    const mockDailyData = useMemo(() => generateMockProducts(5, 90, selectedMetric), [selectedMetric]);


    // ... existing helpers ...

    // (Jump to return statement logic)
    // I can't jump efficiently with replace_file_content if I want to insert state AND change JSX.
    // I'll insert state first.

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2,
        }).format(val);
    };

    const formatPercentage = (val: number) => {
        return `${val > 0 ? '+' : ''}${val.toFixed(2)}%`;
    };

    // Helper to format values based on metric type
    const formatValue = (val: number, metric: string) => {
        const percentageMetrics = ['ACoS', 'RoAS', 'TACoS', 'CTR', 'Ad AOV', 'Ad CVR'];
        const currencyMetrics = ['Total Sales', 'Organic Sales', 'Ad Sales', 'Ad Spend', 'CPC'];

        if (percentageMetrics.includes(metric)) {
            return `${val.toFixed(2)}%`;
        }
        if (currencyMetrics.includes(metric)) {
            return formatCurrency(val);
        }
        return new Intl.NumberFormat('en-IN').format(val); // Default number formatting for units/orders
    };

    const getColumns = () => {
        if (selectedFrequency === 'Weekly') return ['WEEK 49 (DEC 03 - DEC 08)', 'WEEK 48 (DEC 01 - DEC 02)'];
        if (selectedFrequency === 'Monthly') return ['DECEMBER', 'NOVEMBER'];

        // Dynamic Daily
        if (dateRange[0] && dateRange[1]) {
            const days = [];
            const current = new Date(dateRange[1]);
            const start = new Date(dateRange[0]);
            // Reset hours to avoid infinite loops if time matches weirdly
            current.setHours(0, 0, 0, 0);
            start.setHours(0, 0, 0, 0);

            // Safety cap: max 30 columns to prevent rendering crash on huge ranges
            let safety = 0;
            while (current >= start && safety < 30) {
                // Adjust for timezone offset to prevent off-by-one
                const year = current.getFullYear();
                const month = String(current.getMonth() + 1).padStart(2, '0');
                const day = String(current.getDate()).padStart(2, '0');
                days.push(`${year}-${month}-${day}`);

                current.setDate(current.getDate() - 1);
                safety++;
            }
            return days;
        }
        return [];
    };

    const formatDateHeader = (dateKey: string) => {
        if (selectedFrequency !== 'Daily') return dateKey;
        try {
            const date = new Date(dateKey);
            return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
        } catch (e) {
            return dateKey;
        }
    };

    const renderTrendChart = (data: { value: number }[]) => (
        <div style={{ width: 100, height: 40 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <Container fluid px={0}>
            {/* Header Controls */}
            <Paper p="md" mb="md" withBorder>
                <Group justify="space-between" align="center">
                    <SegmentedControl
                        value={reportType}
                        onChange={setReportType}
                        data={[
                            { label: 'DRR', value: 'DRR' },
                            { label: 'DSR', value: 'DSR' },
                        ]}
                        size="md"
                        styles={{
                            root: { backgroundColor: '#f1f3f5' },
                            indicator: { backgroundColor: '#228be6' } // Blue indicator
                        }}
                    />

                    <CustomDatePicker
                        value={dateRange}
                        onChange={setDateRange}
                    />
                </Group>

                {reportType === 'DRR' && (
                    <Group mt="md" justify="space-between">
                        <Group>
                            <TextInput
                                placeholder="Search by ASIN, product..."
                                leftSection={<IconSearch size={16} />}
                                style={{ width: 250 }}
                            />
                            <Select
                                placeholder="Total Sales"
                                value={selectedMetric}
                                onChange={(val) => setSelectedMetric(val || 'Total Sales')}
                                data={[
                                    'Total Sales', 'Total Orders', 'Total Units',
                                    'Organic Sales', 'Organic Orders', 'Organic Units',
                                    'Ad Sales', 'Ad Orders', 'Ad Units', 'Ad Spend',
                                    'Impressions', 'Clicks', 'ACoS', 'RoAS', 'TACoS',
                                    'CTR', 'CPC', 'Ad AOV', 'Ad CVR'
                                ]}
                                style={{ width: 140 }}
                            />
                            <Select
                                placeholder="Daily"
                                value={selectedFrequency}
                                onChange={(val) => setSelectedFrequency(val || 'Daily')}
                                data={['Daily', 'Weekly', 'Monthly']}
                                style={{ width: 100 }}
                            />

                        </Group>

                        <Button variant="default" leftSection={<IconDownload size={16} />}>
                            Export Data
                        </Button>
                    </Group>
                )}
            </Paper>

            {/* Table Section */}
            {reportType === 'DRR' ? (
                <Paper withBorder>
                    <Group p="md" justify="space-between">
                        <Text fw={700}>Product Performance - {selectedMetric.replace(/ /g, '_')}</Text>
                    </Group>

                    <ScrollArea type="always">
                        <Table stickyHeader verticalSpacing="sm" withTableBorder withColumnBorders>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ minWidth: 280, backgroundColor: '#f8f9fa' }}>PRODUCT</Table.Th>
                                    <Table.Th style={{ minWidth: 100, backgroundColor: '#f8f9fa' }}>TREND</Table.Th>
                                    <Table.Th style={{ minWidth: 180, textAlign: 'center', backgroundColor: '#e6fcf5', borderLeft: '1px solid #dee2e6' }}>
                                        <Group justify="center" gap={4}>
                                            FORECAST <IconInfoCircle size={12} />
                                        </Group>
                                        <Text size="xs" c="dimmed" fw={400}>DEC 01 - DEC 31</Text>
                                    </Table.Th>
                                    <Table.Th style={{ minWidth: 150, textAlign: 'center', backgroundColor: '#e7f5ff', borderLeft: '1px solid #dee2e6' }}>
                                        RANGE TOTAL
                                        <Text size="xs" c="dimmed" fw={400}>DEC 01 - DEC 08</Text>
                                    </Table.Th>
                                    {getColumns().map(date => (
                                        <Table.Th key={date} style={{ minWidth: 120, textAlign: 'center', backgroundColor: 'white' }}>
                                            {formatDateHeader(date).toUpperCase()}
                                        </Table.Th>
                                    ))}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {mockDailyData.map((item) => {
                                    // Simulate different data scales based on metric for demo purposes
                                    // In a real app, this would come from the API
                                    let scale = 1;
                                    if (selectedMetric === 'ACoS' || selectedMetric === 'TACoS' || selectedMetric === 'CTR' || selectedMetric === 'Ad CVR') scale = 0.0001; // percentages 0-100 range roughly
                                    if (selectedMetric === 'RoAS') scale = 0.00005;
                                    if (selectedMetric.includes('Units') || selectedMetric.includes('Orders')) scale = 0.01;
                                    if (selectedMetric === 'CPC') scale = 0.0005;

                                    const displayValue = (baseVal: number) => {
                                        if (scale !== 1) {
                                            // transform big "Sales" numbers to smaller metric numbers for demo
                                            return baseVal * scale;
                                        }
                                        return baseVal;
                                    };

                                    const calcRangeTotal = () => {
                                        if (selectedFrequency !== 'Daily') return item.rangeTotal.value;
                                        return getColumns().reduce((acc, date) => acc + (item.daily[date]?.value || 0), 0);
                                    };
                                    const rangeTotalValue = calcRangeTotal();

                                    return (
                                        <Table.Tr key={item.id}>
                                            <Table.Td>
                                                <Group wrap="nowrap">
                                                    <ActionIcon variant="subtle" color="gray" size="sm">
                                                        <IconChevronRight size={16} />
                                                    </ActionIcon>
                                                    <Image src={item.image} w={40} h={40} radius="sm" />
                                                    <Stack gap={0} style={{ overflow: 'hidden' }}>
                                                        <Text size="sm" fw={600} truncate>{item.title}</Text>
                                                        <Text size="xs" c="dimmed">ASIN: {item.asin}</Text>
                                                        <Text size="xs" c="dimmed">SKU: {item.sku}</Text>
                                                    </Stack>
                                                </Group>
                                            </Table.Td>
                                            <Table.Td>
                                                {renderTrendChart(item.trend)}
                                            </Table.Td>
                                            <Table.Td style={{ textAlign: 'center', backgroundColor: '#f2fcf5', borderLeft: '1px solid #f1f3f5' }}>
                                                <Text size="sm" fw={600} c="blue">{formatValue(displayValue(item.forecast.current), selectedMetric)}</Text>
                                                <Text size="xs" c="dimmed">
                                                    Last Month: {formatValue(displayValue(item.forecast.lastMonth), selectedMetric)}
                                                </Text>
                                                <Text size="xs" c={item.forecast.change >= 0 ? 'green' : 'red'}>
                                                    {formatPercentage(item.forecast.change)}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td style={{ textAlign: 'center', backgroundColor: '#f0f7ff', borderLeft: '1px solid #f1f3f5' }}>
                                                <Text size="sm" fw={600} c="orange">{formatValue(displayValue(rangeTotalValue), selectedMetric)}</Text>
                                                <Text size="xs" c="orange" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <IconTrendingUp size={10} style={{ marginRight: 2 }} />
                                                    Range {/* Label */}
                                                </Text>
                                            </Table.Td>
                                            {getColumns().map(date => {
                                                let dataPoint;
                                                if (selectedFrequency === 'Weekly') dataPoint = item.weekly?.[date];
                                                else if (selectedFrequency === 'Monthly') dataPoint = item.monthly?.[date];
                                                else dataPoint = item.daily?.[date];

                                                return (
                                                    <Table.Td key={date} style={{ textAlign: 'center' }}>
                                                        <Text size="sm" fw={600}>{formatValue(displayValue(dataPoint?.value || 0), selectedMetric)}</Text>
                                                        <Text size="xs" c={(dataPoint?.change || 0) >= 0 ? 'green' : 'red'}>
                                                            {formatPercentage(dataPoint?.change || 0)}
                                                        </Text>
                                                    </Table.Td>
                                                );
                                            })}
                                        </Table.Tr>
                                    )
                                })}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            ) : (
                <DSRContent dateRange={dateRange} />
            )}
        </Container>
    );
}
