import { ReactNode, useRef } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Backdrop, BackdropVariant } from '@/shared/ui/Backdrop'
import { Z_INDEX } from '@/shared/constants/zIndex'
import { CSSTransition } from 'react-transition-group'
import {
	getFocusableElements,
	useKeyboardNavigation,
} from '@/shared/lib/KeyboardNavigation'
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
	isLazy?: boolean
	isUnmount?: boolean
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
		isLazy,
		isUnmount
	} = props

	const menuRef = useRef<HTMLDivElement | null>(null)

	const focusableElementsRef = getFocusableElements(menuRef, isOpen)

	useKeyboardNavigation({
		elementRef: menuRef,
		focusableElementsRef,
		isOpen,
		onClose,
	})

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[position],
	]

	return (
		<CSSTransition
			nodeRef={menuRef}
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
