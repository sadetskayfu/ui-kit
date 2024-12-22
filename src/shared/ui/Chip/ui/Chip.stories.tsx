import { Meta, StoryObj } from '@storybook/react'
import { Chip } from './Chip'
import { Icon } from '@/shared/ui/Icon'
import { Avatar } from '@/shared/ui/Avatar'

const meta: Meta<typeof Chip> = {
	title: 'shared/Chip',
	component: Chip,
	args: {
		variant: 'filled',
		color: 'primary',
		size: 'medium',
		label: 'I am Chip',
	},
}

export default meta
type Story = StoryObj<typeof Chip>

export const Default: Story = {}

export const ButtonChip: Story = {
	args: {
		isButton: true,
	},
	argTypes: {
		onClick: { action: 'clicked' },
	},
}

export const LinkChip: Story = {
	args: {
		isLink: true,
		to: '/example',
	},
}

export const ExternalLinkChip: Story = {
	args: {
		isExternalLink: true,
		to: 'https://example.com',
	},
}

export const Disabled: Story = {
	args: {
		disabled: true,
	},
}

export const WithCloseButton: Story = {
	args: {
		onClose: () => undefined,
	},
}

export const WithIcon: Story = {
	args: {
		Icon: <Icon variant="heart" />,
	},
}

export const WithAvatar: Story = {
	args: {
		Avatar: <Avatar />,
	},
}

export const WithAvatarAndCloseButton: Story = {
	args: {
		Avatar: <Avatar />,
		onClose: () => undefined,
	},
}
