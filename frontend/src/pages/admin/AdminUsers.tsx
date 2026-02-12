import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Table,
  Button,
  Group,
  TextInput,
  Select,
  Badge,
  ActionIcon,
  Modal,
  Stack,
  PasswordInput,
  Switch,
  Pagination,
  LoadingOverlay,
  Menu,
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDots,
} from '@tabler/icons-react';
import axios from 'axios';
import { notifications } from '@mantine/notifications';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'user',
    is_active: true,
  });

  useEffect(() => {
    loadUsers();
  }, [page, search, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const response = await axios.get(`${API_URL}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load users:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load users',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/users`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notifications.show({
        title: 'Success',
        message: 'User created successfully',
        color: 'green',
      });

      setModalOpened(false);
      resetForm();
      loadUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to create user',
        color: 'red',
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem('token');
      const updateData = { ...formData };
      if (!updateData.password) delete updateData.password; // Don't send empty password

      await axios.put(`${API_URL}/admin/users/${editingUser.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notifications.show({
        title: 'Success',
        message: 'User updated successfully',
        color: 'green',
      });

      setModalOpened(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to update user',
        color: 'red',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notifications.show({
        title: 'Success',
        message: 'User deleted successfully',
        color: 'green',
      });

      loadUsers();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || 'Failed to delete user',
        color: 'red',
      });
    }
  };

  const openCreateModal = () => {
    resetForm();
    setEditingUser(null);
    setModalOpened(true);
  };

  const openEditModal = (user: User) => {
    setFormData({
      email: user.email,
      password: '',
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      is_active: user.is_active,
    });
    setEditingUser(user);
    setModalOpened(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      role: 'user',
      is_active: true,
    });
  };

  return (
    <Container size="xl" py="xl">
      <Group position="apart" mb="xl">
        <Title order={2}>User Management</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
          Create User
        </Button>
      </Group>

      <Paper p="md" shadow="sm" withBorder mb="md">
        <Group>
          <TextInput
            placeholder="Search users..."
            icon={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by role"
            data={[
              { value: '', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'User' },
              { value: 'viewer', label: 'Viewer' },
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
            clearable
          />
        </Group>
      </Paper>

      <Paper shadow="sm" withBorder style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{`${user.first_name} ${user.last_name}`}</td>
                <td>{user.email}</td>
                <td>
                  <Badge color={user.role === 'admin' ? 'red' : 'blue'}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  <Badge color={user.is_active ? 'green' : 'gray'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <Group spacing="xs">
                    <ActionIcon color="blue" onClick={() => openEditModal(user)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon color="red" onClick={() => handleDeleteUser(user.id)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {users.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No users found
          </div>
        )}
      </Paper>

      {totalPages > 1 && (
        <Group position="center" mt="xl">
          <Pagination value={page} onChange={setPage} total={totalPages} />
        </Group>
      )}

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setEditingUser(null);
          resetForm();
        }}
        title={editingUser ? 'Edit User' : 'Create User'}
        size="md"
      >
        <Stack spacing="md">
          <TextInput
            label="Email"
            placeholder="user@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
          />
          <TextInput
            label="First Name"
            placeholder="John"
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.currentTarget.value })}
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.currentTarget.value })}
          />
          <PasswordInput
            label="Password"
            placeholder={editingUser ? 'Leave blank to keep current' : 'Enter password'}
            required={!editingUser}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.currentTarget.value })}
          />
          <Select
            label="Role"
            required
            data={[
              { value: 'user', label: 'User' },
              { value: 'admin', label: 'Admin' },
              { value: 'viewer', label: 'Viewer' },
            ]}
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value || 'user' })}
          />
          <Switch
            label="Active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.currentTarget.checked })}
          />
          <Group position="right" mt="md">
            <Button variant="subtle" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
