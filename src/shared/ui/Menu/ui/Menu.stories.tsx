import { Meta, StoryObj } from '@storybook/react'
import { Menu } from './Menu'
import { Button } from '@/shared/ui/Button'
import { useCallback, useState } from 'react'
import { MenuItem } from '@/shared/ui/MenuItem'

const meta: Meta<typeof Menu> = {
	title: 'shared/Menu',
	component: Menu,
	args: {
		position: 'bottom',
		openVariant: 'mouse-move',
		delay: 500,
		lazy: false,
	},
}

export default meta

type Story = StoryObj<typeof Menu>

const MenuWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const handleClose = useCallback(() => {
		setIsOpen(false)
	}, [])
	const handleOpen = useCallback(() => {
		setIsOpen(true)
	}, [])
	const handleToggle = useCallback(() => {
		setIsOpen((prev) => !prev)
	}, [])

	return (
		<Menu
			{...args}
			onClose={handleClose}
			onOpen={handleOpen}
			onToggle={handleToggle}
			isOpen={isOpen}
			Component={<Button>Open menu</Button>}
		>
			<MenuItem onClick={handleClose} label="Menu item 1 item 1" />
			<MenuItem onClick={handleClose} label="Menu item 2 item 2" />
			<MenuItem onClick={handleClose} label="Menu item 3 item 3" />
		</Menu>
	)
}

export const Default: Story = {
	render: (args) => MenuWrapper(args),
}

export const ParentWidth: Story = {
	render: (args) => MenuWrapper(args),
    args: {
        width: '100%',
    }
}

export const FullWidth: Story = {
	render: (args) => MenuWrapper(args),
    args: {
        width: '100vw',
    }
}
