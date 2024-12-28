import { Button } from '@/shared/ui/Button'
import { memo, useCallback, useRef, useState } from 'react'
import { Menu, MenuOpenVariant, MenuPosition} from '@/shared/ui/Menu'
import { MenuItem } from '@/shared/ui/MenuItem'
import { SubMenu } from '@/shared/ui/SubMenu/ui/SubMenu'
import { Icon } from '@/shared/ui/Icon'
import { Divider } from '@/shared/ui/Divider'
import styles from './style.module.scss'

interface BaseMenuProps {
	openVariant?: MenuOpenVariant
	position?: MenuPosition
}

export const BaseMenu = memo((props: BaseMenuProps) => {
	const {openVariant, position = 'bottom-start' } = props

	const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
	const [isOpenSubMenu, setIsOpenSubMenu] = useState<boolean>(false)

	const mainMenuRef = useRef<HTMLDivElement | null>(null)

	const handleOpen = useCallback(() => {
		setIsOpenMenu(true)
	}, [])
	const handleClose = useCallback(() => {
		setIsOpenMenu(false)
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
			onToggle={handleToggle}
			openVariant={openVariant}
			position={position}
			dropdownRef={mainMenuRef}
			Component={<Button color='grey'>Open menu</Button>}
			
		>
			<MenuItem
				label="Menu item bell"
				description="Description description"
				StartIcon={<Icon variant="bell" />}
			/>
			<MenuItem
				label="Menu item search"
				description="Description description description description"
				StartIcon={<Icon variant="search" />}
			/>
			<MenuItem
				label="Menu item search"
				description="Description description description description"
				StartIcon={<Icon variant="search" />}
			/>
			<MenuItem label="Menu item setting" StartIcon={<Icon variant="gear" />} />
			<SubMenu
				isOpen={isOpenSubMenu}
				isOpenParentMenu={isOpenMenu}
				setOpen={setIsOpenSubMenu}
				height="100%"
				width="100%"
				className={styles['sub-menu']}
				portalTarget={mainMenuRef.current}
				Component={
					<MenuItem
						label="Menu item other"
						StartIcon={<Icon variant="plus" />}
						EndIcon={<Icon variant="arrow" />}
					/>
				}
			>
				<MenuItem label="Menu item 1" description="Description description" />
				<MenuItem label="Menu item 2" description="Description description" />
				<MenuItem label="Menu item 3" description="Description description" />
			</SubMenu>
			<Divider component= 'li' orientation="horizontal" />
			<MenuItem label="Close" />
		</Menu>
	)
})
