import { Children, cloneElement, HTMLAttributes, ReactElement, useId } from 'react'
import { classNames } from '@/shared/helpers/classNames/classNames'
import { Typography } from '@/shared/ui/Typography'
import styles from './style.module.scss'

type FormGroupOrientation = 'horizontal' | 'vertical'

interface BaseFormGroupProps {
	className?: string
	children: ReactElement[]
	label: string
	errorMessage?: string
	helperText?: string
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
		orientation = 'horizontal',
		required,
		hiddenLegend,
		fieldsetProps,
	} = props

	const errorMessageId = useId()

	const renderChildren = () => {
		return Children.map(children, (child: ReactElement) => {
			return cloneElement(child, {
				onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
			})
		})
	}

	const additionalClasses: Array<string | undefined> = [
		className,
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
				<Typography id={errorMessageId} color="error" variant="helper-text">
					{errorMessage}
				</Typography>
			)}
			{helperText && !errorMessage && (
				<Typography variant="helper-text">{helperText}</Typography>
			)}
		</fieldset>
	)
}
