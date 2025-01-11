import { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '@/shared/ui/Button'
import { useCallback, useRef, useState } from 'react'

const meta: Meta<typeof Modal> = {
	title: 'shared/Modal',
	component: Modal,
	args: {
		backdrop: 'dark',
		lazy: false,
	},
}

export default meta

type Story = StoryObj<typeof Modal>

const ModalWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [isDisabledButton, setIsDisabledButton] = useState<boolean>(true)
	const [isVisibleNewButton, setIsVisibleNewButton] = useState<boolean>(false)

	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const labelId = 'storybook-aside-menu-label'

	const handleToggleDisabledButton = () => {
		setIsDisabledButton((prev) => !prev)
	}
	const handleVisibleNewButton = () => {
		setIsVisibleNewButton((prev) => !prev)
	}

	const handleClose = useCallback(() => {
		setIsOpen(false)
		buttonRef.current?.focus()
	}, [])
	const handleToggle = useCallback(() => {
		setIsOpen((prev) => !prev)
	}, [])

	return (
		<>
			<Button ref={buttonRef} onClick={handleToggle}>
				Open aside menu
			</Button>
			<Modal
				labelId={labelId}
				isOpen={isOpen}
				onClose={handleClose}
				{...args}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '10px',
						padding: '10px',
					}}
				>
					<h3 id={labelId} className="visually-hidden">
						Aside menu
					</h3>
					<Button color="grey" onClick={handleVisibleNewButton}>
						Add new button
					</Button>
					<Button color="grey" onClick={handleToggleDisabledButton}>
						Toggle disabled button 3
					</Button>
					<Button color="grey" disabled={isDisabledButton}>
						Button 3
					</Button>
					<Button color="grey" onClick={handleClose}>
						Close modal
					</Button>
					{isVisibleNewButton && <Button>New button</Button>}
				</div>
			</Modal>
		</>
	)
}

export const Default: Story = {
	render: (args) => ModalWrapper(args),
}
