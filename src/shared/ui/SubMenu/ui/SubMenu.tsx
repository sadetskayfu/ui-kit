import { classNames } from '@/shared/helpers/classNames'
import { Dropdown, DropdownPosition } from '@/shared/ui/Dropdown'
import {
	cloneElement,
	ReactElement,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react'
import { Portal } from '@/shared/ui/Portal'
import { useTouchDevice } from '@/shared/hooks'
import {
	getFocusableElements,
	useKeyboardNavigation,
} from '@/shared/lib/KeyboardNavigation'
import styles from './style.module.scss'

interface SubMenuProps {
	className?: string
	Component: ReactElement
	children: ReactElement[]
	width?: string
	height?: string
	position?: DropdownPosition
	isOpenParentMenu: boolean
	isOpen: boolean
	zIndex?: number
	portalTarget: HTMLElement | null
	setIsOpen: (value: boolean) => void
}

export const SubMenu = (props: SubMenuProps) => {
	const {
		className,
		children,
		Component,
		position = 'right',
		width,
		height,
		isOpenParentMenu,
		isOpen,
		zIndex,
		portalTarget,
		setIsOpen,
	} = props

	const [isMounting, setIsMounting] = useState<boolean>(false)
	const isMountingRef = useRef<boolean>(isMounting)

	const menuRef = useRef<HTMLDivElement | null>(null)
	const openingElementRef = useRef<HTMLElement | null>(null)

	const focusableElementsRef = getFocusableElements(menuRef, isMounting)

	const { isTouchDeviceRef } = useTouchDevice()

	const labelId = useId()
	const menuId = useId()

	const handleOpenMenu = useCallback(() => {
		if (!isMountingRef.current) {
			setIsMounting(true)
		}
		setIsOpen(true)
	}, [])

	const handleCloseMenu = useCallback(() => {
		setIsOpen(false)
		openingElementRef.current?.focus()
	}, [])

	const handleMouseEnter = useCallback(() => {
		if (isTouchDeviceRef.current) return
		handleOpenMenu()
	}, [handleOpenMenu])

	const handleMouseLeave = () => {
		if (isTouchDeviceRef.current) return
		setIsOpen(false)
	}

	useKeyboardNavigation({
		elementRef: menuRef,
		focusableElementsRef,
		isOpen,
		isDropdownMenu: true,
		isOpenSubMenu: false,
		onClose: handleCloseMenu,
	})

	useEffect(() => {
		isMountingRef.current = isMounting
	}, [isMounting])

	// Close submenu if parent menu closed
	useEffect(() => {
		if (!isOpenParentMenu && isOpen) {
			setIsOpen(false)
		}
	}, [isOpenParentMenu])

	// Set aria-attribute and toggle active class
	useEffect(() => {
		const openingElement = openingElementRef.current

		if (!openingElement) return

		openingElement.setAttribute('aria-expanded', isOpen ? 'true' : 'false')

		if (isOpen) {
			openingElement.classList.add(styles['active'])
		} else {
			openingElement.classList.remove(styles['active'])
		}
	}, [isOpen])

	const openingElementProps = {
		ref: openingElementRef,
		id: labelId,
		onMouseEnter: handleMouseEnter,
		onClick: handleOpenMenu,
		'aria-controls': menuId,
		'aria-haspopup': 'menu',
	}

	const memoizeOpeningElement = useMemo(
		() => cloneElement(Component, { ...openingElementProps }),
		[handleOpenMenu, handleMouseEnter]
	)

	return (
		<div onMouseLeave={handleMouseLeave}>
			{memoizeOpeningElement}
			{isMounting && (
				<Portal portalTarget={portalTarget}>
					<Dropdown
						isOpen={isOpen}
						onClose={handleCloseMenu}
						parentRef={openingElementRef}
						width={width}
						height={height}
						position={position}
						zIndex={zIndex}
						transition
					>
						<div
							className={classNames(styles['menu'], [className])}
							role="menu"
							ref={menuRef}
							id={menuId}
							aria-labelledby={labelId}
						>
							{children}
						</div>
					</Dropdown>
				</Portal>
			)}
		</div>
	)
}
