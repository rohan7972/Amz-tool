import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Anchor,
  Box,
} from '@mantine/core';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { notifications } from '@mantine/notifications';

export function SimpleLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      setAuth(response.user, response.token, response.refreshToken);
      notifications.show({
        title: 'Success',
        message: 'Login successful!',
        color: 'green',
      });
      navigate('/dashboard');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Login failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="xs" style={{ marginTop: '100px' }}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title order={2} mb="md">
          Sign In
        </Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </Stack>
        </form>
        <Box mt="md">
          <Text size="sm" c="dimmed">
            Don't have an account?{' '}
            <Anchor component="a" href="/register">
              Register
            </Anchor>
          </Text>
        </Box>
      </Paper>
    </Container>
  );
}
