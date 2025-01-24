import { Meta, StoryObj } from '@storybook/react'
import { ListItem } from './ListItem'
import { House } from '@/shared/assets/icons'

const meta: Meta<typeof ListItem> = {
	title: 'shared/ListItem',
	component: ListItem,
    args: {
        indicatorPosition: 'left'
    }
}

export default meta

type Story = StoryObj<typeof ListItem>

export const ListItemLink: Story = {
	args: {
        children: 'List item link',
        to: '/example',
	},
}

export const ListItemWithIcons: Story = {
    args: {
        children: 'List item with start icon',
        StartIcon: <House />,
        to: '/example',
        indicatorPosition: 'right'
    }
}

