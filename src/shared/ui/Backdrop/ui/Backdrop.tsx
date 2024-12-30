import { ReactElement } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Portal } from '@/shared/ui/Portal'
import { Z_INDEX } from '@/shared/constants/zIndex'
import styles from './style.module.scss'

export type BackdropVariant = 'dark' | 'clear'

interface BackdropProps {
	className?: string
	variant?: BackdropVariant
	children?: ReactElement
	isVisible: boolean
	onClose?: () => void
	zIndex?: number
	mountingAnimation?: boolean
}

export const Backdrop = (props: BackdropProps) => {
	const {
		className,
		children,
		isVisible,
		onClose,
		variant = 'dark',
		mountingAnimation,
		zIndex = Z_INDEX.BACKDROP,
	} = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['visible']]: isVisible,
		[styles['mounting-animation']]: mountingAnimation
	}

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
