import { Meta, StoryObj } from '@storybook/react'
import { MenuItem } from './MenuItem'
import { Arrow, Envelope } from '@/shared/assets/icons'
import { MenuItemContent } from './MenuItemContent/MenuItemContent'

const meta: Meta<typeof MenuItem> = {
	title: 'shared/MenuItem',
	component: MenuItem,
	args: {
		role: 'menuitem',
	},
	argTypes: {
		onClick: { action: 'clicked' },
	},
}

export default meta

type Story = StoryObj<typeof MenuItem>

export const Default: Story = {
	args: {
		children: <MenuItemContent title="Default" />,
	},
}

export const WithIcons: Story = {
	args: {
		children: (
			<MenuItemContent
				title="Default"
				StartIcon={<Envelope />}
				EndIcon={<Arrow />}
			/>
		),
	},
}

export const WithDescription: Story = {
	args: {
		children: (
			<MenuItemContent
				title="Default"
				description="Text text text text1 text 32 text 44 text pppppp dddd text 45"
				StartIcon={<Envelope />}
				EndIcon={<Arrow />}
			/>
		),
	},
}

export const LinkMenuItem: Story = {
	args: {
		to: '/example',
		children: <MenuItemContent title="I am external link" />,
	},
}

export const ExternalLinkMenuItem: Story = {
	args: {
		href: 'https://example.com',
		children: <MenuItemContent title="I am external link" />,
	},
}
