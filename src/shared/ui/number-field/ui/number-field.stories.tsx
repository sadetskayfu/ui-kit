import type { Meta, StoryObj } from '@storybook/react';
import { NumberField } from './number-field';
import { useCallback, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { GearIcon } from '@/shared/ui/icons';

const meta: Meta<typeof NumberField> = {
	title: 'shared/number-field',
	component: NumberField,
	args: {
		variant: 'outlined',
		size: 'm',
		borderPlacement: 'all',
		label: 'Label',
		disabled: false,
		readOnly: false,
		required: false,
		fullWidth: false,
		hiddenLabel: false,
		placeholder: 'Enter value',
		helperText: 'Helper text',
		type: 'text',
        step: 1,
	},
};

export default meta;

type Story = StoryObj<typeof NumberField>;

const ControlledFieldWrapper = (args: any) => {
	const [value, setValue] = useState('');

	const handleChange = useCallback((value: string) => {
		setValue(value);
	}, []);

	return (
		<div style={{ width: '400px' }}>
			<NumberField
				value={value}
				onChange={handleChange}
				{...args}
			/>
		</div>
	);
};

export const Default: Story = {};

export const WithActions: Story = {
	args: {
		actions: [
			<Button
				onClick={e => e.stopPropagation()}
				iconButton
				borderRadius="circular"
				size="xs"
				variant="clear"
				color="secondary"
			>
				<GearIcon />
			</Button>,
			<Button
				onClick={e => e.stopPropagation()}
				iconButton
				borderRadius="circular"
				size="xs"
				variant="clear"
				color="secondary"
			>
				<GearIcon />
			</Button>,
		],
	},
};

export const Controlled: Story = {
	render: args => ControlledFieldWrapper(args),
    args: {
        min: 0,
        max: 18,
        step: 2,
    }
};

