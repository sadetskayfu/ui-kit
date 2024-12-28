import { Meta, StoryObj } from '@storybook/react'
import { Dropdown } from './Dropdown'
import { Button } from '@/shared/ui/Button'
import { useRef, useState } from 'react'

const meta: Meta<typeof Dropdown> = {
	title: 'shared/Dropdown',
	component: Dropdown,
	args: {
		position: 'bottom',
        transition: false,
	},
}

export default meta

type Story = StoryObj<typeof Dropdown>

const DropdownWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const handleClose = () => {
		setIsOpen(false)
	}
	const handleToggle = () => {
		setIsOpen((prev) => !prev)
	}

	return (
		<div style={{position: 'relative'}}>
			<Button onClick={handleToggle} ref={buttonRef} color="grey">
				Open dropdown
			</Button>
			<Dropdown
				{...args}
				parentRef={buttonRef}
				isOpen={isOpen}
				onClose={handleClose}
			>
				<div style={{ backgroundColor: 'brown', height: '100%', overflowY: 'auto' }}>
						<p>Text text text text text text text text text text text text text</p>
						<p>Text text text text text text text text </p>
						<p>Text text text text text text text text text</p>
                        <Button>Test</Button>
				</div>
			</Dropdown>
		</div>
	)
}

export const Default: Story = {
	render: (args) => DropdownWrapper(args),
    args: {
        width: '300px',
    }
}

export const ParentWidth: Story = {
	render: (args) => DropdownWrapper(args),
	args: {
		width: '100%',
	},
}

export const ParentHeight: Story = {
	render: (args) => DropdownWrapper(args),
	args: {
		height: '100%',
	},
}

