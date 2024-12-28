import { classNames } from '@/shared/lib/classNames/classNames'
import {
	DropdownPortal,
	DropdownPortalPosition,
} from '@/shared/ui/DropdownPortal'
import {
	cloneElement,
	ReactElement,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react'
import { ID } from '@/shared/constants/id'
import { CSSTransition } from 'react-transition-group'
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
	onToggle: () => void
	delay?: number
	width?: string
	height?: string
	lazy?: boolean
	dropdownRef?: React.RefObject<HTMLDivElement>
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
		onToggle,
		delay = 500,
		width,
		height,
		lazy,
		dropdownRef
	} = props

	const [activeIndex, setActiveIndex] = useState<number>(-1)

	const menuRef = useRef<HTMLUListElement | null>(null)
	const parentRef = useRef<HTMLElement | null>(null)
	const focusableElementsRef = useRef<HTMLElement[]>([])
	const isTouchDeviceRef = useRef<boolean>(false)

	const labelId = useId()
	const menuId = useId()

	const mountingDelayTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
	const unmountingDelayTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

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

	const handleMouseEnter = useCallback(() => {
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
	}, [openVariant, isOpen, onOpen, delay])

	// Get items
	useEffect(() => {
		const menu = menuRef.current

		if (!menu || !isOpen) return

		const updateFocusableElements = () => {
			const focusableElements = Array.from(
				menu.querySelectorAll<HTMLElement>(
					'a, button, input, textarea, select, [tabindex]'
				)
			).filter((el) => el.tabIndex !== -1)

			focusableElementsRef.current = focusableElements
		}

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					// Ignoring non HTML elements and add ripple <span>
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.id !== ID.RIPPLE) {
							updateFocusableElements()
						}
					})
					// Ignoring non HTML elements and remove ripple <span>
					mutation.removedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.id !== ID.RIPPLE) {
							updateFocusableElements()
						}
					})
				}
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'tabindex'
				) {
					updateFocusableElements()
				}
			})
		})

		observer.observe(menu, {
			childList: true,
			subtree: true,
			attributes: true,
		})

		updateFocusableElements()

		return () => {
			observer.disconnect()
		}
	}, [isOpen])

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (isOpenSubMenu) return

			let newIndex = activeIndex
			const currentFocusableElements = focusableElementsRef.current

			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowUp':
				case 'ArrowLeft':
				case 'ArrowRight':
					event.preventDefault()
					const direction =
						event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1
					newIndex =
						newIndex === -1 && direction === -1
							? currentFocusableElements.length - 1
							: (activeIndex + direction + currentFocusableElements.length) %
								currentFocusableElements.length
					currentFocusableElements[newIndex].focus()
					break
				case 'Escape':
				case 'Tab':
					event.preventDefault()
					onClose()
					parentRef.current?.focus()
					break
				default:
					break
			}

			if (newIndex !== activeIndex) {
				setActiveIndex(newIndex)
			}
		},
		[activeIndex, onClose, isOpenSubMenu]
	)

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleKeyDown, isOpen])

	// Reset active index
	useEffect(() => {
		if (!isOpen && activeIndex !== -1) {
			setActiveIndex(-1)
		}
	}, [activeIndex, isOpen])

	useEffect(() => {
		if ('ontouchstart' in window) {
			isTouchDeviceRef.current = true
		} else {
			isTouchDeviceRef.current = false
		}
	}, [])

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
		onClick: onToggle,
		ref: parentRef,
		id: labelId,
		'aria-controls': isOpen ? menuId : undefined,
		'aria-haspopup': 'menu',
		'aria-expanded': isOpen ? 'true' : undefined,
	}

	return (
		<div onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
			{cloneElement(Component, { ...parentProps })}
			<CSSTransition
				nodeRef={menuRef}
				in={isOpen}
				unmountOnExit={lazy}
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
					parentRef={parentRef}
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
