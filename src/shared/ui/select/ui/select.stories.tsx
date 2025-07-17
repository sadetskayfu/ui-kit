import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

type Option = {
	id: string;
	label: string;
};

const options: Option[] = Array.from({ length: 100 }, (_, index) => index).map(index => ({
	id: String(index),
	label: `Option ${index}`,
}));

const meta: Meta<typeof Select> = {
	title: 'shared/select',
	component: Select,
	args: {},
};

export default meta;

type Story = StoryObj<typeof Select>;

const SingleSelectWrapper = () => {
	return (
		<div style={{width: '1000px'}}>
			<Select
				label="Label"
				placeholder="Select option"
				options={options}
				getOptionValue={option => option.id}
				getOptionLabel={option => option.label}
				multi
				clearButton
				requiredValue
			/>
		</div>
	);
};

export const Default: Story = {
	render: () => SingleSelectWrapper(),
};
