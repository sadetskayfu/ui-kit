import { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from './AvatarGroup'
import { Avatar } from '@/shared/ui/Avatar'

const meta: Meta<typeof AvatarGroup> = {
	title: 'shared/AvatarGroup',
	component: AvatarGroup,
	args: {
		spacing: 'medium',
		orientation: 'vertical',
		children: [
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
		],
	},
}

export default meta

type Story = StoryObj<typeof AvatarGroup>

export const Default: Story = {}

export const WithMaxAvatars: Story = {
	args: {
		maxAvatars: 4,
	},
}

