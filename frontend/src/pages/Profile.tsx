
import {
    Avatar,
    Badge,
    Box,
    Card,
    Container,
    Group,
    Paper,
    SimpleGrid,
    Text,
    ThemeIcon,
    Title
} from '@mantine/core';
import { IconCalendar, IconMail, IconShield, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { fadeIn, scaleIn } from '../animations';
import { useAuthStore } from '../stores/authStore';

export default function Profile() {
    const { user } = useAuthStore();

    if (!user) {
        return (
            <Container>
                <Text>Loading profile...</Text>
            </Container>
        );
    }

    const stats = [
        { label: 'Role', value: user.role, icon: IconShield, color: 'blue' },
        { label: 'Status', value: user.isEmailVerified ? 'Verified' : 'Unverified', icon: IconUser, color: 'green' },
        { label: 'Joined', value: new Date(user.createdAt).toLocaleDateString(), icon: IconCalendar, color: 'orange' },
    ];

    return (
        <Container size="lg" py="xl">
            <motion.div variants={fadeIn} initial="initial" animate="animate">
                <Box mb={30}>
                    <Title order={2} fw={700}>My Profile</Title>
                    <Text c="dimmed">Manage your account settings and preferences</Text>
                </Box>

                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
                    {/* Main Profile Card */}
                    <Box style={{ gridColumn: 'span 2' }}>
                        <motion.div variants={scaleIn} initial="initial" animate="animate" transition={{ delay: 0.1 }}>
                            <Card withBorder shadow="sm" radius="md" p="xl" bg="white">
                                <Card.Section
                                    h={140}
                                    style={{
                                        backgroundImage:
                                            'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)',
                                    }}
                                />
                                <Avatar
                                    src={null}
                                    size={120}
                                    radius={120}
                                    mx="auto"
                                    mt={-60}
                                    style={{ border: '4px solid white' }}
                                    color="blue"
                                >
                                    {user.firstName?.[0]}
                                    {user.lastName?.[0]}
                                </Avatar>

                                <Text ta="center" fz="lg" fw={700} mt="sm">
                                    {user.firstName} {user.lastName}
                                </Text>
                                <Text ta="center" c="dimmed" fz="sm">
                                    {user.email}
                                </Text>

                                <Group mt="md" justify="center" gap={30}>
                                    {stats.map((stat) => (
                                        <div key={stat.label} style={{ textAlign: 'center' }}>
                                            <ThemeIcon
                                                color={stat.color}
                                                variant="light"
                                                radius="xl"
                                                size="lg"
                                                mb={5}
                                            >
                                                <stat.icon size={20} />
                                            </ThemeIcon>
                                            <Text size="xs" c="dimmed">
                                                {stat.label}
                                            </Text>
                                            <Text fw={500} size="sm" tt="capitalize">
                                                {stat.value}
                                            </Text>
                                        </div>
                                    ))}
                                </Group>
                            </Card>
                        </motion.div>
                    </Box>

                    {/* Side Info / Quick Details */}
                    <Box>
                        <motion.div variants={scaleIn} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
                            <Paper withBorder shadow="sm" radius="md" p="md" mb="md">
                                <Title order={4} mb="md">Contact Info</Title>
                                <Group mb="sm">
                                    <IconMail size={20} color="gray" />
                                    <div>
                                        <Text size="xs" c="dimmed">Email</Text>
                                        <Text size="sm">{user.email}</Text>
                                    </div>
                                </Group>
                            </Paper>

                            <Paper withBorder shadow="sm" radius="md" p="md">
                                <Title order={4} mb="md">Account Type</Title>
                                <Group justify="space-between" mb="xs">
                                    <Text size="sm">Subscription</Text>
                                    <Badge color="blue">Free Tier</Badge>
                                </Group>
                                <Text size="xs" c="dimmed">
                                    Upgrade to access advanced analytics and automation tools.
                                </Text>
                            </Paper>
                        </motion.div>
                    </Box>
                </SimpleGrid>
            </motion.div>
        </Container>
    );
}
