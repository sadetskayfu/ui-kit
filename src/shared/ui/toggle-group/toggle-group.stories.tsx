import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/shared/ui/toggle';
import { ToggleGroup } from './toggle-group';

const meta: Meta<typeof ToggleGroup> = {
	title: 'shared/toggle-group',
	component: ToggleGroup,
	args: {
		disabled: false,
		required: false,
		error: false,
		hiddenLabel: false,
		label: 'Label',
		helperText: 'Helper text',
		labelColor: 'soft',
		orientation: 'horizontal',
		minValueLength: 0,
	},
};

export default meta;

type Story = StoryObj<typeof ToggleGroup>;

const SingleToggleGroupWrapper = (args: any) => {
	const [value, setValue] = React.useState<string>('');

	return (
		<ToggleGroup {...args} value={value} onChange={setValue}>
			<Toggle value="v1">
				Toggle button 1
			</Toggle>
			<Toggle value="v2">
				Toggle button 2
			</Toggle>
			<Toggle disabled value="v3">
				Toggle button 3
			</Toggle>
			<Toggle value="v4">
				Toggle button 4
			</Toggle>
		</ToggleGroup>
	);
};

const MultiToggleGroupWrapper = (args: any) => {
	const [value, setValue] = React.useState<string[]>([]);

	return (
		<ToggleGroup {...args} value={value} onChange={setValue}>
			<Toggle value="v1">
				Toggle button 1
			</Toggle>
			<Toggle value="v2">
				Toggle button 2
			</Toggle>
			<Toggle disabled value="v3">
				Toggle button 3
			</Toggle>
			<Toggle value="v4">
				Toggle button 4
			</Toggle>
		</ToggleGroup>
	);
};

export const SingleGroup: Story = {
	render: args => SingleToggleGroupWrapper(args),
};

export const MultiGroup: Story = {
	render: args => MultiToggleGroupWrapper(args),
};
