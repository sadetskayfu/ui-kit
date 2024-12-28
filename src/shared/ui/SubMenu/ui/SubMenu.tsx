import { classNames } from '@/shared/lib/classNames/classNames'
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
import { ID } from '@/shared/constants/id'
import { Portal } from '@/shared/ui/Portal'
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
	setOpen: (value: boolean) => void
	zIndex?: number
	portalTarget: HTMLElement | null
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
		setOpen,
		zIndex,
		portalTarget,
	} = props

	const [activeIndex, setActiveIndex] = useState<number>(-1)

	const menuRef = useRef<HTMLUListElement | null>(null)
	const parentRef = useRef<HTMLElement | null>(null)
	const focusableElementsRef = useRef<HTMLElement[]>([])
	const isTouchDeviceRef = useRef<boolean>(false)

	const labelId = useId()
	const menuId = useId()

	const handleOpenMenu = useCallback(() => {
		setOpen(true)
	}, [])
	const handleCloseMenu = useCallback(() => {
		setOpen(false)
	}, [])
	const handleMouseEnter = useCallback(() => {
		if (isTouchDeviceRef.current) return
		handleOpenMenu()
	}, [handleOpenMenu])
	const handleMouseLeave = () => {
		if (isTouchDeviceRef.current) return
		handleCloseMenu()
	}

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
			let newIndex = activeIndex
			const currentFocusableElements = focusableElementsRef.current

			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowUp':
				case 'ArrowRight':
				case 'ArrowLeft':
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
				case 'Tab':
				case 'Escape':
					event.preventDefault()
					handleCloseMenu()
					parentRef.current?.focus()
					break
				default:
					break
			}

			if (newIndex !== activeIndex) {
				setActiveIndex(newIndex)
			}
		},
		[activeIndex, handleCloseMenu]
	)

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleKeyDown, isOpen])

	// Close submenu if parent menu closed
	useEffect(() => {
		if (!isOpenParentMenu && isOpen) {
			setOpen(false)
		}
	}, [isOpenParentMenu])

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

	// Set aria-attribute and toggle active class
	useEffect(() => {
		const parent = parentRef.current

		if (!parent) return

		parent.setAttribute('aria-expanded', isOpen ? 'true' : 'false')

		if (isOpen) {
			parent.classList.add(styles['active'])
		} else {
			parent.classList.remove(styles['active'])
		}
	}, [isOpen])

	const parentProps = {
		onMouseEnter: handleMouseEnter,
		onClick: handleOpenMenu,
		ref: parentRef,
		id: labelId,
		'aria-controls': menuId,
		'aria-haspopup': 'menu',
	}

	const memoizeParent = useMemo(
		() => cloneElement(Component, { ...parentProps }),
		[handleOpenMenu, handleMouseEnter]
	)

	return (
		<div onMouseLeave={handleMouseLeave}>
			{memoizeParent}
			<Portal portalTarget={portalTarget}>
				<Dropdown
					isOpen={isOpen}
					onClose={handleCloseMenu}
					parentRef={parentRef}
					width={width}
					height={height}
					position={position}
					zIndex={zIndex}
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
				</Dropdown>
			</Portal>
		</div>
	)
}
