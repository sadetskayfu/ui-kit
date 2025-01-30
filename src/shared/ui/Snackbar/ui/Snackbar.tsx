import { ReactElement, useEffect, useRef } from 'react'
import { Portal } from '@/shared/ui/Portal'
import { classNames } from '@/shared/helpers/classNames'
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
	autoHideDuration?: number
	children: ReactElement | string
	variant?: SnackbarVariant
	position?: SnackbarPosition
	zIndex?: number
	onClose: () => void
}

export const Snackbar = (props: SnackbarProps) => {
	const {
		isVisible,
		autoHideDuration,
		children,
		variant = 'filled',
		position = 'top-right',
		className,
		zIndex = 1400,
		onClose,
	} = props

	const snackbarRef = useRef<HTMLDivElement>(null)
	const autoHideTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

	// Auto hide
	useEffect(() => {
		if (autoHideDuration && isVisible) {
			autoHideTimeoutIdRef.current = setTimeout(() => {
				onClose()
			}, autoHideDuration)
		}
		return () => {
			if (autoHideTimeoutIdRef.current) clearTimeout(autoHideTimeoutIdRef.current)
		}
	// eslint-disable-next-line
	}, [isVisible])

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
