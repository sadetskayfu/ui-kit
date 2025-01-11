import { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
	title: 'shared/Avatar',
	component: Avatar,
	args: {
		size: 'small',
		variant: 'circular',
		border: 'none',
		defaultBgColor: true,
	},
}

export default meta

type Story = StoryObj<typeof Avatar>

export const DefaultAvatar: Story = {
}

export const AvatarWithErroredUrl: Story = {
	args: {
		src: 'errored-url',
		alt: 'Cats',
	},
}

export const AvatarWitchImg: Story = {
	args: {
		src: 'https://stihi.ru/pics/2014/04/21/1633.jpg',
		alt: 'Cats',
	},
}
