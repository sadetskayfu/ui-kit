import type { Meta, StoryObj } from '@storybook/react';
import { FormLabel } from './form-label';

const meta: Meta<typeof FormLabel> = {
	title: 'shared/form-label',
	component: FormLabel,
	args: {
		color: 'soft',
		component: 'label',
		disabled: false,
		required: false,
		errored: false,
		focused: false,
	},
};

export default meta;

type Story = StoryObj<typeof FormLabel>;

export const Default: Story = {
    args: {
        children: 'Label'
    }
};

