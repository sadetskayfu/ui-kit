import { MenuItem } from '@/shared/ui/MenuItem'
import './styles/main.scss'
import { useCallback, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Menu } from '@/shared/ui/Menu'


export default function App() {
	return (
		<div className="app">
				<MenuWrapper />
		</div>
	)
}

const MenuWrapper = () => {
	const [open, setOpen] = useState<boolean>(false)

	const handleClose = useCallback(() => {
		setOpen(false)
	}, [])
	const handleOpen = useCallback(() => {
		setOpen(true)
	}, [])
	const handleToggle = useCallback(() => {
		setOpen((prev) => !prev)
	}, [])

	return (
		<Menu
			onClose={handleClose}
			onOpen={handleOpen}
			onToggle={handleToggle}
			Component={<Button>Open menu</Button>}
			isOpen={open}
		>
			<MenuItem onClick={handleClose} label="Menu item 1 item 1" />
			<MenuItem onClick={handleClose} label="Menu item 2 item 2" />
			<MenuItem onClick={handleClose} label="Menu item 3 item 3" />
		</Menu>
	)
}