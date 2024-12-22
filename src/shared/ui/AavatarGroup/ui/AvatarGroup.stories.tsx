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
			<Avatar />,
			<Avatar />,
			<Avatar />,
			<Avatar />,
			<Avatar />,
			<Avatar />,
		],
	},
}

export default meta
type Story = StoryObj<typeof AvatarGroup>

export const Default: Story = {}

export const withMaxAvatars: Story = {
	args: {
		maxAvatars: 4,
	},
}

export const withBadge: Story = {
	args: {
		maxAvatars: 4,
		children: [
			<Badge isVisible border position="bottom-right" size="small" color="green">
				<Avatar />
			</Badge>,
			<Avatar />,
			<Avatar />,
			<Avatar />,
			<Avatar />,
			<Avatar />,
		],
	},
}
