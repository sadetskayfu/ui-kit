import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';
import { GearIcon } from '@/shared/ui/icons';

const meta: Meta<typeof Toggle> = {
	title: 'shared/toggle',
	component: Toggle,
	args: {
		disabled: false,
		disableRipple: false,
		color: 'primary',
		size: 'm',
	},
};

export default meta;

type Story = StoryObj<typeof Toggle>;

const ToggleWrapper = (args: any) => {
	const [value, setValue] = React.useState<string>('');

	const handleChange = (toggleValue: string) => {
		setValue(prev => {
			if (prev === toggleValue) {
				return '';
			} else {
				return toggleValue;
			}
		});
	};

	return (
		<div style={{ display: 'flex', gap: '15px' }}>
			<Toggle {...args} value="v1" onChange={handleChange} pressed={value === 'v1'}>
				Toggle button 1
			</Toggle>
			<Toggle {...args} value="v2" onChange={handleChange} pressed={value === 'v2'}>
				Toggle button 2
			</Toggle>
		</div>
	);
};

export const Default: Story = {
	render: args => ToggleWrapper(args),
};

export const ToggleWithIcon: Story = {
    args: {
        children: <>Toggle with icon <GearIcon /></>,
        pressed: false,
    }
}

export const IconToggle: Story = {
    args: {
        children: <GearIcon />,
        pressed: false,
        iconButton: true
    }
}
