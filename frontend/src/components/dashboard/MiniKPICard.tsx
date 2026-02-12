import { Group, Paper, Progress, Text, ThemeIcon } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';
import React from 'react';

interface MiniKPICardProps {
    title: string;
    icon: React.ComponentType<TablerIconsProps>;
    color: string;
    value: string | number;
    forecast?: string | number;
    target?: string | number;
    progress?: number; // 0-100
    isPercentage?: boolean;
    currency?: boolean;
}

export function MiniKPICard({
    title,
    icon: Icon,
    color,
    value,
    forecast = '-',
    target = '-',
    progress = 0,
    isPercentage = false,
    currency = false
}: MiniKPICardProps) {

    const format = (val: string | number) => {
        if (typeof val === 'string') return val;
        if (currency) return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
        if (isPercentage) return `${val.toFixed(2)}%`;
        if (Number.isInteger(val)) return new Intl.NumberFormat('en-IN').format(val);
        return val.toLocaleString('en-IN');
    };

    return (
        <Paper withBorder p="sm" radius="md" shadow="none" style={{ backgroundColor: 'white' }}>
            <Group mb="xs" gap="xs" wrap="nowrap">
                <ThemeIcon color={color} variant="light" size="md" radius="sm">
                    <Icon size={16} />
                </ThemeIcon>
                <Text size="sm" fw={600} truncate title={title}>{title}</Text>
            </Group>

            <div style={{ marginBottom: 12 }}>
                <Text size="xs" c="dimmed" fw={500} mb={4}>Current</Text>
                <Text fz="md" fw={700} lh={1} style={{ letterSpacing: '-0.5px' }} truncate title={String(value)}>
                    {format(value)}
                </Text>
            </div>

            <Group justify="space-between" mb={4}>
                <Text size="xs" c="dimmed" style={{ fontSize: 11 }}>Forecast</Text>
                <Text size="xs" fw={500} style={{ fontSize: 11 }}>{format(forecast)}</Text>
            </Group>

            <Group justify="space-between" mb={4}>
                <Text size="xs" c="dimmed" style={{ fontSize: 11 }}>Target</Text>
                <Text size="xs" fw={500} style={{ fontSize: 11 }}>{format(target)}</Text>
            </Group>

            <Group justify="space-between" mb="xs">
                <Text size="xs" c="dimmed" style={{ fontSize: 11 }}>Progress</Text>
                <Text size="xs" fw={500} style={{ fontSize: 11 }}>{target === '-' ? 'NA' : `${progress}%`}</Text>
            </Group>

            <Progress value={progress} color={color} size={6} radius="xl" />
        </Paper>
    );
}
