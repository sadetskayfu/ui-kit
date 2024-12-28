import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Backdrop, BackdropVariant } from '@/shared/ui/Backdrop'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Z_INDEX } from '@/shared/constants/zIndex'
import { ID } from '@/shared/constants/id'
import styles from './style.module.scss'
import { CSSTransition } from 'react-transition-group'

export type ModalBackdrop = BackdropVariant

interface ModalProps {
	className?: string
	labelId: string
	children: ReactElement
	isOpen: boolean
	onClose: () => void
	backdrop?: ModalBackdrop
	zIndex?: number
	triggerButtonRef?: React.RefObject<HTMLElement>
	lazy?: boolean
}

export const Modal = (props: ModalProps) => {
	const {
		className,
		labelId,
		children,
		isOpen,
		onClose,
		backdrop = 'dark',
		zIndex = Z_INDEX.MODAL,
		triggerButtonRef,
		lazy,
	} = props

	const [activeIndex, setActiveIndex] = useState<number>(-1)

	const modalRef = useRef<HTMLDivElement | null>(null)
	const focusableElementsRef = useRef<HTMLElement[]>([])

	// Get items
	useEffect(() => {
		const modal = modalRef.current

		if (!modal || !isOpen) return

		const updateFocusableElements = () => {
			const focusableElements = Array.from(
				modal.querySelectorAll<HTMLElement>(
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

		observer.observe(modal, {
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

	// Focus on modal after open
	useEffect(() => {
		if (isOpen && activeIndex === -1) {
			modalRef.current?.focus()
		}
	}, [activeIndex, isOpen])

	// Reset active index
	useEffect(() => {
		if (!isOpen && activeIndex !== -1) {
			setActiveIndex(-1)
		}
	}, [isOpen, activeIndex])

	const additionalClasses: Array<string | undefined> = [className]

	return (
		<CSSTransition
			nodeRef={modalRef}
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
					className={classNames(styles['modal'], additionalClasses)}
					ref={modalRef}
					role="dialog"
					aria-labelledby={labelId}
					aria-modal="true"
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
