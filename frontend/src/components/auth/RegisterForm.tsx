import { authService, RegisterRequest } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import {
    Alert,
    Anchor,
    Box,
    Button,
    Center,
    Checkbox,
    Container,
    Divider,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { GoogleLogin } from '@react-oauth/google';
import { IconAlertCircle, IconCheck, IconEye, IconEyeOff, IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fadeIn } from '../../animations';

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const form = useForm<RegisterRequest & { terms: boolean }>({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            terms: false,
        },
        validate: {
            email: (value) => {
                if (!value) return 'Email is required';
                if (!/^\S+@\S+$/.test(value)) return 'Invalid email format';
                return null;
            },
            password: (value) => {
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return null;
            },
            firstName: (value) => (value ? null : 'First name is required'),
            lastName: (value) => (value ? null : 'Last name is required'),
            terms: (value) => (value ? null : 'You must accept the terms and conditions'),
        },
    });

    const handleSubmit = async (values: RegisterRequest & { terms: boolean }) => {
        setLoading(true);
        setError(null);

        try {
            const { user, token, refreshToken } = await authService.register({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
            });

            setAuth(user, token, refreshToken);

            notifications.show({
                title: 'Registration Successful',
                message: `Welcome, ${user.firstName}! Your account has been created.`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(errorMessage);

            notifications.show({
                title: 'Registration Failed',
                message: errorMessage,
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setLoading(true);
        setError(null);
        try {
            const { user, token, refreshToken } = await authService.googleLogin(credentialResponse.credential);
            setAuth(user, token, refreshToken);
            notifications.show({
                title: 'Registration Successful',
                message: `Welcome, ${user.firstName}! Account created.`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Google Sign-up failed';
            setError(errorMessage);
            notifications.show({
                title: 'Registration Failed',
                message: errorMessage,
                color: 'red',
                icon: <IconAlertCircle size={16} />,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Background animations omitted for brevity, keeping same style as Login */}

            <Container size={420} style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <motion.div variants={fadeIn} initial="initial" animate="animate">
                    <Center mb={30}>
                        <Title order={1} size={32} fw={700} c="white">
                            Create Account
                        </Title>
                    </Center>

                    <Paper radius="xl" p={40} withBorder>
                        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

                        {error && (
                            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md" radius="md">
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="md">
                                <Group grow>
                                    <TextInput
                                        label="First Name"
                                        placeholder="John"
                                        leftSection={<IconUser size={16} />}
                                        required
                                        {...form.getInputProps('firstName')}
                                    />
                                    <TextInput
                                        label="Last Name"
                                        placeholder="Doe"
                                        leftSection={<IconUser size={16} />}
                                        required
                                        {...form.getInputProps('lastName')}
                                    />
                                </Group>

                                <TextInput
                                    label="Email"
                                    placeholder="your@email.com"
                                    leftSection={<IconMail size={16} />}
                                    required
                                    {...form.getInputProps('email')}
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    leftSection={<IconLock size={16} />}
                                    visibilityToggleIcon={({ reveal }) =>
                                        reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />
                                    }
                                    required
                                    {...form.getInputProps('password')}
                                />

                                <Checkbox
                                    label="I accept terms and conditions"
                                    {...form.getInputProps('terms', { type: 'checkbox' })}
                                />

                                <Button type="submit" fullWidth mt="xl" size="md" loading={loading}>
                                    Register
                                </Button>
                            </Stack>
                        </form>

                        <motion.div variants={fadeIn} initial="initial" animate="animate">
                            <Divider label="Or continue with" labelPosition="center" my="lg" />
                            <Center>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => console.log('Google Sign-up Failed')}
                                />
                            </Center>
                        </motion.div>

                        <Text ta="center" mt="xl" size="sm" c="dimmed">
                            Already have an account?{' '}
                            <Anchor component={Link} to="/login" size="sm">
                                Sign in
                            </Anchor>
                        </Text>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
}
