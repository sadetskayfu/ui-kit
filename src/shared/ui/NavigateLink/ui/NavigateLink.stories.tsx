import { Meta, StoryObj } from '@storybook/react'
import { NavigateLink } from './NavigateLink'
import { House } from '@/shared/assets/icons'

const meta: Meta<typeof NavigateLink> = {
	title: 'shared/NavigateLink',
	component: NavigateLink,
	args: {
		to: '/example',
	},
}

export default meta

type Story = StoryObj<typeof NavigateLink>

export const DefaultLink: Story = {
	args: {
        children: 'Default link'
	},
}

export const LinkWithIcon: Story = {
    args: {
        children: [<House />, 'Link with icon'],
    }
}
