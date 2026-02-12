import {
    Button,
    Divider,
    Group,
    NumberInput,
    Popover,
    Stack,
    Text,
    UnstyledButton,
    rem
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';

interface CustomDatePickerProps {
    value: [Date | null, Date | null];
    onChange: (value: [Date | null, Date | null]) => void;
}

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
    const [opened, setOpened] = useState(false);
    const [innerValue, setInnerValue] = useState<[Date | null, Date | null]>(value);
    const [excludeDays, setExcludeDays] = useState<number | ''>(0);

    // Helper to standardise dates
    const today = () => new Date();

    const presets = [
        { label: 'Today', getValue: () => [new Date(), new Date()] },
        {
            label: 'Yesterday', getValue: () => {
                const d = new Date(); d.setDate(d.getDate() - 1);
                return [d, d];
            }
        },
        {
            label: 'This Week', getValue: () => {
                const now = new Date();
                const first = now.getDate() - now.getDay(); // Sunday
                const start = new Date(now.setDate(first));
                return [start, new Date()];
            }
        },
        {
            label: 'Last 7 Days', getValue: () => {
                const e = new Date();
                const s = new Date(); s.setDate(s.getDate() - 6);
                return [s, e];
            }
        },
        {
            label: 'Last 14 Days', getValue: () => {
                const e = new Date();
                const s = new Date(); s.setDate(s.getDate() - 13);
                return [s, e];
            }
        },
        {
            label: 'Last 30 Days', getValue: () => {
                const e = new Date();
                const s = new Date(); s.setDate(s.getDate() - 29);
                return [s, e];
            }
        },
        {
            label: 'Last 60 Days', getValue: () => {
                const e = new Date();
                const s = new Date(); s.setDate(s.getDate() - 59);
                return [s, e];
            }
        },
        {
            label: 'This Month', getValue: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                return [start, now];
            }
        },
        {
            label: 'Last Month', getValue: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const end = new Date(now.getFullYear(), now.getMonth(), 0);
                return [start, end];
            }
        },
    ];

    const handleApply = () => {
        // Apply exclude logic if needed
        // Usually exclude logic shifts the entire range back by N days?
        // Or just truncates the end date?
        // Based on "Exclude Last N Days" typical usage (e.g. data not ready), it implies:
        // Effective End Date = Selected End Date - excludeDays

        let [start, end] = innerValue;
        if (start && end && typeof excludeDays === 'number' && excludeDays > 0) {
            const newEnd = new Date(end);
            newEnd.setDate(newEnd.getDate() - excludeDays);
            end = newEnd;
            // Ensure start !> end
            if (start > end) start = end;
        }

        onChange([start, end]);
        setOpened(false);
    };

    const handlePresetClick = (getVal: () => any[]) => {
        const val = getVal() as [Date, Date];
        setInnerValue(val);
    };

    const formatDateDisplay = (d: Date | null) => d ? dayjs(d).format('MMM D, YYYY') : '';

    return (
        <Popover opened={opened} onChange={setOpened} shadow="md" position="bottom-end" withArrow>
            <Popover.Target>
                <Button
                    variant="default"
                    leftSection={<IconCalendar size={16} />}
                    rightSection={<IconChevronDown size={14} />}
                    onClick={() => setOpened((o) => !o)}
                    style={{ width: 260, justifyContent: 'space-between', fontWeight: 400 }}
                >
                    {value[0] ? `${dayjs(value[0]).format('MMM D, YYYY')} - ${dayjs(value[1] || value[0]).format('MMM D, YYYY')}` : 'Select Date Range'}
                </Button>
            </Popover.Target>

            <Popover.Dropdown p={0}>
                <Group align="flex-start" gap={0}>
                    {/* Presets Sidebar */}
                    <Stack gap={0} w={140} style={{ borderRight: `1px solid #dee2e6`, height: '100%', minHeight: 380 }}>
                        {presets.map((preset) => (
                            <UnstyledButton
                                key={preset.label}
                                p="sm"
                                style={{
                                    fontSize: rem(13),
                                    transition: 'background-color 0.2s',
                                    borderLeft: '3px solid transparent'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => handlePresetClick(preset.getValue)}
                            >
                                {preset.label}
                            </UnstyledButton>
                        ))}
                    </Stack>

                    {/* Main Calendar Area */}
                    <Stack p="md" gap="sm">
                        <Group grow>
                            <Button variant="default" size="xs" radius="xs" style={{ cursor: 'default' }}>{formatDateDisplay(innerValue[0])}</Button>
                            <Button variant="default" size="xs" radius="xs" style={{ cursor: 'default' }}>{formatDateDisplay(innerValue[1])}</Button>
                        </Group>

                        <DatePicker
                            type="range"
                            value={innerValue}
                            onChange={setInnerValue}
                            numberOfColumns={1}
                        />

                        <Divider />

                        <Group justify="space-between">
                            <Group gap="xs" align="center">
                                <Text size="xs">Exclude Last Days:</Text>
                                <NumberInput
                                    value={excludeDays}
                                    onChange={(val) => setExcludeDays(typeof val === 'string' ? '' : val)}
                                    min={0}
                                    max={30}
                                    size="xs"
                                    w={60}
                                />
                            </Group>
                            <Group gap="xs">
                                <Button variant="default" size="xs" onClick={() => setOpened(false)}>Cancel</Button>
                                <Button size="xs" onClick={handleApply}>Apply</Button>
                            </Group>
                        </Group>
                    </Stack>
                </Group>
            </Popover.Dropdown>
        </Popover>
    );
}
