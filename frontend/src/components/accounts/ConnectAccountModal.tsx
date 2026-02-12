
import { Button, Group, Modal, Select, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconExternalLink } from '@tabler/icons-react';
import { useState } from 'react';
import { apiClient } from '../../services/api';

interface ConnectAccountModalProps {
    opened: boolean;
    onClose: () => void;
    accountType: 'Seller' | 'Vendor' | 'Advertising' | null;
}

export function ConnectAccountModal({ opened, onClose, accountType }: ConnectAccountModalProps) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            region: 'NA',
        },
    });

    const handleConnect = async (values: { region: string }) => {
        console.log('[OAuth] handleConnect called with values:', values);
        setLoading(true);
        try {
            const apiAccountType = accountType === 'Advertising' ? 'advertising-api' : 'sp-api';
            const userType = accountType === 'Vendor' ? 'vendor' : 'seller';
            // Use window.location.origin to get the full URL (works in any environment)
            const redirectUri = `${window.location.origin}/api/oauth/callback/${apiAccountType}`;
            
            console.log('[OAuth] Prepared request data:', {
                accountType: apiAccountType,
                redirectUri,
                region: values.region,
                userType
            });

            console.log('[OAuth] Making POST request to /oauth/connect...');
            const response = await apiClient.post('/oauth/connect', {
                accountType: apiAccountType,
                redirectUri,
                region: values.region,
                userType
            });

            console.log('[OAuth] Response received:', response.data);

            if (response.data.success && response.data.data.authUrl) {
                console.log('[OAuth] Redirecting to:', response.data.data.authUrl);
                // Redirect user to Amazon
                window.location.href = response.data.data.authUrl;
            } else {
                console.error('[OAuth] No authUrl in response');
                notifications.show({
                    title: 'Error',
                    message: 'Failed to generate authorization URL',
                    color: 'red'
                });
            }
        } catch (error) {
            console.error('[OAuth] Error caught:', error);
            notifications.show({
                title: 'Error',
                message: 'Failed to connect. Please try again.',
                color: 'red'
            });
        } finally {
            console.log('[OAuth] Resetting loading state');
            setLoading(false);
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`Connect ${accountType} Account`}
            centered
        >
            <form onSubmit={form.onSubmit(handleConnect)}>
                <Stack>
                    <Text size="sm" c="dimmed">
                        Select the region for your Amazon account. You will be redirected to Amazon to authorize the connection.
                    </Text>

                    <Select
                        label="Marketplace / Country"
                        placeholder="Select marketplace"
                        searchable
                        data={[
                            {
                                group: 'North America', items: [
                                    { value: 'US', label: 'United States' },
                                    { value: 'CA', label: 'Canada' },
                                    { value: 'MX', label: 'Mexico' },
                                    { value: 'BR', label: 'Brazil' }
                                ]
                            },
                            {
                                group: 'Europe', items: [
                                    { value: 'UK', label: 'United Kingdom' },
                                    { value: 'DE', label: 'Germany' },
                                    { value: 'FR', label: 'France' },
                                    { value: 'IT', label: 'Italy' },
                                    { value: 'ES', label: 'Spain' },
                                    { value: 'NL', label: 'Netherlands' },
                                    { value: 'SE', label: 'Sweden' },
                                    { value: 'PL', label: 'Poland' },
                                    { value: 'TR', label: 'Turkey' },
                                    { value: 'BE', label: 'Belgium' }
                                ]
                            },
                            {
                                group: 'Middle East & India', items: [
                                    { value: 'IN', label: 'India' },
                                    { value: 'AE', label: 'United Arab Emirates' },
                                    { value: 'SA', label: 'Saudi Arabia' },
                                    { value: 'EG', label: 'Egypt' }
                                ]
                            },
                            {
                                group: 'Asia Pacific', items: [
                                    { value: 'JP', label: 'Japan' },
                                    { value: 'AU', label: 'Australia' },
                                    { value: 'SG', label: 'Singapore' }
                                ]
                            }
                        ]}
                        {...form.getInputProps('region')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={onClose}>Cancel</Button>
                        <Button
                            type="button" // Change to button to prevent form default submit issues if any
                            onClick={() => handleConnect(form.values)}
                            loading={loading}
                            rightSection={<IconExternalLink size={16} />}
                        >
                            Connect to Amazon
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
