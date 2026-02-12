import {
  Card,
  Group,
  Image,
  Pagination,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput
} from '@mantine/core';
import {
  IconSearch
} from '@tabler/icons-react';
import { useState } from 'react';

export interface ProductData {
  id: string;
  rank: number;
  image: string;
  title: string;
  asin: string;
  sku: string;
  revenue: {
    total: number;
    change: number;
    ad: number;
    adChange: number;
    organic: number;
    organicChange: number;
  };
  spend: {
    value: number;
    change: number;
  };
  orders: {
    total: number;
    change: number;
    ad: number;
    adChange: number;
    organic: number;
    organicChange: number;
  };
  units: {
    total: number;
    change: number;
    ad: number;
    adChange: number;
    organic: number;
    organicChange: number;
  };
  cr: {
    ad: number;
    change: number;
  };
  ctr: {
    ad: number;
    change: number;
  };
  aov: {
    total: number;
    change: number;
    ad: number;
    adChange: number;
    organic: number;
    organicChange: number;
  };
  roas: {
    ad: number;
    change: number;
  };
  acos: {
    ad: number;
    change: number;
  };
  tacos: {
    value: number;
    change: number;
  };
  cpc: {
    value: number;
    change: number;
  };
}

interface ProductTableProps {
  data: ProductData[];
  loading?: boolean;
  totalCount?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onExport?: () => void;
}

const ITEMS_PER_PAGE = 10;

