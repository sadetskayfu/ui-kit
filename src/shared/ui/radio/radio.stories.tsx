import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './radio';

const meta: Meta<typeof Radio> = {
	title: 'shared/radio',
	component: Radio,
	args: {
		disabled: false,
		disableRipple: false,
		size: 'm',
		variant: 'filled',
	},
};

export default meta;

type Story = StoryObj<typeof Radio>;

const UncontrolledRadioWrapper = (args: any) => {
	return (
		<div>
			<Radio defaultChecked {...args} />
			<Radio {...args} /> 
			<Radio {...args} />
		</div>
	);
};

const ControlledRadioWrapper = (args: any) => {
	const [value, setValue] = React.useState('1');

	return (
		<div>
			<Radio
				{...args}
				value="1"
				checked={value === '1'}
				onChange={event => setValue(event.target.value)}
			/>
			<Radio
				{...args}
				value="2"
				checked={value === '2'}
				onChange={event => setValue(event.target.value)}
			/>
			<Radio
				{...args}
				value="3"
				checked={value === '3'}
				onChange={event => setValue(event.target.value)}
			/>
		</div>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledRadioWrapper(args),
	args: {
		name: 'radio',
	},
};

export const Controlled: Story = {
	render: args => ControlledRadioWrapper(args),
	args: {
		name: 'radio',
	},
};
