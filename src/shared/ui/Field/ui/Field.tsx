import { classNames } from '@/shared/lib/classNames/classNames'
import { ForwardedRef, forwardRef, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { Typography } from '@/shared/ui/Typography'
import styles from './style.module.scss'

export type FieldVariant = 'filled' | 'outlined'
export type FieldSize = 'medium' | 'large'
export type FieldLabelVariant = 'default' | 'on-border' | 'hidden'

interface BaseFieldProps {
	children: ReactNode
	label: string
	labelId: string
	className?: string
	variant?: FieldVariant
	size?: FieldSize
	labelVariant?: FieldLabelVariant
	focused?: boolean
	errored?: boolean
	Actions: (ReactElement | undefined)[]
	StartAdornment?: ReactElement | string | number
	errorMessage?: string
	errorMessageId?: string
	helperText?: string
	focusElementRef?: React.RefObject<HTMLElement>
	disabled?: boolean
	required?: boolean
}

export type HTMLFieldProps = Omit<HTMLAttributes<HTMLDivElement>, keyof BaseFieldProps>

interface FieldProps extends BaseFieldProps {
	htmlProps?: HTMLFieldProps
}

export const Field = forwardRef(
	(props: FieldProps, ref: ForwardedRef<HTMLDivElement>) => {
		const {
			children,
			label,
			labelId,
			className,
			variant = 'outlined',
			size = 'medium',
			labelVariant = 'on-border',
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
			htmlProps = {}
		} = props

		const {onClick, ...otherHtmlProps} = htmlProps

		const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
			const focusElement = focusElementRef?.current

			if (focusElement) {
				focusElement.focus()
			}
			onClick?.(event)
		}

		const additionalClasses: Array<string | undefined> = [
			styles[variant],
			styles[size],
			styles[labelVariant],
		]

		const mods: Record<string, boolean | undefined> = {
			[styles['focused']]: focused,
			[styles['errored']]: errored,
			[styles['disabled']]: disabled,
			[styles['required']]: required,
		}

		return (
			<div
				className={classNames(styles['field-wrapper'], additionalClasses, mods)}
			>
				<span className={styles['label']} id={labelId}>
					{label}
				</span>
				<div
					className={classNames(styles['field'], [className])}
					onClick={handleClick}
					ref={ref}
					{...otherHtmlProps}
				>
					{StartAdornment && (
						<div className={styles['start-adornment']}>{StartAdornment}</div>
					)}
					{children}
					{Actions.length > 0 && <div className={styles['actions']}>{Actions}</div>}
					{labelVariant === 'on-border' && (
						<fieldset className={styles['fieldset']} aria-hidden="true">
							<legend className={styles['legend']}>
								{label}
								{required && ' *'}
							</legend>
						</fieldset>
					)}
				</div>
				{errorMessage && (
					<Typography
						className={styles['helper-text']}
						id={errorMessageId}
						color="error"
						variant="helper-text"
					>
						{errorMessage}
					</Typography>
				)}
				{helperText && !errorMessage && (
					<Typography className={styles['helper-text']} variant="helper-text">
						{helperText}
					</Typography>
				)}
			</div>
		)
	}
)
