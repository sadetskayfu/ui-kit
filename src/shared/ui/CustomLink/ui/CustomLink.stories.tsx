import { Meta, StoryObj } from '@storybook/react'
import { CustomLink } from './CustomLink'
import { User } from '@/shared/assets/icons'

const meta: Meta<typeof CustomLink> = {
	title: 'shared/CustomLink',
	component: CustomLink,
	args: {
		underline: 'hover',
		color: 'primary'
	},
}

export default meta

type Story = StoryObj<typeof CustomLink>

export const Link: Story = {
	args: {
		to: '/example',
		children: 'Link',
	},
}

export const ExternalLink: Story = {
	args: {
		href: 'https://example.com',
		children: 'External link',
	},
}

export const LinkWithIcon: Story = {
	args: {
		to: '/example',
		children: (
			<>
				<User />
				Link with icon
			</>
		),
	},
}
