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
  Tabs,
  Progress,
  RingProgress,
  Center,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconDownload,
  IconDots,
  IconRefresh,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconTrendingUp,
  IconTrendingDown,
  IconTarget,
  IconBulb,
  IconEye,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { keywordsService, Keyword as ApiKeyword } from '../services/keywordsService';

interface Keyword {
  id: string;
  keyword: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  status: 'ENABLED' | 'PAUSED' | 'ARCHIVED';
  bid: number;
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
  position: number;
  qualityScore: number;
  searchVolume: number;
  competition: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

interface OpportunityKeyword {
  keyword: string;
  searchVolume: number;
  competition: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedBid: number;
  relevanceScore: number;
  category: string;
  source: 'AMAZON_SUGGESTED' | 'COMPETITOR_ANALYSIS' | 'SEARCH_TERMS';
}

interface KeywordFormData {
  keyword: string;
  campaignId: string;
  adGroupId: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  bid: number;
}

const KeywordManagement: React.FC = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [opportunityKeywords, setOpportunityKeywords] = useState<OpportunityKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [matchTypeFilter, setMatchTypeFilter] = useState<string>('');
  const [campaignFilter, setCampaignFilter] = useState<string>('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const [activeTab, setActiveTab] = useState('keywords');
  const [formData, setFormData] = useState<KeywordFormData>({
    keyword: '',
    campaignId: '',
    adGroupId: '',
    matchType: 'EXACT',
    bid: 0,
  });

  const [opened, { open, close }] = useDisclosure(false);
  const [bulkActionOpened, { open: openBulkAction, close: closeBulkAction }] = useDisclosure(false);

  // Mock data for development
  const mockKeywords: Keyword[] = [
    {
      id: '1',
      keyword: 'wireless headphones',
      campaignId: '1',
      campaignName: 'Summer Sale - Electronics',
      adGroupId: '1',
      adGroupName: 'Audio Products',
      matchType: 'EXACT',
      status: 'ENABLED',
      bid: 1.25,
      impressions: 5420,
      clicks: 134,
      spend: 167.50,
      sales: 834.56,
      orders: 8,
      acos: 20.07,
      roas: 4.98,
      ctr: 2.47,
      cvr: 5.97,
      cpc: 1.25,
      position: 3.2,
      qualityScore: 8.5,
      searchVolume: 45000,
      competition: 'HIGH',
      createdAt: '2024-01-15',
      updatedAt: '2024-12-06',
    },
    {
      id: '2',
      keyword: 'bluetooth earbuds',
      campaignId: '1',
      campaignName: 'Summer Sale - Electronics',
      adGroupId: '1',
      adGroupName: 'Audio Products',
      matchType: 'PHRASE',
      status: 'ENABLED',
      bid: 0.95,
      impressions: 3210,
      clicks: 89,
      spend: 84.55,
      sales: 456.78,
      orders: 5,
      acos: 18.51,
      roas: 5.40,
      ctr: 2.77,
      cvr: 5.62,
      cpc: 0.95,
      position: 4.1,
      qualityScore: 7.8,
      searchVolume: 32000,
      competition: 'MEDIUM',
      createdAt: '2024-01-20',
      updatedAt: '2024-12-05',
    },
  ];

  const mockOpportunityKeywords: OpportunityKeyword[] = [
    {
      keyword: 'noise cancelling headphones',
      searchVolume: 67000,
      competition: 'HIGH',
      suggestedBid: 1.45,
      relevanceScore: 9.2,
      category: 'Audio',
      source: 'AMAZON_SUGGESTED',
    },
    {
      keyword: 'gaming headset',
      searchVolume: 54000,
      competition: 'MEDIUM',
      suggestedBid: 1.15,
      relevanceScore: 8.7,
      category: 'Gaming',
      source: 'COMPETITOR_ANALYSIS',
    },
    {
      keyword: 'wireless earphones',
      searchVolume: 41000,
      competition: 'MEDIUM',
      suggestedBid: 0.85,
      relevanceScore: 8.9,
      category: 'Audio',
      source: 'SEARCH_TERMS',
    },
  ];

  useEffect(() => {
    loadKeywords();
    loadOpportunityKeywords();
  }, [currentPage, searchTerm, statusFilter, matchTypeFilter, campaignFilter]);

  const loadKeywords = async () => {
    setLoading(true);
    try {
      const response = await keywordsService.list({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        match_type: matchTypeFilter || undefined,
        campaign_id: campaignFilter || undefined,
        page: currentPage,
        limit: 20,
      });

      // Map API response to component's Keyword type
      const mappedKeywords = response.data.map((kw: ApiKeyword) => ({
        id: kw.id,
        keyword: kw.keyword_text,
        campaignId: kw.campaign_id,
        campaignName: 'Campaign', // Will need to fetch campaign details separately
        adGroupId: kw.ad_group_id || '',
        adGroupName: 'Ad Group', // Will need to fetch ad group details separately
        matchType: kw.match_type,
        status: kw.status,
        bid: kw.bid,
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
        position: 0,
        qualityScore: 0,
        searchVolume: 0,
        competition: 'MEDIUM' as const,
        createdAt: kw.created_at,
        updatedAt: kw.updated_at,
      }));

      setKeywords(mappedKeywords);
      setTotalPages(Math.ceil((response.data.length || 0) / 20));
    } catch (error) {
      console.error('Failed to load keywords:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load keywords. Using mock data.',
        color: 'red',
        icon: <IconX />,
      });
      // Fallback to mock data on error
      setKeywords(mockKeywords);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadOpportunityKeywords = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setOpportunityKeywords(mockOpportunityKeywords);
    } catch (error) {
      console.error('Failed to load opportunity keywords:', error);
    }
  };

