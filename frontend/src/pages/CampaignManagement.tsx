import React, { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Paper,
  Group,
  Button,
  TextInput,
  Select,
  Table,
  Badge,
  ActionIcon,
  Modal,
  Stack,
  NumberInput,
  Switch,
  Pagination,
  Loader,
  Alert,
  Menu,
  Checkbox,
  Text,
  Flex,
  Card,
  Grid,
  Tooltip,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconPlayerPlay,
  IconPlayerPause,
  IconDownload,
  IconDots,
  IconRefresh,
  IconAlertCircle,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { campaignsService, Campaign as ApiCampaign } from '../services/campaignsService';
import { useAuthStore } from '../stores/authStore';

interface Campaign {
  id: string;
  name: string;
  type: 'SP' | 'SB' | 'SD';
  status: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  budget: number;
  budgetType: 'DAILY' | 'LIFETIME';
  targetingType: 'AUTO' | 'MANUAL';
  bidStrategy: 'LEGACY_FOR_SALES' | 'AUTO_FOR_SALES' | 'MANUAL';
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
  orders: number;
  acos: number;
  roas: number;
  ctr: number;
  cvr: number;
  cpc: number;
  createdAt: string;
  updatedAt: string;
}

interface CampaignFormData {
  name: string;
  type: 'SP' | 'SB' | 'SD';
  budget: number;
  budgetType: 'DAILY' | 'LIFETIME';
  targetingType: 'AUTO' | 'MANUAL';
  bidStrategy: 'LEGACY_FOR_SALES' | 'AUTO_FOR_SALES' | 'MANUAL';
  defaultBid?: number;
  startDate?: string;
  endDate?: string;
}

const CampaignManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    type: 'SP',
    budget: 0,
    budgetType: 'DAILY',
    targetingType: 'AUTO',
    bidStrategy: 'LEGACY_FOR_SALES',
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [bulkActionOpened, { open: openBulkAction, close: closeBulkAction }] = useDisclosure(false);

  // Mock data for development
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Summer Sale - Electronics',
      type: 'SP',
      status: 'ENABLED',
      budget: 100,
      budgetType: 'DAILY',
      targetingType: 'AUTO',
      bidStrategy: 'LEGACY_FOR_SALES',
      impressions: 15420,
      clicks: 234,
      spend: 45.67,
      sales: 234.56,
      orders: 12,
      acos: 19.47,
      roas: 5.14,
      ctr: 1.52,
      cvr: 5.13,
      cpc: 0.195,
      createdAt: '2024-01-15',
      updatedAt: '2024-12-06',
    },
    {
      id: '2',
      name: 'Brand Awareness Campaign',
      type: 'SB',
      status: 'PAUSED',
      budget: 200,
      budgetType: 'DAILY',
      targetingType: 'MANUAL',
      bidStrategy: 'AUTO_FOR_SALES',
      impressions: 8930,
      clicks: 156,
      spend: 78.23,
      sales: 456.78,
      orders: 8,
      acos: 17.12,
      roas: 5.84,
      ctr: 1.75,
      cvr: 5.13,
      cpc: 0.502,
      createdAt: '2024-02-01',
      updatedAt: '2024-12-05',
    },
  ];

  useEffect(() => {
    loadCampaigns();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignsService.list({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        targeting_type: typeFilter || undefined,
        page: currentPage,
        limit: 20,
      });
      
      // Map API response to component's Campaign type
      const mappedCampaigns: Campaign[] = response.data.map((camp: ApiCampaign) => ({
        id: camp.id,
        name: camp.name,
        type: 'SP' as const, // Default type since API doesn't have campaign type yet
        status: camp.status,
        budget: camp.daily_budget,
        budgetType: 'DAILY' as const,
        targetingType: camp.targeting_type,
        bidStrategy: 'LEGACY_FOR_SALES' as const, // Default bid strategy
        impressions: 0, // Will be fetched from performance metrics
        clicks: 0,
        spend: 0,
        sales: 0,
        orders: 0,
        acos: 0,
        roas: 0,
        ctr: 0,
        cvr: 0,
        cpc: 0,
        createdAt: camp.created_at,
        updatedAt: camp.updated_at,
      }));
      
      setCampaigns(mappedCampaigns);
      // Calculate total pages from response (if pagination data is available)
      setTotalPages(Math.ceil((response.data.length || 0) / 20));
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load campaigns. Using mock data.',
        color: 'red',
        icon: <IconX />,
      });
      // Fallback to mock data on error
      setCampaigns(mockCampaigns);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Use user ID as account ID for now (will be updated when accounts system is implemented)
      await campaignsService.create({
        account_id: user.id,
        name: formData.name,
        targeting_type: formData.targetingType,
        daily_budget: formData.budget,
        start_date: formData.startDate || new Date().toISOString().split('T')[0],
        end_date: formData.endDate,
        status: 'ENABLED',
      });

      notifications.show({
        title: 'Success',
        message: 'Campaign created successfully',
        color: 'green',
        icon: <IconCheck />,
      });
      close();
      loadCampaigns();
    } catch (error: any) {
      console.error('Failed to create campaign:', error);
      notifications.show({
        title: 'Error',
        message: error?.response?.data?.error?.message || 'Failed to create campaign',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleUpdateCampaign = async () => {
    try {
      if (!editingCampaign) return;

      await campaignsService.update(editingCampaign.id, {
        name: formData.name,
        daily_budget: formData.budget,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: editingCampaign.status,
      });

      notifications.show({
        title: 'Success',
        message: 'Campaign updated successfully',
        color: 'green',
        icon: <IconCheck />,
      });
      close();
      loadCampaigns();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update campaign',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await campaignsService.delete(campaignId);
      notifications.show({
        title: 'Success',
        message: 'Campaign deleted successfully',
        color: 'green',
        icon: <IconCheck />,
      });
      loadCampaigns();
    } catch (error: any) {
      console.error('Failed to delete campaign:', error);
      notifications.show({
        title: 'Error',
        message: error?.response?.data?.error?.message || 'Failed to delete campaign',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: 'ENABLED' | 'PAUSED') => {
    try {
      await campaignsService.update(campaignId, { status: newStatus });
      console.log('Changing campaign status:', campaignId, newStatus);
      notifications.show({
        title: 'Success',
        message: `Campaign ${newStatus.toLowerCase()} successfully`,
        color: 'green',
        icon: <IconCheck />,
      });
      loadCampaigns();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update campaign status',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      // TODO: Replace with actual API call
      console.log('Bulk action:', action, selectedCampaigns);
      notifications.show({
        title: 'Success',
        message: `Bulk ${action} completed successfully`,
        color: 'green',
        icon: <IconCheck />,
      });
      setSelectedCampaigns([]);
      closeBulkAction();
      loadCampaigns();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to perform bulk ${action}`,
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      type: 'SP',
      budget: 0,
      budgetType: 'DAILY',
      targetingType: 'AUTO',
      bidStrategy: 'LEGACY_FOR_SALES',
    });
    open();
  };

  const openEditModal = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      type: campaign.type,
      budget: campaign.budget,
      budgetType: campaign.budgetType,
      targetingType: campaign.targetingType,
      bidStrategy: campaign.bidStrategy,
    });
    open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENABLED': return 'green';
      case 'PAUSED': return 'yellow';
      case 'ARCHIVED': return 'gray';
      default: return 'blue';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SP': return 'blue';
      case 'SB': return 'purple';
      case 'SD': return 'orange';
      default: return 'gray';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || campaign.status === statusFilter;
    const matchesType = !typeFilter || campaign.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Campaign Management</Title>
          <Group>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              onClick={loadCampaigns}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateModal}
            >
              Create Campaign
            </Button>
          </Group>
        </Group>

        {/* Filters */}
        <Paper p="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                placeholder="Search campaigns..."
                leftSection={<IconSearch size={16} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Filter by status"
                data={[
                  { value: '', label: 'All Statuses' },
                  { value: 'ENABLED', label: 'Enabled' },
                  { value: 'PAUSED', label: 'Paused' },
                  { value: 'ARCHIVED', label: 'Archived' },
                ]}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value || '')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Select
                placeholder="Filter by type"
                data={[
                  { value: '', label: 'All Types' },
                  { value: 'SP', label: 'Sponsored Products' },
                  { value: 'SB', label: 'Sponsored Brands' },
                  { value: 'SD', label: 'Sponsored Display' },
                ]}
                value={typeFilter}
                onChange={(value) => setTypeFilter(value || '')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              {selectedCampaigns.length > 0 && (
                <Button
                  variant="light"
                  leftSection={<IconFilter size={16} />}
                  onClick={openBulkAction}
                >
                  Bulk Actions ({selectedCampaigns.length})
                </Button>
              )}
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Campaign Stats Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card withBorder>
              <Text size="sm" c="dimmed">Total Campaigns</Text>
              <Text size="xl" fw={700}>{campaigns.length}</Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card withBorder>
              <Text size="sm" c="dimmed">Active Campaigns</Text>
              <Text size="xl" fw={700} c="green">
                {campaigns.filter(c => c.status === 'ENABLED').length}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card withBorder>
              <Text size="sm" c="dimmed">Total Spend</Text>
              <Text size="xl" fw={700}>
                ${campaigns.reduce((sum, c) => sum + c.spend, 0).toFixed(2)}
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card withBorder>
              <Text size="sm" c="dimmed">Average ACoS</Text>
              <Text size="xl" fw={700}>
                {campaigns.length > 0 
                  ? (campaigns.reduce((sum, c) => sum + c.acos, 0) / campaigns.length).toFixed(2)
                  : '0.00'
                }%
              </Text>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Campaigns Table */}
        <Paper withBorder>
          {loading ? (
            <Flex justify="center" p="xl">
              <Loader />
            </Flex>
          ) : filteredCampaigns.length === 0 ? (
            <Alert icon={<IconAlertCircle />} title="No campaigns found" color="blue" m="md">
              {campaigns.length === 0 
                ? "You haven't created any campaigns yet. Click 'Create Campaign' to get started."
                : "No campaigns match your current filters. Try adjusting your search criteria."
              }
            </Alert>
          ) : (
            <Table.ScrollContainer minWidth={1200}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>
                      <Checkbox
                        checked={selectedCampaigns.length === filteredCampaigns.length}
                        indeterminate={selectedCampaigns.length > 0 && selectedCampaigns.length < filteredCampaigns.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampaigns(filteredCampaigns.map(c => c.id));
                          } else {
                            setSelectedCampaigns([]);
                          }
                        }}
                      />
                    </Table.Th>
                    <Table.Th>Campaign Name</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Budget</Table.Th>
                    <Table.Th>Impressions</Table.Th>
                    <Table.Th>Clicks</Table.Th>
                    <Table.Th>Spend</Table.Th>
                    <Table.Th>Sales</Table.Th>
                    <Table.Th>ACoS</Table.Th>
                    <Table.Th>RoAS</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredCampaigns.map((campaign) => (
                    <Table.Tr key={campaign.id}>
                      <Table.Td>
                        <Checkbox
                          checked={selectedCampaigns.includes(campaign.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCampaigns([...selectedCampaigns, campaign.id]);
                            } else {
                              setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaign.id));
                            }
                          }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>{campaign.name}</Text>
                        <Text size="xs" c="dimmed">{campaign.targetingType}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getTypeColor(campaign.type)} variant="light">
                          {campaign.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(campaign.status)} variant="light">
                          {campaign.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text>${campaign.budget}</Text>
                        <Text size="xs" c="dimmed">{campaign.budgetType}</Text>
                      </Table.Td>
                      <Table.Td>{campaign.impressions.toLocaleString()}</Table.Td>
                      <Table.Td>{campaign.clicks.toLocaleString()}</Table.Td>
                      <Table.Td>${campaign.spend.toFixed(2)}</Table.Td>
                      <Table.Td>${campaign.sales.toFixed(2)}</Table.Td>
                      <Table.Td>
                        <Text c={campaign.acos > 25 ? 'red' : 'green'}>
                          {campaign.acos.toFixed(2)}%
                        </Text>
                      </Table.Td>
                      <Table.Td>{campaign.roas.toFixed(2)}</Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label={campaign.status === 'ENABLED' ? 'Pause' : 'Enable'}>
                            <ActionIcon
                              variant="light"
                              color={campaign.status === 'ENABLED' ? 'yellow' : 'green'}
                              onClick={() => handleStatusChange(
                                campaign.id,
                                campaign.status === 'ENABLED' ? 'PAUSED' : 'ENABLED'
                              )}
                            >
                              {campaign.status === 'ENABLED' ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Edit">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={() => openEditModal(campaign)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Menu>
                            <Menu.Target>
                              <ActionIcon variant="light" color="gray">
                                <IconDots size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                leftSection={<IconDownload size={16} />}
                                onClick={() => console.log('Export campaign:', campaign.id)}
                              >
                                Export Data
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconTrash size={16} />}
                                color="red"
                                onClick={() => handleDeleteCampaign(campaign.id)}
                              >
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          )}
        </Paper>

        {/* Pagination */}
        {totalPages > 1 && (
          <Flex justify="center">
            <Pagination
              value={currentPage}
              onChange={setCurrentPage}
              total={totalPages}
            />
          </Flex>
        )}
      </Stack>

      {/* Create/Edit Campaign Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Campaign Name"
            placeholder="Enter campaign name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Campaign Type"
            data={[
              { value: 'SP', label: 'Sponsored Products' },
              { value: 'SB', label: 'Sponsored Brands' },
              { value: 'SD', label: 'Sponsored Display' },
            ]}
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as any })}
            required
          />

          <Group grow>
            <NumberInput
              label="Budget"
              placeholder="Enter budget amount"
              value={formData.budget}
              onChange={(value) => setFormData({ ...formData, budget: Number(value) })}
              min={0}
              step={0.01}
              prefix="$"
              required
            />
            <Select
              label="Budget Type"
              data={[
                { value: 'DAILY', label: 'Daily' },
                { value: 'LIFETIME', label: 'Lifetime' },
              ]}
              value={formData.budgetType}
              onChange={(value) => setFormData({ ...formData, budgetType: value as any })}
              required
            />
          </Group>

          <Select
            label="Targeting Type"
            data={[
              { value: 'AUTO', label: 'Automatic' },
              { value: 'MANUAL', label: 'Manual' },
            ]}
            value={formData.targetingType}
            onChange={(value) => setFormData({ ...formData, targetingType: value as any })}
            required
          />

          <Select
            label="Bid Strategy"
            data={[
              { value: 'LEGACY_FOR_SALES', label: 'Legacy for Sales' },
              { value: 'AUTO_FOR_SALES', label: 'Auto for Sales' },
              { value: 'MANUAL', label: 'Manual' },
            ]}
            value={formData.bidStrategy}
            onChange={(value) => setFormData({ ...formData, bidStrategy: value as any })}
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
            >
              {editingCampaign ? 'Update' : 'Create'} Campaign
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal
        opened={bulkActionOpened}
        onClose={closeBulkAction}
        title="Bulk Actions"
      >
        <Stack gap="md">
          <Text>
            Perform bulk actions on {selectedCampaigns.length} selected campaign(s):
          </Text>
          
          <Group>
            <Button
              variant="light"
              color="green"
              onClick={() => handleBulkAction('enable')}
            >
              Enable All
            </Button>
            <Button
              variant="light"
              color="yellow"
              onClick={() => handleBulkAction('pause')}
            >
              Pause All
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={() => handleBulkAction('delete')}
            >
              Delete All
            </Button>
          </Group>

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeBulkAction}>
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default CampaignManagement;