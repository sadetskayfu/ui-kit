import { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import { Gear } from '@/shared/assets/icons'

const meta: Meta<typeof Button> = {
	title: 'shared/Button',
	component: Button,
	args: {
		variant: 'filled',
		color: 'primary',
		size: 'medium',
		disabled: false,
	},
	argTypes: {
		onClick: { action: 'clicked' },
	},
}

export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {
	args: {
		children: 'Default button',
	},
}

export const WithIcon: Story = {
	args: {
		children: (
			<>
				Button with icon
				<Gear />
			</>
		),
	},
}

export const Link: Story = {
	args: {
		to: '/example',
		children: 'Link button',
	},
}

export const ExternalLink: Story = {
	args: {
		href: 'https://example.com',
		children: 'External link button',
	},
}
