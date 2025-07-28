import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@/shared/ui/radio';
import { RadioGroup } from './radio-group';
import { FormControlLabel } from '../form-control-label';

const meta: Meta<typeof RadioGroup> = {
	title: 'shared/radio-group',
	component: Radio,
	args: {
		disabled: false,
		orientation: 'horizontal',
		hiddenLabel: false,
		error: false,
		required: false,
		label: 'Radio group',
		labelColor: 'soft',
		helperText: 'Helper text',
		name: 'radio',
	},
    argTypes: {
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical']
        }
    }
};

export default meta;

type Story = StoryObj<typeof Radio>;

const RadioGroupWrapper = (args: any) => {
	const [value, setValue] = React.useState<string>('1');

	return (
		<RadioGroup label="Radio group" name="radio" value={value} onChange={setValue} {...args}>
			<FormControlLabel label="Radio 1">
				<Radio value="1" offset='left'/>
			</FormControlLabel>
			<FormControlLabel label="Radio 2" >
				<Radio value="2" offset={args.orientation === 'vertical' ? 'left' : undefined}/>
			</FormControlLabel>
			<FormControlLabel label="Radio 3">
				<Radio value="3" offset={args.orientation === 'vertical' ? 'left' : undefined}/>
			</FormControlLabel>
		</RadioGroup>
	);
};

export const Default: Story = {
	render: args => RadioGroupWrapper(args),
};
