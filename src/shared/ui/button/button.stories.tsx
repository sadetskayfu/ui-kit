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
        disabled: false,
        loading: false,
        iconButton: false,
        disableRipple: false,
        disableRippleSpaceKey: false,
        children: 'Button'
	},
    argTypes: {
		onClick: { action: 'clicked' },
        variant: {
            control: 'radio',
            options: ['filled', 'outlined', 'clear']
        },
        color: {
            control: 'radio',
            options: ['primary', 'secondary', 'red', 'green']
        },
        size: {
            control: 'radio',
            options: ['xs', 's', 'm', 'l']
        }
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
    }
}

export const LinkButton: Story = {
    args: {
        render: <a href='/example'/>,
        disableRippleSpaceKey: true
    }
}


