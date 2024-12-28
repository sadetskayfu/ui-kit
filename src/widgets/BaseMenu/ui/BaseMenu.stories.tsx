import { Meta, StoryObj } from '@storybook/react'
import { BaseMenu } from './BaseMenu'

const meta: Meta<typeof BaseMenu> = {
	title: 'widgets/BaseMenu',
	component: BaseMenu,
	args: {
		openVariant: 'mouse-move',
		position: 'bottom-start',
	}
}

export default meta

type Story = StoryObj<typeof BaseMenu>


export const MenuWithSubMenu: Story = {
	
}

