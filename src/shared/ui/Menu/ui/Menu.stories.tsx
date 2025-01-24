import { Meta, StoryObj } from '@storybook/react'
import { Menu } from './Menu'
import { Button } from '@/shared/ui/Button'
import { useCallback, useRef, useState } from 'react'
import { MenuItem } from '@/shared/ui/MenuItem'

const meta: Meta<typeof Menu> = {
	title: 'shared/Menu',
	component: Menu,
	args: {
		position: 'bottom',
		openVariant: 'mouse-move',
		delay: 200,
		isLazy: false,
		isUnmount: false,
	},
}

export default meta

type Story = StoryObj<typeof Menu>

const MenuWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const handleClose = useCallback(() => {
		setIsOpen(false)
		buttonRef.current?.focus()
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
				isOpen={isOpen}
				openingElementRef={buttonRef}
				Component={<Button onClick={handleToggle} ref={buttonRef}>Open menu</Button>}
			>
				<MenuItem onClick={handleClose} label="Menu item 1 zxc" />
				<MenuItem onClick={handleClose} label="Menu item 2 zxc" />
				<MenuItem onClick={handleClose} label="Menu item 3 zxc" />
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
	},
}

export const FullWidth: Story = {
	render: (args) => MenuWrapper(args),
	args: {
		width: '100vw',
	},
}
