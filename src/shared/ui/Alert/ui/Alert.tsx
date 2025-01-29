import { ReactElement, ReactNode } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

type AlertVariant = 'filled' | 'outlined' | 'clear'
type AlertSeverity = 'success' | 'info' | 'warning' | 'error'
type AlertBorderRadius = 'medium' | "large" | 'none'

interface AlertProps {
	className?: string
	Action?: ReactElement | ReactElement[]
	Icon?: ReactElement
	children: ReactNode
	variant?: AlertVariant
	severity?: AlertSeverity
	borderRadius?: AlertBorderRadius
}

export const Alert = (props: AlertProps) => {
	const {
		className,
		Action,
		Icon,
		children,
		variant = 'filled',
		severity = 'info',
		borderRadius = 'medium ',
	} = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
		styles[severity],
		styles[borderRadius],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['have-action']]: !!Action,
	}

	return (
		<div
			role="alert"
			className={classNames(styles['alert'], additionalClasses, mods)}
		>
			{Icon}
			<div className={styles['content']}>
			{children}
			</div>
			{Action && <div className={styles['actions']}>{Action}</div>}
		</div>
	)
}
