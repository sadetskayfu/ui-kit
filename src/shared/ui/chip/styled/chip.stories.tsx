import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './index';

const meta: Meta<typeof Chip.Root> = {
	title: 'shared/chip',
	component: Chip.Root,
	args: {
		disabled: false,
        variant: 'filled',
        color: 'secondary',
        size: 'm',
	},
    argTypes: {
        variant: {
            control: 'radio',
            options: ['filled', 'outlined']
        },
        color: {
            control: 'radio',
            options: ['primary', 'secondary']
        },
        size: {
            control: 'radio',
            options: ['s', 'm']
        }
    }
};

export default meta;

type Story = StoryObj<typeof Chip.Root>;

const ButtonChipWrapper = (args: any) => {
	return (
		<Chip.Root {...args} onClose={() => console.log('close')}>
			<Chip.Avatar src="" fallback="Y" />
			<Chip.Label>Label</Chip.Label>
		</Chip.Root>
	);
};

const LinkChipWrapper = (args: any) => {
	return (
		<Chip.Root
			{...args}
			onClose={() => console.log('close')}
			disableRippleSpaceKey
			render={<a href="/example" />}
		>
			<Chip.Label>Label</Chip.Label>
		</Chip.Root>
	);
};

const ChipWrapper = (args: any) => {
	return (
		<Chip.Root
			{...args}
			onClose={() => console.log('close')}
			tabIndex={0}
			disableRipple
			interactive={false}
            nativeButton={false}
			render={<div />}
		>
			<Chip.Avatar src="" fallback="YI" />
			<Chip.Label>Label</Chip.Label>
			<Chip.Close />
		</Chip.Root>
	);
};

export const Button: Story = {
	render: args => ButtonChipWrapper(args),
};

export const Link: Story = {
	render: args => LinkChipWrapper(args),
};

export const Div: Story = {
	render: args => ChipWrapper(args),
};
