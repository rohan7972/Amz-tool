import { Card, Group, Stack, Text, useMantineTheme } from '@mantine/core';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface OrderDistributionChartProps {
    totalOrders: number;
    adOrders: number;
}

export function OrderDistributionChart({ totalOrders, adOrders }: OrderDistributionChartProps) {
    const theme = useMantineTheme();

    // Calculate organic orders
    const organicOrders = totalOrders - adOrders;

    // Calculate percentages
    const adDetails = {
        value: adOrders,
        percentage: Math.round((adOrders / totalOrders) * 100),
        color: '#34d399', // Green
        label: 'Ad'
    };

    const organicDetails = {
        value: organicOrders,
        percentage: Math.round((organicOrders / totalOrders) * 100),
        color: '#8b5cf6', // Violet
        label: 'Organic'
    };

    const data = [
        { name: 'Ad', value: adOrders, color: '#34d399' },
        { name: 'Organic', value: organicOrders, color: '#8b5cf6' },
    ];

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
            <Group justify="space-between" mb="md">
                <Text size="lg" fw={600}>
                    Order Distribution
                </Text>
            </Group>

            <div style={{ position: 'relative', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={10}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [value, 'Orders']}
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <Text size="xl" fw={700} style={{ fontSize: 24, lineHeight: 1 }}>
                        {totalOrders}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                        Total Orders
                    </Text>
                </div>
            </div>

            <Group justify="space-around" mt="lg">
                <Stack gap={0} align="center">
                    <Group gap={6}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: adDetails.color }} />
                        <Text size="sm" c="dimmed">{adDetails.label}</Text>
                    </Group>
                    <Text fw={700} size="lg">{adDetails.value}</Text>
                    <Text size="xs" c="dimmed">
                        ↓ {adDetails.percentage}%
                    </Text>
                </Stack>

                <Stack gap={0} align="center">
                    <Group gap={6}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: organicDetails.color }} />
                        <Text size="sm" c="dimmed">{organicDetails.label}</Text>
                    </Group>
                    <Text fw={700} size="lg">{organicDetails.value}</Text>
                    <Text size="xs" c="dimmed">
                        ↓ {organicDetails.percentage}%
                    </Text>
                </Stack>
            </Group>
        </Card>
    );
}
