import { Box, Card, Group, Stack, Text, ThemeIcon, useMantineTheme } from '@mantine/core';
import { IconTrendingDown, IconTrendingUp, TablerIconsProps } from '@tabler/icons-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.FC<TablerIconsProps>;
  change?: number;
  changeType?: 'increase' | 'decrease';
  format?: 'currency' | 'percentage' | 'number';
  loading?: boolean;
  sparklineData?: { value: number }[];
}

export function KPICard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  format = 'number',
  loading = false,
  sparklineData,
}: KPICardProps) {
  const theme = useMantineTheme();

  const formatValue = (val: string | number) => {
    if (loading) return '...';

    const numValue = typeof val === 'string' ? parseFloat(val) : val;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numValue);
      case 'percentage':
        return `${numValue.toFixed(2)}%`;
      default:
        return new Intl.NumberFormat('en-IN').format(numValue);
    }
  };

  const changeColor = changeType === 'increase' ? (change && change < 0 ? 'red' : 'green') : (change && change > 0 ? 'red' : 'green');

  // Refined logic for change color based on changeType semantic
  const getChangeColor = () => {
    if (!change) return 'gray';
    // If changeType is 'increase' (good), green. If 'decrease' (bad), red.
    // But wait, the prop changeType literally means "is it an increase or decrease numerically" in many systems, 
    // but here it seems to be used as "semantic direction". 
    // Let's stick to the prop passed from Dashboard which handles the semantic good/bad.
    return changeType === 'increase' ? 'green' : 'red';
  };

  const getChangeIcon = () => {
    if (!change) return null;
    return change >= 0 ? IconTrendingUp : IconTrendingDown;
  };

  const ChangeIcon = getChangeIcon();
  const trendColor = getChangeColor();

  // Map standardized colors to Mantine theme colors for "Dark Ink" look
  const getChartColor = () => {
    // Using index 8 or 9 for darker "ink" look
    if (trendColor === 'gray') return theme.colors.blue[8];
    if (trendColor === 'green') return theme.colors.teal[9]; // Dark Green
    if (trendColor === 'red') return theme.colors.red[9];   // Dark Red
    return theme.colors.blue[8];
  };

  const chartColor = getChartColor();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Stack gap="md" style={{ position: 'relative', zIndex: 2 }}>
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text size="sm" c="dimmed" fw={500}>
              {title}
            </Text>
            <Text size="xl" fw={700} c={theme.colors.dark[9]}>
              {formatValue(value)}
            </Text>
          </Stack>

          <ThemeIcon
            size="lg"
            radius="md"
            variant="light"
            color="blue"
            style={{
              backgroundColor: theme.colors.blue[0],
              color: theme.colors.blue[6],
            }}
          >
            <Icon size={20} />
          </ThemeIcon>
        </Group>

        {change !== undefined && (
          <Group gap={4}>
            {ChangeIcon && (
              <ThemeIcon
                size="sm"
                radius="xl"
                variant="light"
                color={trendColor}
              >
                <ChangeIcon size={12} />
              </ThemeIcon>
            )}
            <Text
              size="sm"
              c={trendColor}
              fw={500}
            >
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </Text>
            <Text size="sm" c="dimmed">
              vs last period
            </Text>
          </Group>
        )}
      </Stack>

      {sparklineData && sparklineData.length > 0 && (
        <Box
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: '40%', // Take up bottom 60% of card
            zIndex: 1,
            opacity: 0.2, // Slightly higher opacity for visibility
            pointerEvents: 'none',
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2.5} // Slightly thicker line
                fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Card>
  );
}