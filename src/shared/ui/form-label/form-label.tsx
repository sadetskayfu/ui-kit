import { memo, type ReactNode, useCallback } from 'react'
import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names'
import styles from './form-label.module.scss'

interface FormLabelProps {
    id?: string
    className?: string
    children: ReactNode
	inputId?: string
	focusTarget?: React.RefObject<HTMLElement | null>
	component?: 'label' | 'legend' | 'span'
	color?: 'soft' | 'hard'
	required?: boolean
	focused?: boolean
	errored?: boolean
	disabled?: boolean
    onClick?: React.MouseEventHandler<HTMLElement>
}

export const FormLabel = memo((props: FormLabelProps) => {
	const {
		className,
		children,
		id,
		inputId,
		focusTarget: focusTargetRef,
		component = 'label',
		color = 'soft',
		required,
		focused,
		errored,
		disabled,
		onClick,
	} = props

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			onClick?.(event)

			if (focusTargetRef && focusTargetRef.current && (focusTargetRef.current !== document.activeElement)) {
                focusTargetRef.current.focus()
			}
		},
		[focusTargetRef, onClick]
	)

	const additionalClasses: AdditionalClasses = [
		className,
		styles[`color-${color}`]
	]

	const mods: Mods = {
		[styles['focused']]: focused,
		[styles['errored']]: errored,
		[styles['disabled']]: disabled,
	}

	if (component === 'label') {
		return (
			<label
				className={classNames(styles['form-label'], additionalClasses, mods)}
				id={id}
				htmlFor={inputId}
				onClick={handleClick}
			>
				{children}
				{required && <span aria-hidden="true"> *</span>}
			</label>
		)
	}

	if (component === 'legend') {
		return (
			<legend
				className={classNames(styles['form-label'], additionalClasses, mods)}
				id={id}
				onClick={handleClick}
			>
				{children}
				{required && <span aria-hidden="true"> *</span>}
			</legend>
		)
	}

	if (component === 'span') {
		return (
			<span
				className={classNames(styles['form-label'], additionalClasses, mods)}
				id={id}
				onClick={handleClick}
			>
				{children}
				{required && <span aria-hidden="true"> *</span>}
			</span>
		)
	}
})