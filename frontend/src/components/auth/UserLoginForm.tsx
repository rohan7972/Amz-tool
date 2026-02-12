import { authService, LoginRequest } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import {
    Anchor,
    Box,
    Button,
    Checkbox,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconLock, IconMail } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function UserLoginForm() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const form = useForm<LoginRequest & { rememberMe: boolean }>({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
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
        },
    });

    const handleSubmit = async (values: LoginRequest & { rememberMe: boolean }) => {
        setLoading(true);
        try {
            const response = await authService.login({
                email: values.email,
                password: values.password,
            });

            const { user, token, refreshToken } = response;
            setAuth(user, token, refreshToken);

            notifications.show({
                title: 'Login Successful',
                message: `Welcome back, ${user.firstName}!`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            
            notifications.show({
                title: 'Login Failed',
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
            {/* Animated background elements */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '5%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(60px)',
                }}
                animate={{
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    filter: 'blur(80px)',
                }}
                animate={{
                    y: [0, -40, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Floating circles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: `${Math.random() * 100 + 50}px`,
                        height: `${Math.random() * 100 + 50}px`,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, Math.random() * 100 - 50],
                        x: [0, Math.random() * 100 - 50],
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}

            {/* Login Form */}
            <Box
                style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '20px',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ width: '100%', maxWidth: '450px' }}
                >
                    <Paper
                        radius="lg"
                        p="xl"
                        withBorder
                        style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Title order={2} align="center" mb="md" style={{ color: '#667eea' }}>
                            Welcome back!
                        </Title>
                        <Text align="center" c="dimmed" mb="xl" size="sm">
                            Sign in to your account
                        </Text>

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack spacing="md">
                                <TextInput
                                    label="Email"
                                    placeholder="your@email.com"
                                    icon={<IconMail size={16} />}
                                    size="md"
                                    {...form.getInputProps('email')}
                                    styles={{
                                        input: {
                                            '&:focus': {
                                                borderColor: '#667eea',
                                            },
                                        },
                                    }}
                                />

                                <PasswordInput
                                    label="Password"
                                    placeholder="Your password"
                                    icon={<IconLock size={16} />}
                                    size="md"
                                    {...form.getInputProps('password')}
                                    styles={{
                                        input: {
                                            '&:focus': {
                                                borderColor: '#667eea',
                                            },
                                        },
                                    }}
                                />

                                <Group position="apart" mt="xs">
                                    <Checkbox
                                        label="Remember me"
                                        {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                                    />
                                    <Anchor component={Link} to="/forgot-password" size="sm">
                                        Forgot password?
                                    </Anchor>
                                </Group>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    loading={loading}
                                    mt="lg"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        transition: 'transform 0.2s',
                                    }}
                                    styles={{
                                        root: {
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                            },
                                        },
                                    }}
                                >
                                    🚀 Sign in
                                </Button>

                                <Text align="center" mt="md" size="sm">
                                    Don't have an account?{' '}
                                    <Anchor component={Link} to="/register" fw={600}>
                                        Sign up
                                    </Anchor>
                                </Text>
                            </Stack>
                        </form>
                    </Paper>
                </motion.div>
            </Box>
        </Box>
    );
}
