import { classNames } from '@/shared/lib/classNames/classNames'
import {
	DropdownPortal,
	DropdownPortalPosition,
} from '@/shared/ui/DropdownPortal'
import { cloneElement, ReactElement, useEffect, useId, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import { useKeyboardNavigation, getFocusableElements } from '@/shared/lib/KeyboardNavigation'
import { useTouchDevice } from '@/shared/hooks'
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
	onOpen: () => void
	onClose: () => void
	delay?: number
	width?: string
	height?: string
	lazy?: boolean
	unmount?: boolean
	dropdownRef?: React.RefObject<HTMLDivElement>
	openingElementRef: React.RefObject<HTMLElement>
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
		onOpen,
		onClose,
		delay = 500,
		width,
		height,
		unmount,
		lazy,
		dropdownRef,
		openingElementRef,
	} = props

	const menuRef = useRef<HTMLUListElement | null>(null)

	const isTouchDeviceRef = useTouchDevice()
	const focusableElementsRef = getFocusableElements(menuRef, isOpen)

	const mountingDelayTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
	const unmountingDelayTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

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

	const handleMouseLeave = () => {
		if (isTouchDeviceRef.current || openVariant === 'mouse-click') return

		if (mountingDelayTimeoutIdRef.current && delay !== 0) {
			clearTimeout(mountingDelayTimeoutIdRef.current)
		}
		if (isOpen && delay !== 0) {
			unmountingDelayTimeoutIdRef.current = setTimeout(() => {
				onClose()
			}, delay)
		} else {
			onClose()
		}
	}

	const handleMouseEnter = () => {
		if (isTouchDeviceRef.current || openVariant === 'mouse-click') return

		if (unmountingDelayTimeoutIdRef.current && delay !== 0) {
			clearTimeout(unmountingDelayTimeoutIdRef.current)
		}
		if (!isOpen && delay !== 0) {
			mountingDelayTimeoutIdRef.current = setTimeout(() => {
				onOpen()
			}, delay)
		} else {
			onOpen()
		}
	}

	// Clear timeouts
	useEffect(() => {
		return () => {
			if (mountingDelayTimeoutIdRef.current) {
				clearTimeout(mountingDelayTimeoutIdRef.current)
			}
			if (unmountingDelayTimeoutIdRef.current) {
				clearTimeout(unmountingDelayTimeoutIdRef.current)
			}
		}
	}, [])

	const parentProps = {
		id: labelId,
		'aria-controls': isOpen ? menuId : undefined,
		'aria-haspopup': 'menu',
		'aria-expanded': isOpen ? 'true' : 'false',
	}

	return (
		<div onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
			{cloneElement(Component, { ...parentProps })}
			<CSSTransition
				nodeRef={menuRef}
				in={isOpen}
				unmountOnExit={unmount}
				mountOnEnter={lazy}
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
						aria-labelledby={labelId}
					>
						{children}
					</ul>
				</DropdownPortal>
			</CSSTransition>
		</div>
	)
}
