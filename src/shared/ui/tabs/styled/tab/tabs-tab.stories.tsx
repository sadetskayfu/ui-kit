import type { Meta, StoryObj } from '@storybook/react';
import { TabsTab } from './tabs-tab';
import { BaseTabs } from '../../base';
import { GearIcon } from '@/shared/ui/icons';

const meta: Meta<typeof TabsTab> = {
	title: 'shared/tabs/tab',
	component: TabsTab,
	args: {
        variant: 'filled',
        size: 'm',
        iconPosition: 'right',
        disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof TabsTab>;

const TabsWrapper = (args: any) => {
    return (
        <BaseTabs.Root>
            <BaseTabs.List style={{ display: 'flex', gap: '10px' }}>
                <TabsTab {...args} />
                <TabsTab {...args} />
                <TabsTab {...args} />
            </BaseTabs.List>
            <BaseTabs.Panel />
            <BaseTabs.Panel />
            <BaseTabs.Panel />
        </BaseTabs.Root>
    )
}

export const Default: Story = {
    render: (args) => TabsWrapper(args),
    args: {
        label: 'Tab'
    }
};

export const WithIcon: Story = {
    render: (args) => TabsWrapper(args),
    args: {
        label: 'Tab',
        icon: <GearIcon />
    }
}

export const IconTab: Story = {
    render: (args) => TabsWrapper(args),
    args: {
        icon: <GearIcon />,
        "aria-label": 'icon tab'
    }
}

