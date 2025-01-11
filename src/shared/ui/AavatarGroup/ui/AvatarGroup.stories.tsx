import { Meta, StoryObj } from '@storybook/react'
import { AvatarGroup } from './AvatarGroup'
import { Avatar } from '@/shared/ui/Avatar'
import { Badge } from '@/shared/ui/Badge'

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

export const DefaultGroup: Story = {}

export const GroupWithMaxAvatars: Story = {
	args: {
		maxAvatars: 4,
	},
}

export const AvatarWithBadge: Story = {
	args: {
		maxAvatars: 4,
		children: [
			<Badge isVisible border position="bottom-right" size="small" color="green">
				<Avatar defaultBgColor border='dark'/>
			</Badge>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
			<Avatar border='dark'/>,
		],
	},
}
