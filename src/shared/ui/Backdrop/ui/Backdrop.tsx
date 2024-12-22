import { ReactElement } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Portal } from '@/shared/ui/Portal'
import styles from './style.module.scss'

type BackdropVariant = 'dark' | 'clear'

interface BackdropProps {
	className?: string
	variant?: BackdropVariant
	children?: ReactElement
	isVisible: boolean
	unmountingAnimation?: boolean
	mountingAnimation?: boolean
	onClose?: () => void
	zIndex?: number
}

export const Backdrop = (props: BackdropProps) => {
	const {
		className,
		children,
		isVisible,
		unmountingAnimation,
		mountingAnimation,
		onClose,
		variant = 'dark',
		zIndex = 1000,
	} = props

	const mods: Record<string, boolean | undefined> = {
		[styles['visible']]: isVisible,
		[styles['unmounting']]: unmountingAnimation,
		[styles['mounting']]: mountingAnimation,
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
	]

	return (
		<Portal>
			<div
				style={{ zIndex: isVisible ? zIndex : -1000 }}
				onClick={onClose}
				className={classNames(styles['backdrop'], additionalClasses, mods)}
			>
				{children}
			</div>
		</Portal>
	)
}
