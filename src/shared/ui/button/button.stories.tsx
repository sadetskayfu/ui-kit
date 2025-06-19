import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { GearIcon } from '@/shared/ui/icons';

const meta: Meta<typeof Button> = {
	title: 'shared/button',
	component: Button,
	args: {
        variant: 'filled',
        color: 'primary',
        size: 'm',
        borderPlacement: 'all',
        borderRadius: 'm',
        disabled: false,
        loading: false,
        iconButton: false,
        type: 'button',
        children: 'Button'
	},
    argTypes: {
		onClick: { action: 'clicked' },
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const WithIcon: Story = {
    args: {
        children: <>Button <GearIcon /></>
    }
}

export const IconButton: Story = {
    args: {
        children: <GearIcon />,
        iconButton: true,
        borderRadius: 'circular'
    }
}

export const LinkButton: Story = {
    args: {
        to: 'https://example.com'
    }
}

export const CustomLinkComponent: Story = {
    args: {
        linkComponent: <a href='https://example.com'></a>
    }
}