export function ProductTable({
  data,
  loading = false,
  totalCount = 0,
  page = 1,
  onPageChange,
  onSearch,
  onFilter,
  onExport,
}: ProductTableProps) {
  const [searchQuery, setSearchQuery] = useState('');


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
      <tr key={index}>
        {Array.from({ length: 20 }).map((_, cellIndex) => (
          <td key={cellIndex}>
            <Skeleton height={20} />
          </td>
        ))}
      </tr>
    ));
  };

  const renderTableHeader = () => (
    <thead>
      <tr>
        <th rowSpan={2} style={{ width: 60, textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">RANK</Text>
        </th>
        <th rowSpan={2} style={{ minWidth: 120, textAlign: 'left', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">PRODUCT NAME</Text>
        </th>
        <th colSpan={3} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">REVENUE</Text>
        </th>
        <th colSpan={1} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">SPEND</Text>
        </th>
        <th colSpan={3} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">ORDERS</Text>
        </th>
        <th colSpan={3} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">UNITS</Text>
        </th>
        <th colSpan={1} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">CR %</Text>
        </th>
        <th colSpan={1} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">CTR %</Text>
        </th>
        <th colSpan={3} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', borderRight: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">AOV</Text>
        </th>
        <th colSpan={1} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">ROAS</Text>
        </th>
        <th colSpan={1} style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
          <Text size="xs" fw={700} c="dimmed">ACOS</Text>
        </th>
        {/* Empty cells above TACOS and CPC */}
        <th style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}></th>
        <th style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}></th>
      </tr>
      <tr>
        {/* Revenue Sub-columns */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">TOTAL</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">ORGANIC</Text></th>

        {/* Spend Sub-column */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">AD SPEND</Text></th>

        {/* Orders Sub-columns */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">TOTAL</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">ORGANIC</Text></th>

        {/* Units Sub-columns */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">TOTAL</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">ORGANIC</Text></th>

        {/* CR Sub-column */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>

        {/* CTR Sub-column */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>

        {/* AOV Sub-columns */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">TOTAL</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">ORGANIC</Text></th>

        {/* ROAS Sub-column */}
        <th style={{ textAlign: 'center' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>

        {/* ACOS Sub-column */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">AD</Text></th>

        {/* TACOS Sub-column */}
        <th style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}><Text size="xs" fw={700} c="dimmed">TACOS</Text></th>

        {/* CPC Sub-column */}
        <th style={{ textAlign: 'center' }}><Text size="xs" fw={700} c="dimmed">CPC</Text></th>
      </tr>
    </thead>
  );

  const renderChange = (value: number) => {
    const color = value >= 0 ? 'green' : 'red';
    const icon = value >= 0 ? '↗' : '↘'; // Simple arrow or custom icon
    return (
      <Text size="xs" c={color} ta="center">
        {icon} {Math.abs(value).toFixed(1)}%
      </Text>
    );
  };

  const renderTableRows = () => {
    if (loading) {
      return renderSkeletonRows();
    }

    return data.map((product) => (
      <tr key={product.id}>
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Text size="sm">{product.rank}</Text>
        </td>
        <td style={{ borderRight: '1px solid #dee2e6' }}>
          <Group gap="sm" wrap="nowrap">
            <Image
              src={product.image}
              w={40}
              h={40}
              radius="md"
              fallbackSrc="https://placehold.co/40x40?text=P"
            />
            <Stack gap={2}>
              <Text size="sm" fw={500} lineClamp={2} style={{ maxWidth: 110 }}>
                {product.title}
              </Text>
              <Text size="xs" c="dimmed">
                {product.asin}
              </Text>
            </Stack>
          </Group>
        </td>

        {/* Revenue */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm" fw={500}>{formatCurrency(product.revenue.total)}</Text>
            {renderChange(product.revenue.change)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm">{formatCurrency(product.revenue.ad)}</Text>
            {renderChange(product.revenue.adChange)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatCurrency(product.revenue.organic)}</Text>
            {renderChange(product.revenue.organicChange)}
          </Stack>
        </td>

        {/* Spend */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatCurrency(product.spend.value)}</Text>
            {renderChange(product.spend.change)}
          </Stack>
        </td>

        {/* Orders */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm" fw={500}>{formatNumber(product.orders.total)}</Text>
            {renderChange(product.orders.change)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm">{formatNumber(product.orders.ad)}</Text>
            {renderChange(product.orders.adChange)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatNumber(product.orders.organic)}</Text>
            {renderChange(product.orders.organicChange)}
          </Stack>
        </td>

        {/* Units */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm" fw={500}>{formatNumber(product.units.total)}</Text>
            {renderChange(product.units.change)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm">{formatNumber(product.units.ad)}</Text>
            {renderChange(product.units.adChange)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatNumber(product.units.organic)}</Text>
            {renderChange(product.units.organicChange)}
          </Stack>
        </td>

        {/* CR % */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatPercentage(product.cr.ad)}</Text>
            {renderChange(product.cr.change)}
          </Stack>
        </td>

        {/* CTR % */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatPercentage(product.ctr.ad)}</Text>
            {renderChange(product.ctr.change)}
          </Stack>
        </td>

        {/* AOV */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm" fw={500}>{formatCurrency(product.aov.total)}</Text>
            {renderChange(product.aov.change)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #f1f3f5' }}>
          <Stack gap={0}>
            <Text size="sm">{formatCurrency(product.aov.ad)}</Text>
            {renderChange(product.aov.adChange)}
          </Stack>
        </td>
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatCurrency(product.aov.organic)}</Text>
            {renderChange(product.aov.organicChange)}
          </Stack>
        </td>

        {/* ROAS */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{product.roas.ad.toFixed(2)}</Text>
            {renderChange(product.roas.change)}
          </Stack>
        </td>

        {/* ACOS */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatPercentage(product.acos.ad)}</Text>
            {renderChange(product.acos.change)}
          </Stack>
        </td>

        {/* TACOS */}
        <td style={{ textAlign: 'center', borderRight: '1px solid #dee2e6' }}>
          <Stack gap={0}>
            <Text size="sm">{formatPercentage(product.tacos.value)}</Text>
            {renderChange(product.tacos.change)}
          </Stack>
        </td>

        {/* CPC */}
        <td style={{ textAlign: 'center' }}>
          <Stack gap={0}>
            <Text size="sm">{formatCurrency(product.cpc.value)}</Text>
            {renderChange(product.cpc.change)}
          </Stack>
        </td>
      </tr>
    ));
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            Product Level Analysis
          </Text>
          <Group gap="sm">
          </Group>
        </Group>

        <Group gap="sm">
          <TextInput
            placeholder="Search Products..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Group>

        <ScrollArea type="always" offsetScrollbars>
          <Table striped highlightOnHover withTableBorder withColumnBorders style={{ minWidth: 2200 }}>
            {renderTableHeader()}
            <tbody>
              {renderTableRows()}
            </tbody>
          </Table>
        </ScrollArea>

        {totalPages > 1 && (
          <Group justify="center">
            <Pagination
              value={page}
              onChange={onPageChange}
              total={totalPages}
              size="sm"
            />
          </Group>
        )}
      </Stack>
    </Card>
  );
}