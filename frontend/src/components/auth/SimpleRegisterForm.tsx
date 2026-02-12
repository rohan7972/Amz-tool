import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Checkbox,
} from '@mantine/core';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { notifications } from '@mantine/notifications';

export function SimpleRegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!terms) {
      notifications.show({
        title: 'Error',
        message: 'Please accept the terms and conditions',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({ 
        email, 
        password, 
        firstName, 
        lastName 
      });
      setAuth(response.user, response.token, response.refreshToken);
      notifications.show({
        title: 'Success',
        message: 'Registration successful!',
        color: 'green',
      });
      navigate('/dashboard');
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Registration failed',
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
          Create Account
        </Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="First Name"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
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
            <Checkbox
              label="I accept terms and conditions"
              checked={terms}
              onChange={(e) => setTerms(e.currentTarget.checked)}
            />
            <Button type="submit" fullWidth loading={loading}>
              Register
            </Button>
          </Stack>
        </form>
        <Box mt="md">
          <Text size="sm" c="dimmed">
            Already have an account?{' '}
            <Anchor component={Link} to="/login">
              Sign in
            </Anchor>
          </Text>
        </Box>
      </Paper>
    </Container>
  );
}
