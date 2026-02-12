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
    Group,
    Loader,
    LoadingOverlay,
    Paper,
    PasswordInput,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Title
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconEye, IconEyeOff, IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fadeIn, scaleIn, slideInLeft, slideInRight } from '../../animations';

export function EnhancedRegisterForm() {
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
                if (value.length < 8) return 'Password must be at least 8 characters';
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

            <Container size={500} style={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <motion.div
                    variants={fadeIn}
                    initial="initial"
                    animate="animate"
                >
                    <Center mb={40}>
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
                                    Create Account
                                </Title>
                                <Text c="dimmed" size="sm" ta="center" mb={30}>
                                    Start managing your Amazon advertising campaigns
                                </Text>
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
                                        <SimpleGrid cols={2} spacing="md">
                                            <TextInput
                                                label="First Name"
                                                placeholder="John"
                                                leftSection={<IconUser size={16} />}
                                                radius="md"
                                                size="md"
                                                required
                                                {...form.getInputProps('firstName')}
                                            />
                                            <TextInput
                                                label="Last Name"
                                                placeholder="Doe"
                                                leftSection={<IconUser size={16} />}
                                                radius="md"
                                                size="md"
                                                required
                                                {...form.getInputProps('lastName')}
                                            />
                                        </SimpleGrid>
                                    </motion.div>

                                    <motion.div
                                        variants={slideInRight}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 1.0 }}
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
                                        variants={slideInLeft}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 1.2 }}
                                    >
                                        <PasswordInput
                                            label="Password"
                                            placeholder="Create a strong password"
                                            leftSection={<IconLock size={16} />}
                                            visibilityToggleIcon={({ reveal }) =>
                                                reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />
                                            }
                                            radius="md"
                                            size="md"
                                            required
                                            {...form.getInputProps('password')}
                                        />
                                        <Text size="xs" c="dimmed" mt={4}>
                                            Must be at least 8 characters long
                                        </Text>
                                    </motion.div>

                                    <motion.div
                                        variants={fadeIn}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 1.4 }}
                                    >
                                        <Checkbox
                                            label={
                                                <Text size="sm">
                                                    I accept the{' '}
                                                    <Anchor href="#" size="sm">
                                                        terms and conditions
                                                    </Anchor>
                                                </Text>
                                            }
                                            {...form.getInputProps('terms', { type: 'checkbox' })}
                                        />
                                    </motion.div>

                                    <motion.div
                                        variants={scaleIn}
                                        initial="initial"
                                        animate="animate"
                                        transition={{ delay: 1.6 }}
                                    >
                                        <Button
                                            type="submit"
                                            fullWidth
                                            mt="xl"
                                            size="md"
                                            radius="md"
                                            loading={loading}
                                            style={{
                                                background: 'linear-gradient(135deg, #228be6 0%, #1971c2 100%)',
                                                transition: 'all 0.2s ease',
                                            }}
                                            styles={{
                                                root: {
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 25px rgba(34, 139, 230, 0.3)'
                                                    }
                                                }
                                            }}
                                        >
                                            {loading ? (
                                                <Group gap={8}>
                                                    <Loader size={16} color="white" />
                                                    <Text>Creating account...</Text>
                                                </Group>
                                            ) : (
                                                '🚀 Create Account'
                                            )}
                                        </Button>
                                    </motion.div>
                                </Stack>
                            </form>

                            <motion.div
                                variants={fadeIn}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: 1.8 }}
                            >
                                <Text ta="center" mt="xl" size="sm">
                                    Already have an account?{' '}
                                    <Anchor component={Link} to="/login" fw={600}>
                                        Sign in
                                    </Anchor>
                                </Text>
                            </motion.div>
                        </Paper>
                    </motion.div>
                </motion.div>
            </Container>
        </Box>
    );
}
