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

export const DefaultButton: Story = {
	args: {
		children: 'Default button',
	},
}

export const ButtonWithIcon: Story = {
	args: {
		children: (
			<>
				Button with icon
				<Gear />
			</>
		),
	},
}

export const LinkButton: Story = {
	args: {
		to: '/example',
		children: 'Link button',
	},
}

export const ExternalLinkButton: Story = {
	args: {
		href: 'https://example.com',
		children: 'External link button',
	},
}
