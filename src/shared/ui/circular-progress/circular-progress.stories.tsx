import type { Meta, StoryObj } from '@storybook/react';
import { CircularProgress } from './circular-progress';

const meta: Meta<typeof CircularProgress> = {
	title: 'shared/circular-progress',
	component: CircularProgress,
	args: {
		absCenter: false,
		color: 'primary',
		size: 'l',
	},
};

export default meta;

type Story = StoryObj<typeof CircularProgress>;

export const Default: Story = {};
