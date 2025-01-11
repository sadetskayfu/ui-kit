import { Meta, StoryObj } from '@storybook/react'
import { DropdownPortal } from './DropdownPortal'
import { Button } from '@/shared/ui/Button'
import { useCallback, useRef, useState } from 'react'
import { useDragging } from '@/shared/hooks'

const meta: Meta<typeof DropdownPortal> = {
	title: 'shared/DropdownPortal',
	component: DropdownPortal,
	args: {
		position: 'bottom',
        transition: false,
	},
}

export default meta

type Story = StoryObj<typeof DropdownPortal>

const DropdownPortalWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const handleClose = () => {
		setIsOpen(false)
	}
	const handleToggle = useCallback(() => {
		setIsOpen((prev) => !prev)
	}, [])

	const {handleMouseDown} = useDragging(buttonRef)

	return (
		<>
			<Button buttonProps={{onMouseDown: handleMouseDown, style: {position: 'absolute'}}} onClick={handleToggle} ref={buttonRef} color="grey">
				Open dropdown
			</Button>
			<DropdownPortal
				{...args}
				parentRef={buttonRef}
				isOpen={isOpen}
				onClose={handleClose}
			>
				<div style={{ backgroundColor: 'brown', height: '100%', overflowY: 'auto' }}>
						<p>Text text text text text text text text text text text text text</p>
						<p>Text text text text text text text text </p>
						<p>Text text text text text text text text text</p>
                        <Button color='dark'>Button</Button>
				</div>
			</DropdownPortal>
		</>
	)
}

export const Default: Story = {
	render: (args) => DropdownPortalWrapper(args),
}

export const ParentWidth: Story = {
	render: (args) => DropdownPortalWrapper(args),
	args: {
		width: '100%',
		position: 'bottom',
	},
}

export const ParentHeight: Story = {
	render: (args) => DropdownPortalWrapper(args),
	args: {
		height: '100%',
		position: 'right',
	},
}

export const FullScreenWidth: Story = {
	render: (args) => DropdownPortalWrapper(args),
	args: {
		width: '100vw',
		position: 'bottom',
	},
}

export const FullScreenHeight: Story = {
	render: (args) => DropdownPortalWrapper(args),
	args: {
		height: '100vh',
		position: 'right',
	},
}

