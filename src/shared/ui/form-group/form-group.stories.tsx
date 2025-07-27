import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FormGroup } from './form-group';
import { Checkbox } from '@/shared/ui/checkbox/checkbox';
import { CheckboxVariantProvider } from '../checkbox';

const meta: Meta<typeof FormGroup> = {
	title: 'shared/form-group',
	component: FormGroup,
	args: {
		disabled: false,
		required: false,
		readOnly: false,
		hiddenLabel: false,
		error: false,
		orientation: 'vertical',
		labelColor: 'soft',
		minValueLength: 0,
	},
};

export default meta;

type Story = StoryObj<typeof FormGroup>;

const FormGroupWrapper = (args: any) => {
	const [value, setValue] = React.useState<string[]>([]);

	return (
		<div>
			<FormGroup label="Checkbox group" {...args} value={value} onChange={setValue}>
				<CheckboxVariantProvider offset={args.orientation === 'vertical' ? 'left' : undefined}>
					<Checkbox {...args} value="1" offset={args.orientation === 'horizontal' ? 'left' : undefined}/>
					<Checkbox {...args} value="2" />
					<Checkbox {...args} value="3" />
					<Checkbox {...args} disabled value="4" />
				</CheckboxVariantProvider>
			</FormGroup>
		</div>
	);
};

export const WithCheckbox: Story = {
	render: args => FormGroupWrapper(args),
	args: {
		helperText: 'Helper text',
	},
};
