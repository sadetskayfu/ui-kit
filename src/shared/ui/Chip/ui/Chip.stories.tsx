import { Meta, StoryObj } from '@storybook/react'
import { Chip } from './Chip'
import { Avatar } from '@/shared/ui/Avatar'
import { Heart } from '@/shared/assets/icons'

const meta: Meta<typeof Chip> = {
	title: 'shared/Chip',
	component: Chip,
	args: {
		variant: 'filled',
		color: 'primary',
		size: 'medium',
		disabled: false,
	},
}

export default meta

type Story = StoryObj<typeof Chip>

export const DefaultChip: Story = {
	args: {
		label: 'Default chip'
	}
}

export const ButtonChip: Story = {
	args: {
		label: 'Button chip'
	},
	argTypes: {
		onClick: { action: 'clicked' },
	},
}

export const LinkChip: Story = {
	args: {
		to: '/example',
		label: 'Link chip'
	},
}

export const ExternalLinkChip: Story = {
	args: {
		href: 'https://example.com',
		label: 'External link chip'
	},
}

export const ChipWithCloseButton: Story = {
	args: {
		label: 'With close button'
	},
	argTypes: {
		onClick: { action: 'clicked' },
		onClose: { action: 'close clicked' },
	},
}

export const ChipWithIcon: Story = {
	args: {
		Icon: <Heart />,
		label: 'With icon'
	},
}

export const WithAvatar: Story = {
	args: {
		Avatar: <Avatar />,
		label: 'With avatar'
	},
}

export const WithAvatarAndCloseButton: Story = {
	args: {
		Avatar: <Avatar />,
		label: 'With avatar and close button'
	},
	argTypes: {
		onClose: { action: 'close clicked' },
	},
}
