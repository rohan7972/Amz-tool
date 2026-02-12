import { Box, Title, Text, Card, Grid, ColorPicker, Button, TextInput, Group, Stack } from '@mantine/core';
import { IconPalette } from '@tabler/icons-react';
import { useState } from 'react';

export function AdminCustomization() {
  const [primaryColor, setPrimaryColor] = useState('#667eea');
  const [secondaryColor, setSecondaryColor] = useState('#764ba2');

  return (
    <Box>
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2}>UI/UX Customization</Title>
          <Text c="dimmed" size="sm">
            Customize the application's appearance and branding
          </Text>
        </Box>
        <Button color="blue">Save Changes</Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="md">
              <IconPalette size={24} color="blue" />
              <Title order={4}>Theme Colors</Title>
            </Group>
            <Stack gap="md">
              <Box>
                <Text size="sm" fw={500} mb="xs">Primary Color</Text>
                <ColorPicker
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  format="hex"
                  fullWidth
                />
              </Box>
              <Box>
                <Text size="sm" fw={500} mb="xs">Secondary Color</Text>
                <ColorPicker
                  value={secondaryColor}
                  onChange={setSecondaryColor}
                  format="hex"
                  fullWidth
                />
              </Box>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">Branding</Title>
            <Stack gap="md">
              <TextInput
                label="Application Name"
                placeholder="Amazon FDC Tool"
                defaultValue="Amazon FDC Tool"
              />
              <TextInput
                label="Company Name"
                placeholder="Your Company"
              />
              <TextInput
                label="Support Email"
                placeholder="support@example.com"
                type="email"
              />
              <TextInput
                label="Logo URL"
                placeholder="https://example.com/logo.png"
              />
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
