import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Backdrop, BackdropVariant } from '@/shared/ui/Backdrop'
import { Z_INDEX } from '@/shared/constants/zIndex'
import { ID } from '@/shared/constants/id'
import { CSSTransition } from 'react-transition-group'
import styles from './style.module.scss'

export type AsideMenuPosition = 'left' | 'right' | 'top' | 'bottom'
export type AsideMenuBackdrop = BackdropVariant

interface AsideMenuProps {
	className?: string
	labelId: string
	children: ReactNode
	isOpen: boolean
	onClose: () => void
	position?: AsideMenuPosition
	backdrop?: AsideMenuBackdrop
	zIndex?: number
	triggerButtonRef?: React.RefObject<HTMLElement>
	lazy?: boolean
}

export const AsideMenu = (props: AsideMenuProps) => {
	const {
		className,
		labelId,
		children,
		isOpen,
		onClose,
		position = 'left',
		backdrop = 'dark',
		zIndex = Z_INDEX.ASIDE_MENU,
		triggerButtonRef,
		lazy,
	} = props

	const [activeIndex, setActiveIndex] = useState<number>(-1)

	const menuRef = useRef<HTMLDivElement | null>(null)
	const focusableElementsRef = useRef<HTMLElement[]>([])

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
				case 'Tab':
					event.preventDefault()
					const direction = event.shiftKey ? -1 : 1
					newIndex =
						newIndex === -1 && direction === -1
							? currentFocusableElements.length - 1
							: (activeIndex + direction + currentFocusableElements.length) %
								currentFocusableElements.length
					currentFocusableElements[newIndex].focus()
					break
				case 'Escape':
					event.preventDefault()
					triggerButtonRef?.current?.focus()
					onClose()
					break
				default:
					break
			}

			if (newIndex !== activeIndex) {
				setActiveIndex(newIndex)
			}
		},
		[activeIndex, onClose]
	)

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleKeyDown, isOpen, activeIndex])

	// Focus on menu after open
	useEffect(() => {
		if (isOpen && activeIndex === -1) {
			menuRef.current?.focus()
		}
	}, [activeIndex, isOpen])

	// Reset active index
	useEffect(() => {
		if (!isOpen && activeIndex !== -1) {
			setActiveIndex(-1)
		}
	}, [isOpen, activeIndex])

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[position],
	]

	return (
		<CSSTransition
			nodeRef={menuRef}
			in={isOpen}
			timeout={200}
			unmountOnExit={lazy}
			mountOnEnter={lazy}
			classNames={{
				enter: styles['enter'],
				enterDone: styles['enter-done'],
				exit: styles['exit'],
			}}
		>
			<Backdrop
				isVisible={isOpen}
				onClose={onClose}
				variant={backdrop}
				zIndex={zIndex}
				mountingAnimation={lazy}
			>
				<div
					ref={menuRef}
					className={classNames(styles['aside-menu'], additionalClasses)}
					role="menu"
					aria-modal="true"
					aria-labelledby={labelId}
					tabIndex={-1}
					style={{ zIndex }}
					onClick={(event: React.MouseEvent) => event.stopPropagation()}
				>
					{children}
				</div>
			</Backdrop>
		</CSSTransition>
	)
}
