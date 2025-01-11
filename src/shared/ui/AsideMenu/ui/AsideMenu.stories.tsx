import { Meta, StoryObj } from '@storybook/react'
import { AsideMenu } from './AsideMenu'
import { Button } from '@/shared/ui/Button'
import { useCallback, useRef, useState } from 'react'

const meta: Meta<typeof AsideMenu> = {
	title: 'shared/AsideMenu',
	component: AsideMenu,
	args: {
        position: 'left',
        backdrop: 'dark',
        lazy: false,
		unmount: false
    },
}

export default meta

type Story = StoryObj<typeof AsideMenu>

const AsideMenuWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
    const [disabledButton, setDisabledButton] = useState<boolean>(true)
    const [visibleNewButton, setVisibleNewButton] = useState<boolean>(false)

    const buttonRef = useRef<HTMLButtonElement | null>(null)

    const labelId = 'storybook-aside-menu-label'

    const handleToggleDisabledButton = () => {
        setDisabledButton((prev) => !prev)
    }
    const handleVisibleNewButton = () => {
        setVisibleNewButton((prev) => !prev)
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
			<Button ref={buttonRef} onClick={handleToggle}>Open aside menu</Button>
			<AsideMenu
				labelId={labelId}
				isOpen={isOpen}
				onClose={handleClose}
                {...args}
			>
				<div style={{display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px'}}>
					<h3 id={labelId} className="visually-hidden">
						Aside menu
					</h3>
					<Button color="grey" onClick={handleVisibleNewButton}>
						Add new button
					</Button>
					<Button color="grey" onClick={handleToggleDisabledButton}>
						Toggle disabled button 3
					</Button>
					<Button color="grey" disabled={disabledButton}>
						Button 3
					</Button>
					<Button color="grey" onClick={handleClose}>
						Close modal
					</Button>
					{visibleNewButton && <Button>New button</Button>}
				</div>
			</AsideMenu>
		</>
	)
}

export const Default: Story = {
	render: (args) => AsideMenuWrapper(args),
}

