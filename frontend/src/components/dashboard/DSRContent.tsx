import { Button, Group, Paper, SimpleGrid, Table, Text } from '@mantine/core';
import {
    IconBox, IconChartBar,
    IconClick,
    IconCurrencyRupee,
    IconEye,
    IconPercentage,
    IconShoppingCart,
    IconTarget
} from '@tabler/icons-react';
import { MiniKPICard } from './MiniKPICard';

interface DSRContentProps {
    dateRange: [Date | null, Date | null];
}

export function DSRContent({ dateRange }: DSRContentProps) {

    // Mock KPI Data
    const kpis = [
        { title: 'Sales', icon: IconCurrencyRupee, color: 'green', value: 8657617.79, currency: true },
        { title: 'Organic Sales', icon: IconCurrencyRupee, color: 'teal', value: 4771951.36, currency: true },
        { title: 'Ad Sales', icon: IconChartBar, color: 'cyan', value: 3885666.43, currency: true },
        { title: 'Units Sold', icon: IconBox, color: 'blue', value: 33387, isInteger: true },
        { title: 'Organic Units', icon: IconBox, color: 'lime', value: 16432, isInteger: true },
        { title: 'Ad Units', icon: IconBox, color: 'cyan', value: 16955, isInteger: true },
        { title: 'Ad Spend', icon: IconCurrencyRupee, color: 'red', value: 1160465.58, currency: true },
        { title: 'ACoS %', icon: IconPercentage, color: 'grape', value: 29.87, isPercentage: true },
        { title: 'TACoS %', icon: IconPercentage, color: 'violet', value: 13.40, isPercentage: true },
        { title: 'Total Orders', icon: IconShoppingCart, color: 'blue', value: 33387, isInteger: true },
        { title: 'CR %', icon: IconPercentage, color: 'pink', value: 20.47, isPercentage: true },
        { title: 'Impressions', icon: IconEye, color: 'indigo', value: 22372491, isInteger: true },
        { title: 'Clicks', icon: IconClick, color: 'pink', value: 163128, isInteger: true },
        { title: 'CPC', icon: IconCurrencyRupee, color: 'orange', value: 7.11, currency: true },
        { title: 'CTR %', icon: IconPercentage, color: 'violet', value: 0.73, isPercentage: true },
        { title: 'AOV', icon: IconTarget, color: 'orange', value: 259.31, currency: true },
    ];

    // Mock Table Data
    const generateTableData = () => {
        const rows = [];
        const start = dateRange[0] || new Date();
        const end = dateRange[1] || new Date();
        const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

        for (let i = 0; i < Math.min(days, 30); i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);

            const sales = Math.random() * 50000 + 10000;
            const adSalesRatio = Math.random() * 0.4 + 0.2; // 20% to 60%
            const adSales = sales * adSalesRatio;
            const organicSales = sales - adSales;

            rows.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                sales: sales,
                organicSales: organicSales,
                adCvr: Math.random() * 5 + 5,
                organicSalesPerc: (organicSales / sales) * 100,
                adSales: adSales,
                adSalesPerc: (adSales / sales) * 100,
                unitsSold: Math.floor(Math.random() * 300 + 50),
                organicUnits: Math.floor(Math.random() * 100),
                adUnits: Math.floor(Math.random() * 200 + 10),
                aov: Math.random() * 100 + 200,
                impressions: Math.floor(Math.random() * 100000 + 50000),
                clicks: Math.floor(Math.random() * 2000 + 500),
                spends: Math.random() * 5000 + 1000,
                acos: Math.random() * 20 + 20,
                tacos: Math.random() * 10 + 5,
                roas: Math.random() * 2 + 2,
                cpc: Math.random() * 5 + 5,
                ctr: Math.random() * 0.5 + 0.4
            });
        }
        return rows.reverse(); // Newest first
    };

    const tableData = generateTableData();
    const formatCurrency = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v);
    const formatPerc = (v: number) => `${v.toFixed(2)}%`;
    const formatInt = (v: number) => new Intl.NumberFormat('en-IN').format(v);

    const totals = tableData.reduce((acc, row) => ({
        sales: acc.sales + row.sales,
        organicSales: acc.organicSales + row.organicSales,
        adSales: acc.adSales + row.adSales,
        unitsSold: acc.unitsSold + row.unitsSold,
        organicUnits: acc.organicUnits + row.organicUnits,
        adCvr: acc.adCvr + row.adCvr,
        organicSalesPerc: acc.organicSalesPerc + row.organicSalesPerc,
        adSalesPerc: acc.adSalesPerc + row.adSalesPerc,
        adUnits: acc.adUnits + row.adUnits,
        impressions: acc.impressions + row.impressions,
        clicks: acc.clicks + row.clicks,
        spends: acc.spends + row.spends
        // Averages calculated after
    }), {
        sales: 0, organicSales: 0, adSales: 0, unitsSold: 0, organicUnits: 0, adCvr: 0, organicSalesPerc: 0, adSalesPerc: 0,
        adUnits: 0, impressions: 0, clicks: 0, spends: 0
    });

    const finalTotals = {
        ...totals,
        adCvr: totals.adCvr / (tableData.length || 1),
        organicSalesPerc: totals.organicSalesPerc / (tableData.length || 1),
        adSalesPerc: totals.adSalesPerc / (tableData.length || 1),
        aov: totals.sales / (totals.unitsSold || 1),
        acos: (totals.spends / totals.adSales) * 100,
        tacos: (totals.spends / totals.sales) * 100,
        roas: totals.adSales / (totals.spends || 1),
        cpc: totals.spends / (totals.clicks || 1),
        ctr: (totals.clicks / totals.impressions) * 100
    };

    return (
        <>
            <Group justify="space-between" mb="md" align="center">
                <Text size="lg" fw={600}>Current Month Analytics: December 2025</Text>
                <Button variant="default" size="xs" leftSection={<IconTarget size={14} />}>Set Targets</Button>
            </Group>

            <SimpleGrid cols={{ base: 2, sm: 4, md: 8 }} spacing="sm" verticalSpacing="sm" mb="xl">
                {kpis.map((kpi, index) => (
                    <MiniKPICard
                        key={index}
                        title={kpi.title}
                        icon={kpi.icon}
                        color={kpi.color}
                        value={kpi.value}
                        currency={kpi.currency}
                        isPercentage={kpi.isPercentage}
                    />
                ))}
            </SimpleGrid>

            <Text size="md" fw={600} mb="md">
                Daily analysis between {dateRange[0]?.toLocaleDateString()} and {dateRange[1]?.toLocaleDateString()}
            </Text>

            <Paper withBorder radius="sm" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover verticalSpacing="sm" style={{ minWidth: 1800 }}>
                        <Table.Thead bg="#f8f9fa">
                            <Table.Tr>
                                <Table.Th style={{ width: 40, position: 'sticky', left: 0, backgroundColor: '#f8f9fa', zIndex: 10 }}></Table.Th>
                                <Table.Th style={{ position: 'sticky', left: 40, backgroundColor: '#f8f9fa', zIndex: 10 }}>DATE</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>SALES</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>ORGANIC SALES</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>AD CVR %</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>ORGANIC SALES %</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>AD SALES</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>AD SALES %</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>UNITS SOLD</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>ORGANIC UNITS</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>AD UNITS</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>AOV</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>IMPRESSIONS</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>CLICKS</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>SPENDS</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>ACOS %</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>TACOS %</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>ROAS</Table.Th>
                                <Table.Th style={{ textAlign: 'right' }}>CPC</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>CTR %</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {tableData.map((row) => (
                                <Table.Tr key={row.date}>
                                    <Table.Td style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 10 }}><input type="checkbox" /></Table.Td>
                                    <Table.Td style={{ position: 'sticky', left: 40, backgroundColor: 'white', zIndex: 10 }}>{row.date}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(row.sales)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(row.organicSales)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{formatPerc(row.adCvr)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{formatPerc(row.organicSalesPerc)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(row.adSales)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{formatPerc(row.adSalesPerc)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{row.unitsSold}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{row.organicUnits}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{row.adUnits}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(row.aov)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatInt(row.impressions)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatInt(row.clicks)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(row.spends)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{formatPerc(row.acos)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{formatPerc(row.tacos)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{row.roas.toFixed(2)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(row.cpc)}</Table.Td>
                                    <Table.Td style={{ textAlign: 'center' }}>{formatPerc(row.ctr)}</Table.Td>
                                </Table.Tr>
                            ))}
                            <Table.Tr style={{ position: 'sticky', bottom: 0, backgroundColor: '#e7f5ff', fontWeight: 700, color: '#1864ab', zIndex: 10 }}>
                                <Table.Td style={{ position: 'sticky', left: 0, backgroundColor: '#e7f5ff', zIndex: 10 }}></Table.Td>
                                <Table.Td style={{ position: 'sticky', left: 40, backgroundColor: '#e7f5ff', zIndex: 10 }}>TOTAL</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(finalTotals.sales)}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(finalTotals.organicSales)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatPerc(finalTotals.adCvr)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatPerc(finalTotals.organicSalesPerc)}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(finalTotals.adSales)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatPerc(finalTotals.adSalesPerc)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{finalTotals.unitsSold}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{finalTotals.organicUnits}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{finalTotals.adUnits}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(finalTotals.aov)}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatInt(finalTotals.impressions)}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatInt(finalTotals.clicks)}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(finalTotals.spends)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatPerc(finalTotals.acos)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatPerc(finalTotals.tacos)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{finalTotals.roas.toFixed(2)}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>{formatCurrency(finalTotals.cpc)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatPerc(finalTotals.ctr)}</Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </div>
            </Paper>
        </>
    );
}
