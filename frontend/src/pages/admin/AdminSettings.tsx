import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  Stack,
  Select,
  Textarea,
  Switch,
  LoadingOverlay,
  ActionIcon,
  Tabs,
  Badge,
} from '@mantine/core';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: string;
  category: string;
  description: string;
  is_public: boolean;
}

interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  is_enabled: boolean;
  rollout_percentage: number;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    type: 'string',
    category: '',
    description: '',
    is_public: false,
  });

  useEffect(() => {
    loadSettings();
    loadFlags();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(response.data.data);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load settings',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFlags = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/settings/flags/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlags(response.data.data);
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    }
  };

  const handleCreateSetting = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/settings`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notifications.show({
        title: 'Success',
        message: 'Setting created successfully',
        color: 'green',
      });

      setModalOpened(false);
      resetForm();
      loadSettings();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to create setting',
        color: 'red',
      });
    }
  };

  const handleDeleteSetting = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/settings/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notifications.show({
        title: 'Success',
        message: 'Setting deleted successfully',
        color: 'green',
      });

      loadSettings();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to delete setting',
        color: 'red',
      });
    }
  };

  const handleToggleFlag = async (flag: FeatureFlag) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/admin/settings/flags/${flag.id}`,
        { is_enabled: !flag.is_enabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notifications.show({
        title: 'Success',
        message: 'Feature flag updated successfully',
        color: 'green',
      });

      loadFlags();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to update feature flag',
        color: 'red',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      value: '',
      type: 'string',
      category: '',
      description: '',
      is_public: false,
    });
  };

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">
        System Settings
      </Title>

      <Tabs defaultValue="settings">
        <Tabs.List>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
          <Tabs.Tab value="flags">Feature Flags</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="settings" pt="xl">
          <Group position="apart" mb="md">
            <div />
            <Button leftIcon={<IconPlus size={16} />} onClick={() => setModalOpened(true)}>
              Create Setting
            </Button>
          </Group>

          <Paper shadow="sm" withBorder style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Public</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settings.map((setting) => (
                  <tr key={setting.id}>
                    <td style={{ fontFamily: 'monospace' }}>{setting.key}</td>
                    <td>{setting.value}</td>
                    <td>
                      <Badge size="sm">{setting.type}</Badge>
                    </td>
                    <td>{setting.category || '-'}</td>
                    <td>{setting.is_public ? 'Yes' : 'No'}</td>
                    <td>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDeleteSetting(setting.key)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {settings.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                No settings found
              </div>
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="flags" pt="xl">
          <Paper shadow="sm" withBorder>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Description</th>
                  <th>Rollout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {flags.map((flag) => (
                  <tr key={flag.id}>
                    <td>{flag.name}</td>
                    <td style={{ fontFamily: 'monospace' }}>{flag.key}</td>
                    <td>{flag.description}</td>
                    <td>{flag.rollout_percentage}%</td>
                    <td>
                      <Switch
                        checked={flag.is_enabled}
                        onChange={() => handleToggleFlag(flag)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {flags.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                No feature flags found
              </div>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>

      {/* Create Setting Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          resetForm();
        }}
        title="Create Setting"
        size="md"
      >
        <Stack spacing="md">
          <TextInput
            label="Key"
            placeholder="setting_key"
            required
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.currentTarget.value })}
          />
          <Textarea
            label="Value"
            placeholder="setting value"
            required
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.currentTarget.value })}
          />
          <Select
            label="Type"
            required
            data={[
              { value: 'string', label: 'String' },
              { value: 'number', label: 'Number' },
              { value: 'boolean', label: 'Boolean' },
              { value: 'json', label: 'JSON' },
            ]}
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value || 'string' })}
          />
          <TextInput
            label="Category"
            placeholder="general, limits, etc."
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.currentTarget.value })}
          />
          <Textarea
            label="Description"
            placeholder="Description of this setting"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
          />
          <Switch
            label="Public (visible to users)"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.currentTarget.checked })}
          />
          <Group position="right" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSetting}>Create</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
