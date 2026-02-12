
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    Group,
    Menu,
    Select,
    Switch,
    Table,
    Tabs,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconBuildingStore,
    IconCheck,
    IconChevronDown,
    IconDots,
    IconPlus,
    IconRefresh,
    IconSearch,
    IconShoppingCart,
    IconSpeakerphone,
    IconTrash
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fadeIn } from '../animations';
import { ConnectAccountModal } from '../components/accounts/ConnectAccountModal';
import { apiClient } from '../services/api';

export default function Settings() {
    const [accountTypeFilter, setAccountTypeFilter] = useState<string | null>('All Types');
    const [syncStatusFilter, setSyncStatusFilter] = useState<string | null>('All');
    const [marketplaceFilter, setMarketplaceFilter] = useState<string | null>('All Marketplaces');
    const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>('All Statuses');
    const [searchQuery, setSearchQuery] = useState('');

    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [selectedAccountType, setSelectedAccountType] = useState<'Seller' | 'Vendor' | 'Advertising' | null>(null);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await apiClient.get('/oauth/accounts');
            if (response.data.success) {
                // Transform backend data to match table structure if needed
                const mappedAccounts = response.data.data.map((acc: any) => ({
                    id: acc.id,
                    sellerName: acc.account_name || 'My Store', // Fallback if name not stored
                    marketplace: acc.marketplace_id === 'ATVPDKIKX0DER' ? 'USA' : 'Unknown', // Basic mapping
                    accountType: acc.account_type === 'sp-api' ? 'Seller' : 'Advertising',
                    ads: acc.account_type === 'advertising-api',
                    sellerVendor: acc.account_type === 'sp-api',
                    syncStatus: acc.is_active ? 'synced' : 'not synced',
                    permissions: 'Owner', // Default
                    active: acc.is_active
                }));
                setAccounts(mappedAccounts);
            }
        } catch (error) {
            console.error('Failed to fetch accounts:', error);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleConnectClick = (type: 'Seller' | 'Vendor' | 'Advertising') => {
        setSelectedAccountType(type);
        setConnectModalOpen(true);
    };

    const filteredAccounts = accounts.filter(account => {
        let matchesType = true;
        let matchesSync = true;
        let matchesMarketplace = true;
        let matchesActive = true;
        let matchesSearch = true;

        // Account Type Filter
        if (accountTypeFilter && accountTypeFilter !== 'All Types') {
            matchesType = account.accountType === accountTypeFilter;
        }

        // Sync Status Filter
        if (syncStatusFilter && syncStatusFilter !== 'All') {
            matchesSync = account.syncStatus.toLowerCase() === syncStatusFilter.toLowerCase();
        }

        // Marketplace Filter
        if (marketplaceFilter && marketplaceFilter !== 'All Marketplaces') {
            matchesMarketplace = account.marketplace === marketplaceFilter;
        }

        // Active Status Filter
        if (activeStatusFilter && activeStatusFilter !== 'All Statuses') {
            const isActive = activeStatusFilter === 'Active';
            matchesActive = account.active === isActive;
        }

        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matchesSearch =
                account.sellerName.toLowerCase().includes(query) ||
                account.marketplace.toLowerCase().includes(query);
        }

        return matchesType && matchesSync && matchesMarketplace && matchesActive && matchesSearch;
    });

    const handleSyncClick = async (accountId: string) => {
        try {
            notifications.show({
                id: `sync-${accountId}`,
                loading: true,
                title: 'Sync Started',
                message: 'Initiating data synchronization...',
                autoClose: false,
                withCloseButton: false,
            });

            await apiClient.post(`/sync/${accountId}/trigger`, { jobType: 'FULL_SYNC' });

            notifications.update({
                id: `sync-${accountId}`,
                color: 'green',
                title: 'Sync Initiated',
                message: 'Data sync job has been queued successfully.',
                icon: <IconCheck size={16} />,
                loading: false,
                autoClose: 3000,
            });

            // Refresh list to potentially show updated status
            fetchAccounts();

        } catch (error) {
            notifications.update({
                id: `sync-${accountId}`,
                color: 'red',
                title: 'Sync Failed',
                message: 'Failed to start synchronization.',
                icon: <IconTrash size={16} />, // Using trash icon as error placeholder or X
                loading: false,
                autoClose: 3000,
            });
        }
    };

    const rows = filteredAccounts.map((account) => (
        <Table.Tr key={account.id}>
            <Table.Td>
                <Checkbox aria-label="Select account" />
            </Table.Td>
            <Table.Td>
                <Text fw={500}>{account.sellerName}</Text>
            </Table.Td>
            <Table.Td>{account.marketplace}</Table.Td>
            <Table.Td>{account.accountType}</Table.Td>
            <Table.Td>
                {account.ads ? <IconCheck color="green" size={20} /> : <Text c="dimmed">-</Text>}
            </Table.Td>
            <Table.Td>
                {account.sellerVendor ? <IconCheck color="green" size={20} /> : <Text c="dimmed">-</Text>}
            </Table.Td>
            <Table.Td>
                <Badge
                    color={
                        account.syncStatus === 'synced' ? 'green' :
                            account.syncStatus === 'pending' ? 'yellow' :
                                account.syncStatus === 'not synced' ? 'gray' : 'red'
                    }
                    variant="light"
                >
                    {account.syncStatus.toUpperCase()}
                </Badge>
            </Table.Td>
            <Table.Td>{account.permissions}</Table.Td>
            <Table.Td>
                <Switch defaultChecked={account.active} size="md" />
            </Table.Td>
            <Table.Td>
                <Menu position="bottom-end" shadow="md">
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                            <IconDots size={16} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => handleSyncClick(account.id)}>Sync Now</Menu.Item>
                        <Menu.Item leftSection={<IconTrash size={14} />} color="red">Remove</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Container fluid py="xl" px="lg">
            <ConnectAccountModal
                opened={connectModalOpen}
                onClose={() => setConnectModalOpen(false)}
                accountType={selectedAccountType}
            />
            <motion.div variants={fadeIn} initial="initial" animate="animate">
                {/* Header */}
                <Box mb={30}>
                    <Title order={2} fw={700}>Connect & Manage Accounts</Title>
                    <Text c="dimmed">Manage your connected Amazon seller and advertising accounts.</Text>
                </Box>

                {/* Tabs/Counters */}
                <Tabs
                    defaultValue="all"
                    mb="lg"
                    onChange={(value) => {
                        if (value === 'all') {
                            setActiveStatusFilter('All Statuses');
                            setSyncStatusFilter('All');
                        } else if (value === 'active') {
                            setActiveStatusFilter('Active');
                            setSyncStatusFilter('All');
                        } else if (value === 'inactive') {
                            setActiveStatusFilter('Inactive');
                            setSyncStatusFilter('All');
                        } else if (value === 'lost') {
                            setSyncStatusFilter('Lost Access');
                            setActiveStatusFilter('All Statuses');
                        }
                    }}
                >
                    <Tabs.List>
                        <Tabs.Tab value="all" rightSection={<Badge size="xs" circle>{accounts.length}</Badge>}>All</Tabs.Tab>
                        <Tabs.Tab value="active" rightSection={<Badge size="xs" circle>{accounts.filter(a => a.active).length}</Badge>}>Active</Tabs.Tab>
                        <Tabs.Tab value="inactive" rightSection={<Badge size="xs" circle>{accounts.filter(a => !a.active).length}</Badge>}>Inactive</Tabs.Tab>
                        <Tabs.Tab value="lost" rightSection={<Badge size="xs" circle>{accounts.filter(a => a.syncStatus === 'lost access').length}</Badge>}>Lost Access</Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                {/* Toolbar */}
                <Group justify="space-between" mb="lg">
                    {/* Search & Filters */}
                    <Group>
                        <TextInput
                            placeholder="Search by seller name or marketplace"
                            leftSection={<IconSearch size={16} />}
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.currentTarget.value)}
                            w={300}
                        />
                        <Select
                            placeholder="Account Type"
                            data={['All Types', 'Seller', 'Vendor']}
                            value={accountTypeFilter}
                            onChange={setAccountTypeFilter}
                            w={150}
                        />
                        <Select
                            placeholder="Marketplace"
                            data={['All Marketplaces', 'India', 'USA', 'UK', 'Canada']}
                            value={marketplaceFilter}
                            onChange={setMarketplaceFilter}
                            w={150}
                        />
                        <Select
                            placeholder="Sync Status"
                            data={['All', 'Synced', 'Pending', 'Not Synced', 'Lost Access']}
                            value={syncStatusFilter}
                            onChange={setSyncStatusFilter}
                            w={150}
                        />
                        <Select
                            placeholder="Active Status"
                            data={['All Statuses', 'Active', 'Inactive']}
                            value={activeStatusFilter}
                            onChange={setActiveStatusFilter}
                            w={150}
                        />
                    </Group>

                    {/* Actions */}
                    <Group>
                        <Button variant="default" leftSection={<IconRefresh size={16} />} onClick={fetchAccounts} loading={loading}>
                            Scan for New Accounts
                        </Button>
                        <Menu position="bottom-end" shadow="md" width={200}>
                            <Menu.Target>
                                <Button
                                    leftSection={<IconPlus size={16} />}
                                    rightSection={<IconChevronDown size={16} />}
                                >
                                    Connect New Account
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={<IconSpeakerphone size={16} />} onClick={() => handleConnectClick('Advertising')}>
                                    Advertising Account
                                </Menu.Item>
                                <Menu.Item leftSection={<IconShoppingCart size={16} />} onClick={() => handleConnectClick('Seller')}>
                                    Seller Account
                                </Menu.Item>
                                <Menu.Item leftSection={<IconBuildingStore size={16} />} onClick={() => handleConnectClick('Vendor')}>
                                    Vendor Account
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>

                {/* Table */}
                <Card withBorder radius="md" p={0}>
                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead bg="gray.0">
                            <Table.Tr>
                                <Table.Th w={40}>
                                    <Checkbox aria-label="Select all" />
                                </Table.Th>
                                <Table.Th>SELLER NAME</Table.Th>
                                <Table.Th>MARKETPLACE</Table.Th>
                                <Table.Th>ACCOUNT TYPE</Table.Th>
                                <Table.Th>ADS</Table.Th>
                                <Table.Th>SELLER/VENDOR</Table.Th>
                                <Table.Th>SYNC STATUS</Table.Th>
                                <Table.Th>PERMISSIONS</Table.Th>
                                <Table.Th>ACTIVE</Table.Th>
                                <Table.Th w={60}>ACTIONS</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Card>
            </motion.div>
        </Container>
    );
}
