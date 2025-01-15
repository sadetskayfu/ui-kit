import { ReactElement, useRef } from 'react'
import { Backdrop, BackdropVariant } from '@/shared/ui/Backdrop'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Z_INDEX } from '@/shared/constants/zIndex'
import { CSSTransition } from 'react-transition-group'
import {
	getFocusableElements,
	useKeyboardNavigation,
} from '@/shared/lib/KeyboardNavigation'
import styles from './style.module.scss'

export type ModalBackdrop = BackdropVariant

interface ModalProps {
	className?: string
	labelId: string
	children: ReactElement
	isOpen: boolean
	onClose: () => void
	backdrop?: ModalBackdrop
	zIndex?: number
	isLazy?: boolean
	isUnmount?: boolean
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
		isLazy,
		isUnmount,
	} = props

	const modalRef = useRef<HTMLDivElement | null>(null)

	const focusableElementsRef = getFocusableElements(modalRef, isOpen)

	useKeyboardNavigation({
		elementRef: modalRef,
		focusableElementsRef,
		isOpen,
		onClose,
	})

	const additionalClasses: Array<string | undefined> = [className]

	return (
		<CSSTransition
			nodeRef={modalRef}
			in={isOpen}
			timeout={200}
			unmountOnExit={isUnmount}
			mountOnEnter={isLazy}
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
				mountingAnimation={isLazy}
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
