import { Children, cloneElement, HTMLAttributes, ReactElement, useId } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Typography } from '@/shared/ui/Typography'
import styles from './style.module.scss'

type FormGroupSize = 'medium'
type FormGroupOrientation = 'horizontal' | 'vertical'

interface BaseFormGroupProps {
	className?: string
	children: ReactElement[]
	label: string
	errorMessage?: string
	helperText?: string
	size?: FormGroupSize
	orientation?: FormGroupOrientation
	required?: boolean
	hiddenLegend?: boolean
}

type HTMLFieldsetProps = Omit<HTMLAttributes<HTMLFieldSetElement>, keyof BaseFormGroupProps>

interface FormGroupProps extends BaseFormGroupProps {
	fieldsetProps?: HTMLFieldsetProps
}

export const FormGroup = (props: FormGroupProps) => {
	const {
		className,
		children,
		label,
		errorMessage,
		helperText,
		size = 'medium',
		orientation = 'horizontal',
		required,
		hiddenLegend,
		fieldsetProps,
	} = props

	const errorMessageId = useId()

	const renderChildren = () => {
		return Children.map(children, (child: ReactElement) => {
			return cloneElement(child, {
				size,
				onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
			})
		})
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[size],
		styles[orientation],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['errored']]: !!errorMessage,
		[styles['required']]: required,
		[styles['hidden-legend']]: hiddenLegend,
	}

	return (
		<fieldset
			className={classNames(styles['form-group'], additionalClasses, mods)}
			aria-required={required ? 'true' : 'false'}
			aria-errormessage={errorMessage ? errorMessageId : undefined}
			{...fieldsetProps}
		>
			<legend className={styles['legend']}>{label}</legend>
			<div className={styles['items']}>{renderChildren()}</div>
			{errorMessage && (
				<Typography className={styles['helper-text']} id={errorMessageId} color="error" variant="helper-text">
					{errorMessage}
				</Typography>
			)}
			{helperText && !errorMessage && (
				<Typography className={styles['helper-text']} variant="helper-text">{helperText}</Typography>
			)}
		</fieldset>
	)
}
