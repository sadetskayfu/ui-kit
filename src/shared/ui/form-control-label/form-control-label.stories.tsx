import type { Meta, StoryObj } from '@storybook/react';
import { FormControlLabel } from './form-control-label';
import { Checkbox } from '@/shared/ui/checkbox';

const meta: Meta<typeof FormControlLabel> = {
	title: 'shared/form-control-label',
	component: FormControlLabel,
	args: {
		color: 'soft',
		placement: 'right',
		disabled: false,
		required: false,
		label: 'Label',
	},
};

export default meta;

type Story = StoryObj<typeof FormControlLabel>;

const FormControlLabelWrapper = (args: any) => {
	return (
		<div style={{display: 'flex', gap: '15px'}}>
			<FormControlLabel {...args}>
				<Checkbox />
			</FormControlLabel>
			<FormControlLabel {...args}>
				<Checkbox />
			</FormControlLabel>
			<FormControlLabel {...args}>
				<Checkbox />
			</FormControlLabel>
		</div>
	);
};

export const Default: Story = {
	render: args => FormControlLabelWrapper(args),
};
