import { Meta, StoryObj } from '@storybook/react'
import { Typography } from './Typography'

const meta: Meta<typeof Typography> = {
	title: 'shared/Typography',
	component: Typography,
	args: {
		component: 'p',
		color: 'soft',
		variant: 'text',
		children: 'Text abz abs abs'
	},
}

export default meta

type Story = StoryObj<typeof Typography>

export const DefaultTypography: Story = {
	
}
