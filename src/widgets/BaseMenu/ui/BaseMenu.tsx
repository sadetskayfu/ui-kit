import { Button } from '@/shared/ui/Button'
import { memo, useCallback, useRef, useState } from 'react'
import { Menu } from '@/shared/ui/Menu'
import { MenuItem } from '@/shared/ui/MenuItem'
import { SubMenu } from '@/shared/ui/SubMenu/ui/SubMenu'
import { Divider } from '@/shared/ui/Divider'
import { Arrow, Bell, Envelope, Gear, Plus } from '@/shared/assets/icons'
import styles from './style.module.scss'

export const BaseMenu = memo(() => {
	const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
	const [isOpenSubMenu, setIsOpenSubMenu] = useState<boolean>(false)

	const mainMenuRef = useRef<HTMLDivElement | null>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const handleOpen = useCallback(() => {
		setIsOpenMenu(true)
	}, [])

	const handleClose = useCallback(() => {
		setIsOpenMenu(false)
		buttonRef.current?.focus()
	}, [])

	const handleToggle = useCallback(() => {
		setIsOpenMenu((prev) => !prev)
	}, [])

	return (
		<Menu
			className={styles['menu']}
			isOpen={isOpenMenu}
			isOpenSubMenu={isOpenSubMenu}
			onOpen={handleOpen}
			onClose={handleClose}
			dropdownRef={mainMenuRef}
			openingElementRef={buttonRef}
			lazy
			Component={
				<Button onClick={handleToggle} ref={buttonRef} color="grey">
					Open menu
				</Button>
			}
		>
			<MenuItem
				label="Menu item bell"
				description="Description description"
				StartIcon={<Bell />}
			/>
			<MenuItem
				label="Menu item search"
				description="Description description description description"
				StartIcon={<Envelope />}
			/>
			<MenuItem
				label="Menu item search"
				description="Description description description description"
				StartIcon={<Envelope />}
			/>
			<MenuItem label="Menu item setting" StartIcon={<Gear />} />
			<SubMenu
				isOpen={isOpenSubMenu}
				isOpenParentMenu={isOpenMenu}
				setIsOpen={setIsOpenSubMenu}
				height="100%"
				width="100%"
				className={styles['sub-menu']}
				portalTarget={mainMenuRef.current}
				Component={
					<MenuItem
						label="Menu item other"
						StartIcon={<Plus />}
						EndIcon={<Arrow />}
					/>
				}
			>
				<MenuItem label="Menu item 1" description="Description description" />
				<MenuItem label="Menu item 2" description="Description description" />
				<MenuItem label="Menu item 3" description="Description description" />
			</SubMenu>
			<Divider component="li" orientation="horizontal" />
			<MenuItem onClick={handleClose} label="Close" />
		</Menu>
	)
})
