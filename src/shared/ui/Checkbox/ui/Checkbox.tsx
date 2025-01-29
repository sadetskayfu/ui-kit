import { classNames } from '@/shared/helpers/classNames'
import {
	HTMLAttributes,
	InputHTMLAttributes,
	memo,
	ReactElement,
	useRef,
} from 'react'
import { CheckMark } from '@/shared/assets/icons'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple } from '@/shared/lib/ripple'
import styles from './style.module.scss'

type CheckboxVariant = 'filled' | 'outlined' | 'clear'
type CheckboxSize = 'medium'
type CheckboxColor = 'primary' | 'red'
type CheckboxOffset =
	| 'left'
	| 'right'
	| 'top'
	| 'bottom'
	| 'center-horizontal'
	| 'center-vertical'
	| 'all'

interface BaseCheckboxProps {
	className?: string
	size?: CheckboxSize
	variant?: CheckboxVariant
	color?: CheckboxColor
	offset?: CheckboxOffset
	name?: string
	labelId?: string
	required?: boolean
	disabled?: boolean
	checked?: boolean
	tabIndex?: number
	Icon?: ReactElement
	CheckedIcon?: ReactElement
	onChange?: (checked: boolean, name: string) => void
}

type HTMLInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	keyof BaseCheckboxProps
>

type HTMLProps = Omit<HTMLAttributes<HTMLElement>, keyof BaseCheckboxProps>

interface CheckboxProps extends BaseCheckboxProps {
	inputProps?: HTMLInputProps
	htmlProps?: HTMLProps
}

export const Checkbox = memo((props: CheckboxProps) => {
	const {
		className,
		size = 'medium',
		variant = 'filled',
		color = 'primary',
		offset,
		name,
		labelId,
		disabled,
		required,
		checked,
		tabIndex = 0,
		Icon,
		CheckedIcon,
		onChange,
		inputProps,
		htmlProps,
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement>(null)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(event.target.checked, event.target.name)
		handleRipple(rippleWrapperRef, true)
	}

	const additionalClasses: Array<string | undefined> = [
		styles[size],
		styles[variant],
		styles[color],
		offset && styles[offset],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['disabled']]: disabled,
	}

	return (
		<label
			className={classNames(styles['checkbox-wrapper'], [className], mods)}
			{...htmlProps}
		>
			<input
				className={styles['input']}
				type="checkbox"
				value={name}
				name={name}
				onChange={handleChange}
				tabIndex={disabled ? -1 : tabIndex}
				disabled={disabled}
				required={required}
				checked={checked}
				aria-labelledby={labelId ? labelId : undefined}
				{...inputProps}
			/>
			<div className={classNames(styles['checkbox'], additionalClasses)}>
				{Icon && <span className={styles['icon']}>{Icon}</span>}
				{CheckedIcon ? (
					<span className={styles['checked-icon']}>{CheckedIcon}</span>
				) : (
					<CheckMark className={styles['checked-icon']} />
				)}
				<RippleWrapper ref={rippleWrapperRef} />
			</div>
		</label>
	)
})
