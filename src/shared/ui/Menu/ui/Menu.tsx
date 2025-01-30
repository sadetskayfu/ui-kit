import { classNames } from '@/shared/helpers/classNames'
import {
	DropdownPortal,
	DropdownPortalPosition,
} from '@/shared/ui/DropdownPortal'
import { cloneElement, ReactElement, useId, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import {
	useKeyboardNavigation,
	useFocusableElements,
} from '@/shared/lib/KeyboardNavigation'
import { useDelayMouseHover, useTouchDevice } from '@/shared/hooks'
import styles from './style.module.scss'

export type MenuOpenVariant = 'mouse-click' | 'mouse-move'
export type MenuPosition = DropdownPortalPosition

interface MenuProps {
	className?: string
	Component: ReactElement
	children: ReactElement[]
	position?: MenuPosition
	openVariant?: MenuOpenVariant
	zIndex?: number
	isOpen: boolean
	isOpenSubMenu?: boolean
	delay?: number
	width?: string
	height?: string
	isLazy?: boolean
	isUnmount?: boolean
	dropdownRef?: React.RefObject<HTMLDivElement>
	openingElementRef: React.RefObject<HTMLElement>
	onOpen: () => void
	onClose: () => void
}

export const Menu = (props: MenuProps) => {
	const {
		className,
		children,
		Component,
		position = 'bottom',
		openVariant = 'mouse-move',
		zIndex,
		isOpen,
		isOpenSubMenu,
		delay = 200,
		width,
		height,
		isUnmount,
		isLazy,
		dropdownRef,
		openingElementRef,
		onOpen,
		onClose,
	} = props

	const menuRef = useRef<HTMLUListElement>(null)

	const { isTouchDevice } = useTouchDevice()
	const focusableElementsRef = useFocusableElements(menuRef, isOpen)

	const isNotMouseHover = isTouchDevice || openVariant === 'mouse-click'

	const labelId = useId()
	const menuId = useId()

	useKeyboardNavigation({
		elementRef: menuRef,
		focusableElementsRef,
		isOpen,
		isOpenSubMenu,
		isDropdownMenu: true,
		onClose,
	})

	const { handleMouseEnterDelay, handleMouseLeaveDelay } = useDelayMouseHover({
		onMouseEnter: onOpen,
		onMouseLeave: onClose,
		delay,
	})

	const parentProps = {
		id: labelId,
		'aria-controls': isOpen ? menuId : undefined,
		'aria-haspopup': 'menu',
		'aria-expanded': isOpen ? 'true' : 'false',
	}

	return (
		<div
			onMouseLeave={isNotMouseHover ? undefined : handleMouseLeaveDelay}
			onMouseEnter={isNotMouseHover ? undefined : handleMouseEnterDelay}
		>
			{cloneElement(Component, { ...parentProps })}
			<CSSTransition
				nodeRef={menuRef}
				in={isOpen}
				unmountOnExit={isUnmount}
				mountOnEnter={isLazy}
				timeout={200}
				classNames={{
					enter: styles['enter'],
					enterDone: styles['enter-done'],
					exit: styles['exit'],
				}}
			>
				<DropdownPortal
					isOpen={isOpen}
					onClose={onClose}
					parentRef={openingElementRef}
					position={position}
					zIndex={zIndex}
					height={height}
					width={width}
					ref={dropdownRef}
					transition
				>
					<ul
						className={classNames(styles['menu'], [className])}
						role="menu"
						ref={menuRef}
						id={menuId}
						tabIndex={-1}
						aria-labelledby={labelId}
					>
						{children}
					</ul>
				</DropdownPortal>
			</CSSTransition>
		</div>
	)
}
