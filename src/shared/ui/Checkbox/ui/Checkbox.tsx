import { classNames } from '@/shared/helpers/classNames'
import { InputHTMLAttributes, memo, ReactElement, useRef } from 'react'
import { CheckMark } from '@/shared/assets/icons'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple } from '@/shared/lib/ripple'
import styles from './style.module.scss'

type CheckboxVariant = 'filled' | 'outlined' | 'clear'
type CheckboxSize = 'medium'
type CheckboxColor = 'primary' | 'red'

interface BaseCheckboxProps {
	className?: string
	size?: CheckboxSize
	variant?: CheckboxVariant
	color?: CheckboxColor
	name?: string
	labelId?: string
	required?: boolean
	disabled?: boolean
	checked?: boolean
	Icon?: ReactElement
	CheckedIcon?: ReactElement
	onChange?: (checked: boolean, name: string) => void
}

type HTMLInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	keyof BaseCheckboxProps
>

interface CheckboxProps extends BaseCheckboxProps {
	inputProps?: HTMLInputProps
}

export const Checkbox = memo((props: CheckboxProps) => {
	const {
		className,
		size = 'medium',
		variant = 'filled',
		color = 'primary',
		name,
		labelId,
		disabled,
		required,
		checked,
		Icon,
		CheckedIcon,
		onChange,
		inputProps,
		...otherProps
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.checked, event.target.name)

		handleRipple(rippleWrapperRef, true)
	}

	const additionalClasses: Array<string | undefined> = [
		styles[size],
		styles[variant],
		styles[color],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['disabled']]: disabled,
	}

	const tabIndex = disabled ? -1 : 0

	return (
		<label className={classNames(styles['checkbox-wrapper'], [className], mods)}>
			<input
				className={styles['input']}
				type="checkbox"
				value={name}
				name={name}
				onChange={handleChange}
				tabIndex={tabIndex}
				disabled={disabled}
				required={required}
				checked={checked}
				aria-labelledby={labelId ? labelId : undefined}
				{...inputProps}
				{...otherProps}
			/>
			<div className={classNames(styles['checkbox'], additionalClasses)}>
				{Icon && <span className={styles['icon']}>{Icon}</span>}
				{CheckedIcon ? (
					<span className={styles['checked-icon']}>{CheckedIcon}</span>
				) : (
					<CheckMark className={styles['checked-icon']} />
				)}
				<RippleWrapper ref={rippleWrapperRef}/>
			</div>
		</label>
	)
})
