import { classNames } from '@/shared/lib/classNames/classNames'
import { ForwardedRef, forwardRef, ReactElement, ReactNode } from 'react'
import { Typography } from '@/shared/ui/Typography'
import styles from './style.module.scss'

export type FieldVariant = 'filled' | 'outlined'
export type FieldSize = 'medium' | 'large'

interface FieldProps {
	children: ReactNode
	label: string
	labelId: string
	className?: string
	variant?: FieldVariant
	size?: FieldSize
	focused?: boolean
	errored?: boolean
	Actions: ReactElement[]
	StartAdornment?: ReactElement | string | number
	errorMessage?: string
	errorMessageId?: string
	helperText?: string
	focusElementRef?: React.RefObject<HTMLElement>
    disabled?: boolean
    required?: boolean
    hiddenLabel?: boolean
}

export const Field = forwardRef((props: FieldProps, ref: ForwardedRef<HTMLDivElement>) => {
	const {
		children,
		label,
		labelId,
		className,
		variant = 'filled',
		size = 'large',
		focused,
		errored,
		Actions,
		StartAdornment,
		errorMessage,
		errorMessageId,
		helperText,
		focusElementRef,
        disabled,
        required,
        hiddenLabel
	} = props

	const handleClick = () => {
		const focusElement = focusElementRef?.current

		if (focusElement) {
			focusElement.focus()
		}
	}

	const additionalClasses: Array<string | undefined> = [
		styles[variant],
		styles[size],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['focused']]: focused,
		[styles['errored']]: errored,
        [styles['disabled']]: disabled,
        [styles['required']]: required,
        [styles['hidden-label']]: hiddenLabel
	}

	return (
		<div className={classNames(styles['field-wrapper'], additionalClasses, mods)}>
			<span className={styles['label']} id={labelId}>
				{label}
			</span>
			<div
				className={classNames(styles['field'], [className])}
				onClick={handleClick}
				onMouseDown={(event) => event.preventDefault()}
				ref={ref}
			>
				{StartAdornment && (
					<div className={styles['start-adornment']}>{StartAdornment}</div>
				)}
				{children}
				{Actions.length > 0 && <div className={styles['actions']}>{Actions}</div>}
			</div>
			{errorMessage && (
				<Typography id={errorMessageId} color="error" variant="helper-text">
					{errorMessage}
				</Typography>
			)}
			{helperText && !errorMessage && (
				<Typography variant="helper-text">{helperText}</Typography>
			)}
		</div>
	)
})
