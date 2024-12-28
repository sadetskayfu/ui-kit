import { ReactElement, useEffect, useRef } from 'react'
import { Portal } from '@/shared/ui/Portal'
import { classNames } from '@/shared/lib/classNames/classNames'
import { CSSTransition } from 'react-transition-group'
import styles from './style.module.scss'

type SnackbarVariant = 'filled' | 'clear'
type SnackbarPosition =
	| 'top-left'
	| 'top-right'
	| 'bottom-right'
	| 'bottom-left'

interface SnackbarProps {
	className?: string
	isVisible: boolean
	onClose: () => void
	autoHideDuration?: number
	children: ReactElement | string
	variant?: SnackbarVariant
	position?: SnackbarPosition
	zIndex?: number
}

export const Snackbar = (props: SnackbarProps) => {
	const {
		isVisible,
		onClose,
		autoHideDuration,
		children,
		variant = 'filled',
		position = 'top-right',
		className,
		zIndex = 1400,
	} = props

	const snackbarRef = useRef<HTMLDivElement | null>(null)
	const autoHideTimeoutId = useRef<NodeJS.Timeout | null>(null)

	// Auto hide
	useEffect(() => {
		if (isVisible && autoHideDuration) {
			autoHideTimeoutId.current = setTimeout(() => {
				onClose()
			}, autoHideDuration)
		}
		return () => {
			if (autoHideTimeoutId.current) clearTimeout(autoHideTimeoutId.current)
		}
	}, [isVisible, autoHideDuration, onClose])

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
		styles[position],
	]

	return (
		<CSSTransition
			nodeRef={snackbarRef}
			in={isVisible}
			timeout={300}
			unmountOnExit
			mountOnEnter
			classNames={{
				exit: styles['exit'],
			}}
		>
			<Portal>
				<div
					className={classNames(styles['snackbar'], additionalClasses)}
					style={{ zIndex }}
					ref={snackbarRef}
				>
					{typeof children === 'string' ? (
						<p className={styles['message']}>{children}</p>
					) : (
						children
					)}
				</div>
			</Portal>
		</CSSTransition>
	)
}
