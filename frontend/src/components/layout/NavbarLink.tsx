import { Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { TablerIconsProps } from '@tabler/icons-react';

interface NavbarLinkProps {
  icon: React.FC<TablerIconsProps>;
  label: string;
  path: string;
  active?: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

export function NavbarLink({ icon: Icon, label, active, onClick, collapsed }: NavbarLinkProps) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: 'var(--mantine-spacing-xs)',
        borderRadius: 'var(--mantine-radius-sm)',
        color: active
          ? 'var(--mantine-color-blue-6)'
          : 'black',
        backgroundColor: active
          ? 'var(--mantine-color-blue-0)'
          : 'transparent',
      }}
    >
      <Group justify={collapsed ? "center" : "flex-start"}>
        <ThemeIcon
          variant={active ? 'filled' : 'light'}
          color={active ? 'blue' : 'gray'}
          size={30}
        >
          <Icon size={18} />
        </ThemeIcon>

        {!collapsed && (
          <Text size="sm" fw={active ? 600 : 400}>
            {label}
          </Text>
        )}
      </Group>
    </UnstyledButton>
  );
}