  const handleCreateKeyword = async () => {
    try {
      await keywordsService.create({
        campaign_id: formData.campaignId,
        ad_group_id: formData.adGroupId,
        keyword_text: formData.keyword,
        match_type: formData.matchType,
        bid: formData.bid,
        status: 'ENABLED',
      });

      notifications.show({
        title: 'Success',
        message: 'Keyword created successfully',
        color: 'green',
        icon: <IconCheck />,
      });
      close();
      loadKeywords();
    } catch (error: any) {
      console.error('Failed to create keyword:', error);
      notifications.show({
        title: 'Error',
        message: error?.response?.data?.error?.message || 'Failed to create keyword',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleUpdateKeyword = async () => {
    try {
      if (!editingKeyword) return;

      await keywordsService.update(editingKeyword.id, {
        keyword_text: formData.keyword,
        match_type: formData.matchType,
        bid: formData.bid,
        status: editingKeyword.status,
      });

      notifications.show({
        title: 'Success',
        message: 'Keyword updated successfully',
        color: 'green',
        icon: <IconCheck />,
      });
      close();
      loadKeywords();
    } catch (error: any) {
      console.error('Failed to update keyword:', error);
      notifications.show({
        title: 'Error',
        message: error?.response?.data?.error?.message || 'Failed to update keyword',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleDeleteKeyword = async (keywordId: string) => {
    try {
      await keywordsService.delete(keywordId);
      notifications.show({
        title: 'Success',
        message: 'Keyword deleted successfully',
        color: 'green',
        icon: <IconCheck />,
      });
      loadKeywords();
    } catch (error: any) {
      console.error('Failed to delete keyword:', error);
      notifications.show({
        title: 'Error',
        message: error?.response?.data?.error?.message || 'Failed to delete keyword',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      if (selectedKeywords.length === 0) return;

      if (action === 'enable' || action === 'pause' || action === 'archive') {
        const status = action === 'enable' ? 'ENABLED' : action === 'pause' ? 'PAUSED' : 'ARCHIVED';
        await keywordsService.bulkUpdate({
          keyword_ids: selectedKeywords,
          updates: { status },
        });
      }
      console.log('Bulk action:', action, selectedKeywords);
      notifications.show({
        title: 'Success',
        message: `Bulk ${action} completed successfully`,
        color: 'green',
        icon: <IconCheck />,
      });
      setSelectedKeywords([]);
      closeBulkAction();
      loadKeywords();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: `Failed to perform bulk ${action}`,
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const handleAddOpportunityKeyword = async (opportunityKeyword: OpportunityKeyword) => {
    try {
      // TODO: Replace with actual API call
      console.log('Adding opportunity keyword:', opportunityKeyword);
      notifications.show({
        title: 'Success',
        message: 'Keyword added to campaign successfully',
        color: 'green',
        icon: <IconCheck />,
      });
      loadKeywords();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add keyword',
        color: 'red',
        icon: <IconX />,
      });
    }
  };

  const openCreateModal = () => {
    setEditingKeyword(null);
    setFormData({
      keyword: '',
      campaignId: '',
      adGroupId: '',
      matchType: 'EXACT',
      bid: 0,
    });
    open();
  };

  const openEditModal = (keyword: Keyword) => {
    setEditingKeyword(keyword);
    setFormData({
      keyword: keyword.keyword,
      campaignId: keyword.campaignId,
      adGroupId: keyword.adGroupId,
      matchType: keyword.matchType,
      bid: keyword.bid,
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

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'EXACT': return 'blue';
      case 'PHRASE': return 'green';
      case 'BROAD': return 'orange';
      default: return 'gray';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'LOW': return 'green';
      case 'MEDIUM': return 'yellow';
      case 'HIGH': return 'red';
      default: return 'gray';
    }
  };

  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         keyword.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || keyword.status === statusFilter;
    const matchesMatchType = !matchTypeFilter || keyword.matchType === matchTypeFilter;
    const matchesCampaign = !campaignFilter || keyword.campaignId === campaignFilter;
    return matchesSearch && matchesStatus && matchesMatchType && matchesCampaign;
  });

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>Keyword Management</Title>
          <Group>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              onClick={loadKeywords}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateModal}
            >
              Add Keyword
            </Button>
          </Group>
        </Group>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="keywords" leftSection={<IconTarget size={16} />}>
              Keywords ({keywords.length})
            </Tabs.Tab>
            <Tabs.Tab value="opportunities" leftSection={<IconBulb size={16} />}>
              Opportunities ({opportunityKeywords.length})
            </Tabs.Tab>
            <Tabs.Tab value="analytics" leftSection={<IconTrendingUp size={16} />}>
              Analytics
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="keywords">
            <Stack gap="md" mt="md">
              {/* Filters */}
              <Paper p="md" withBorder>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <TextInput
                      placeholder="Search keywords..."
                      leftSection={<IconSearch size={16} />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 2 }}>
                    <Select
                      placeholder="Status"
                      data={[
                        { value: '', label: 'All' },
                        { value: 'ENABLED', label: 'Enabled' },
                        { value: 'PAUSED', label: 'Paused' },
                        { value: 'ARCHIVED', label: 'Archived' },
                      ]}
                      value={statusFilter}
                      onChange={(value) => setStatusFilter(value || '')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 2 }}>
                    <Select
                      placeholder="Match Type"
                      data={[
                        { value: '', label: 'All' },
                        { value: 'EXACT', label: 'Exact' },
                        { value: 'PHRASE', label: 'Phrase' },
                        { value: 'BROAD', label: 'Broad' },
                      ]}
                      value={matchTypeFilter}
                      onChange={(value) => setMatchTypeFilter(value || '')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Select
                      placeholder="Campaign"
                      data={[
                        { value: '', label: 'All Campaigns' },
                        { value: '1', label: 'Summer Sale - Electronics' },
                        { value: '2', label: 'Brand Awareness Campaign' },
                      ]}
                      value={campaignFilter}
                      onChange={(value) => setCampaignFilter(value || '')}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 2 }}>
                    {selectedKeywords.length > 0 && (
                      <Button
                        variant="light"
                        leftSection={<IconFilter size={16} />}
                        onClick={openBulkAction}
                      >
                        Bulk ({selectedKeywords.length})
                      </Button>
                    )}
                  </Grid.Col>
                </Grid>
              </Paper>

              {/* Keyword Stats Cards */}
              <Grid>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Card withBorder>
                    <Text size="sm" c="dimmed">Total Keywords</Text>
                    <Text size="xl" fw={700}>{keywords.length}</Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Card withBorder>
                    <Text size="sm" c="dimmed">Active Keywords</Text>
                    <Text size="xl" fw={700} c="green">
                      {keywords.filter(k => k.status === 'ENABLED').length}
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Card withBorder>
                    <Text size="sm" c="dimmed">Avg. Quality Score</Text>
                    <Text size="xl" fw={700}>
                      {keywords.length > 0 
                        ? (keywords.reduce((sum, k) => sum + k.qualityScore, 0) / keywords.length).toFixed(1)
                        : '0.0'
                      }
                    </Text>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 3 }}>
                  <Card withBorder>
                    <Text size="sm" c="dimmed">Avg. Position</Text>
                    <Text size="xl" fw={700}>
                      {keywords.length > 0 
                        ? (keywords.reduce((sum, k) => sum + k.position, 0) / keywords.length).toFixed(1)
                        : '0.0'
                      }
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>

              {/* Keywords Table */}
              <Paper withBorder>
                {loading ? (
                  <Flex justify="center" p="xl">
                    <Loader />
                  </Flex>
                ) : filteredKeywords.length === 0 ? (
                  <Alert icon={<IconAlertCircle />} title="No keywords found" color="blue" m="md">
                    {keywords.length === 0 
                      ? "You haven't added any keywords yet. Click 'Add Keyword' to get started."
                      : "No keywords match your current filters. Try adjusting your search criteria."
                    }
                  </Alert>
                ) : (
                  <Table.ScrollContainer minWidth={1400}>
                    <Table striped highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>
                            <Checkbox
                              checked={selectedKeywords.length === filteredKeywords.length}
                              indeterminate={selectedKeywords.length > 0 && selectedKeywords.length < filteredKeywords.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedKeywords(filteredKeywords.map(k => k.id));
                                } else {
                                  setSelectedKeywords([]);
                                }
                              }}
                            />
                          </Table.Th>
                          <Table.Th>Keyword</Table.Th>
                          <Table.Th>Campaign</Table.Th>
                          <Table.Th>Match Type</Table.Th>
                          <Table.Th>Status</Table.Th>
                          <Table.Th>Bid</Table.Th>
                          <Table.Th>Position</Table.Th>
                          <Table.Th>Quality Score</Table.Th>
                          <Table.Th>Impressions</Table.Th>
                          <Table.Th>Clicks</Table.Th>
                          <Table.Th>Spend</Table.Th>
                          <Table.Th>Sales</Table.Th>
                          <Table.Th>ACoS</Table.Th>
                          <Table.Th>Actions</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {filteredKeywords.map((keyword) => (
                          <Table.Tr key={keyword.id}>
                            <Table.Td>
                              <Checkbox
                                checked={selectedKeywords.includes(keyword.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedKeywords([...selectedKeywords, keyword.id]);
                                  } else {
                                    setSelectedKeywords(selectedKeywords.filter(id => id !== keyword.id));
                                  }
                                }}
                              />
                            </Table.Td>
                            <Table.Td>
                              <Text fw={500}>{keyword.keyword}</Text>
                              <Text size="xs" c="dimmed">
                                {keyword.searchVolume.toLocaleString()} searches/month
                              </Text>
                            </Table.Td>
                            <Table.Td>
                              <Text size="sm">{keyword.campaignName}</Text>
                              <Text size="xs" c="dimmed">{keyword.adGroupName}</Text>
                            </Table.Td>
                            <Table.Td>
                              <Badge color={getMatchTypeColor(keyword.matchType)} variant="light">
                                {keyword.matchType}
                              </Badge>
                            </Table.Td>
                            <Table.Td>
                              <Badge color={getStatusColor(keyword.status)} variant="light">
                                {keyword.status}
                              </Badge>
                            </Table.Td>
                            <Table.Td>${keyword.bid.toFixed(2)}</Table.Td>
                            <Table.Td>
                              <Text c={keyword.position <= 3 ? 'green' : keyword.position <= 10 ? 'yellow' : 'red'}>
                                {keyword.position.toFixed(1)}
                              </Text>
                            </Table.Td>
                            <Table.Td>
                              <Group gap="xs">
                                <Text size="sm">{keyword.qualityScore.toFixed(1)}</Text>
                                <Progress
                                  value={keyword.qualityScore * 10}
                                  size="xs"
                                  color={keyword.qualityScore >= 8 ? 'green' : keyword.qualityScore >= 6 ? 'yellow' : 'red'}
                                  style={{ width: 40 }}
                                />
                              </Group>
                            </Table.Td>
                            <Table.Td>{keyword.impressions.toLocaleString()}</Table.Td>
                            <Table.Td>{keyword.clicks.toLocaleString()}</Table.Td>
                            <Table.Td>${keyword.spend.toFixed(2)}</Table.Td>
                            <Table.Td>${keyword.sales.toFixed(2)}</Table.Td>
                            <Table.Td>
                              <Text c={keyword.acos > 25 ? 'red' : 'green'}>
                                {keyword.acos.toFixed(2)}%
                              </Text>
                            </Table.Td>
                            <Table.Td>
                              <Group gap="xs">
                                <Tooltip label="Edit">
                                  <ActionIcon
                                    variant="light"
                                    color="blue"
                                    onClick={() => openEditModal(keyword)}
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
                                      leftSection={<IconEye size={16} />}
                                      onClick={() => console.log('View details:', keyword.id)}
                                    >
                                      View Details
                                    </Menu.Item>
                                    <Menu.Item
                                      leftSection={<IconDownload size={16} />}
                                      onClick={() => console.log('Export keyword:', keyword.id)}
                                    >
                                      Export Data
                                    </Menu.Item>
                                    <Menu.Item
                                      leftSection={<IconTrash size={16} />}
                                      color="red"
                                      onClick={() => handleDeleteKeyword(keyword.id)}
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
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="opportunities">
            <Stack gap="md" mt="md">
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Keyword Opportunities</Title>
                <Text size="sm" c="dimmed" mb="md">
                  Discover high-potential keywords based on Amazon suggestions, competitor analysis, and search term data.
                </Text>
                
                <Grid>
                  {opportunityKeywords.map((opportunity, index) => (
                    <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
                      <Card withBorder p="md">
                        <Stack gap="sm">
                          <Group justify="space-between">
                            <Text fw={500} size="sm">{opportunity.keyword}</Text>
                            <Badge size="xs" color={getCompetitionColor(opportunity.competition)}>
                              {opportunity.competition}
                            </Badge>
                          </Group>
                          
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">Search Volume</Text>
                            <Text size="xs" fw={500}>{opportunity.searchVolume.toLocaleString()}</Text>
                          </Group>
                          
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">Suggested Bid</Text>
                            <Text size="xs" fw={500}>${opportunity.suggestedBid.toFixed(2)}</Text>
                          </Group>
                          
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">Relevance Score</Text>
                            <Group gap="xs">
                              <Text size="xs" fw={500}>{opportunity.relevanceScore.toFixed(1)}</Text>
                              <RingProgress
                                size={20}
                                thickness={3}
                                sections={[{ value: opportunity.relevanceScore * 10, color: 'blue' }]}
                              />
                            </Group>
                          </Group>
                          
                          <Group justify="space-between">
                            <Badge size="xs" variant="light">{opportunity.source.replace('_', ' ')}</Badge>
                            <Button
                              size="xs"
                              variant="light"
                              onClick={() => handleAddOpportunityKeyword(opportunity)}
                            >
                              Add
                            </Button>
                          </Group>
                        </Stack>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="analytics">
            <Stack gap="md" mt="md">
              <Paper p="md" withBorder>
                <Title order={4} mb="md">Keyword Performance Analytics</Title>
                <Text c="dimmed">
                  Advanced analytics and insights coming soon...
                </Text>
              </Paper>
            </Stack>
          </Tabs.Panel>
        </Tabs>

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

      {/* Create/Edit Keyword Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={editingKeyword ? 'Edit Keyword' : 'Add Keyword'}
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Keyword"
            placeholder="Enter keyword"
            value={formData.keyword}
            onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
            required
          />

          <Select
            label="Campaign"
            placeholder="Select campaign"
            data={[
              { value: '1', label: 'Summer Sale - Electronics' },
              { value: '2', label: 'Brand Awareness Campaign' },
            ]}
            value={formData.campaignId}
            onChange={(value) => setFormData({ ...formData, campaignId: value || '' })}
            required
          />

          <Select
            label="Ad Group"
            placeholder="Select ad group"
            data={[
              { value: '1', label: 'Audio Products' },
              { value: '2', label: 'Gaming Accessories' },
            ]}
            value={formData.adGroupId}
            onChange={(value) => setFormData({ ...formData, adGroupId: value || '' })}
            required
          />

          <Select
            label="Match Type"
            data={[
              { value: 'EXACT', label: 'Exact Match' },
              { value: 'PHRASE', label: 'Phrase Match' },
              { value: 'BROAD', label: 'Broad Match' },
            ]}
            value={formData.matchType}
            onChange={(value) => setFormData({ ...formData, matchType: value as any })}
            required
          />

          <NumberInput
            label="Bid"
            placeholder="Enter bid amount"
            value={formData.bid}
            onChange={(value) => setFormData({ ...formData, bid: Number(value) })}
            min={0}
            step={0.01}
            prefix="$"
            required
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={editingKeyword ? handleUpdateKeyword : handleCreateKeyword}
            >
              {editingKeyword ? 'Update' : 'Add'} Keyword
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
            Perform bulk actions on {selectedKeywords.length} selected keyword(s):
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
              color="blue"
              onClick={() => handleBulkAction('update-bids')}
            >
              Update Bids
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

export default KeywordManagement;