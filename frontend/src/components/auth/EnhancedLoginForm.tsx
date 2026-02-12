import { authService, LoginRequest } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import {
    Alert,
    Anchor,
    Box,
    Button,
    Center,
    Checkbox,
    Container,
    Group,
    Loader,
    LoadingOverlay,
    Paper,
    PasswordInput,
    SegmentedControl,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconEye, IconEyeOff, IconLock, IconMail, IconShieldCheck, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fadeIn, scaleIn, slideInLeft, slideInRight } from '../../animations';

export function EnhancedLoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
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
        setError(null);

        try {
            const { user, token, refreshToken } = await authService.login({
                email: values.email,
                password: values.password,
            });

            // Check if trying to access admin panel without admin role
            if (loginType === 'admin' && user.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                notifications.show({
                    title: 'Access Denied',
                    message: 'You do not have admin privileges',
                    color: 'red',
                    icon: <IconAlertCircle size={16} />,
                });
                setLoading(false);
                return;
            }

            setAuth(user, token, refreshToken);

            notifications.show({
                title: 'Login Successful',
                message: `Welcome back, ${user.firstName}!`,
                color: 'green',
                icon: <IconCheck size={16} />,
            });

            // Redirect based on login type
            const redirectTo = loginType === 'admin' ? '/admin/dashboard' : '/dashboard';
            navigate(redirectTo, { replace: true });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);

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
                    left: '10%',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                }}
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />

            <motion.div
                style={{
                    position: 'absolute',
                    top: '60%',
                    right: '15%',
                    width: '150px',
                    height: '150px',
                    borderRadius: '30%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)'
                }}
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, -180, -360]
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />

            <Container size={420} style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                >
                    <Center mb={50}>
                        <motion.div
                            variants={scaleIn}
                            initial="initial"
                            animate="animate"
                            transition={{ delay: 0.2 }}
                        >
                            <Title
                                order={1}
                                size={48}
                                fw={700}
                                ta="center"
                                style={{
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    textShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                Amazon FDC Tool
                            </Title>
                        </motion.div>
                    </Center>

                    <motion.div
                        variants={scaleIn}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
                    >
                        <Paper
                            radius="xl"
                            p={40}
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                position: 'relative'
                            }}
                        >
                            <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

                            <motion.div
                                variants={slideInLeft}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: 0.6 }}
                            >
                                <Title order={2} ta="center" mb={8}>
                                    Welcome back!
                                </Title>
                                <Text c="dimmed" size="sm" ta="center" mb={20}>
                                    Sign in to your Amazon advertising dashboard
                                </Text>

                                {/* Login Type Selector */}
                                <Center mb={30}>
                                    <SegmentedControl
                                        value={loginType}
                                        onChange={(value) => setLoginType(value as 'user' | 'admin')}
                                        data={[
                                            {
                                                value: 'user',
                                                label: (
                                                    <Center>
                                                        <IconUser size={16} style={{ marginRight: 8 }} />
                                                        <span>User Login</span>
                                                    </Center>
                                                ),
                                            },
                                            {
                                                value: 'admin',
                                                label: (
                                                    <Center>
                                                        <IconShieldCheck size={16} style={{ marginRight: 8 }} />
                                                        <span>Admin Login</span>
                                                    </Center>
                                                ),
                                            },
                                        ]}
                                        fullWidth
                                        radius="md"
                                        size="md"
                                        styles={{
                                            root: {
                                                background: 'rgba(0, 0, 0, 0.02)',
                                            },
                                            indicator: {
                                                background: loginType === 'admin' 
                                                    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                                                    : 'linear-gradient(135deg, #228be6 0%, #1971c2 100%)',
                                            },
                                        }}
                                    />
                                </Center>
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert
                                        icon={<IconAlertCircle size={16} />}
                                        color="red"
                                        mb="md"
                                        radius="md"
                                    >
                                        {error}
                                    </Alert>
                                </motion.div>
                            )}

                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Stack gap="md">
                                    <motion.div
                                        variants={slideInLeft}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 0.8 }}
                                    >
                                        <TextInput
                                            label="Email"
                                            placeholder="your@email.com"
                                            leftSection={<IconMail size={16} />}
                                            radius="md"
                                            size="md"
                                            required
                                            {...form.getInputProps('email')}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={slideInRight}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 1.0 }}
                                    >
                                        <PasswordInput
                                            label="Password"
                                            placeholder="Your password"
                                            leftSection={<IconLock size={16} />}
                                            visibilityToggleIcon={({ reveal }) =>
                                                reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />
                                            }
                                            radius="md"
                                            size="md"
                                            required
                                            {...form.getInputProps('password')}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={fadeIn}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 1.2 }}
                                    >
                                        <Group justify="space-between" mt="md">
                                            <Checkbox
                                                label="Remember me"
                                                {...form.getInputProps('rememberMe', { type: 'checkbox' })}
                                            />
                                            <Anchor component={Link} to="/forgot-password" size="sm">
                                                Forgot password?
                                            </Anchor>
                                        </Group>
                                    </motion.div>

                                    <motion.div
                                        variants={scaleIn}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 1.4 }}
                                    >
                                        <Button
                                            type="submit"
                                            fullWidth
                                            mt="xl"
                                            size="md"
                                            radius="md"
                                            loading={loading}
                                            style={{
                                                background: loginType === 'admin'
                                                    ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                                                    : 'linear-gradient(135deg, #228be6 0%, #1971c2 100%)',
                                                transition: 'all 0.2s ease',
                                            }}
                                            styles={{
                                                root: {
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: loginType === 'admin'
                                                            ? '0 8px 25px rgba(255, 107, 107, 0.3)'
                                                            : '0 8px 25px rgba(34, 139, 230, 0.3)'
                                                    }
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <Group gap={8}>
                                                    <Loader size={16} color="white" />
                                                    <Text>Signing in...</Text>
                                                </Group>
                                            ) : (
                                                <>
                                                    {loginType === 'admin' ? '🔐 Sign in as Admin' : '🚀 Sign in'}
                                                </>
                                            )}
                                        </Button>
                                    </motion.div>
                                </Stack>
                            </form>

                            <motion.div
                                variants={fadeIn}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: 1.6 }}
                            >
                                <Text ta="center" mt="xl" size="sm">
                                    Don't have an account?{' '}
                                    <Anchor component={Link} to="/register" fw={600}>
                                        Sign up
                                    </Anchor>
                                </Text>

                                {loginType === 'admin' && (
                                    <Alert
                                        icon={<IconShieldCheck size={16} />}
                                        color="grape"
                                        mt="md"
                                        radius="md"
                                        variant="light"
                                    >
                                        <Text size="xs">
                                            <b>Admin Access:</b> Use your admin credentials to access the admin panel
                                        </Text>
                                    </Alert>
                                )}
                            </motion.div>
                        </Paper>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
}
