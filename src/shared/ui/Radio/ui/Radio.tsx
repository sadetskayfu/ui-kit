import { InputHTMLAttributes, memo, useRef } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { handleRipple } from '@/shared/lib/ripple'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import styles from './style.module.scss'

type RadioSize = 'medium'
type RadioVariant = 'filled' | 'outlined'

interface BaseRadioProps {
	className?: string
	size?: RadioSize
	variant?: RadioVariant
	name: string
	labelId?: string
	disabled?: boolean
	value: string
	checked: boolean
	onChange: (value: string) => void
}

type HTMLInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	keyof BaseRadioProps
>

interface RadioProps extends BaseRadioProps {
	inputProps?: HTMLInputProps
}

export const Radio = memo((props: RadioProps) => {
	const {
		className,
		size = 'medium',
		variant = 'filled',
		name,
		value,
		labelId,
		disabled,
		checked,
		onChange,
		inputProps,
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value)
		handleRipple(rippleWrapperRef, true)
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[size],
		styles[variant],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['disabled']]: disabled,
		[styles['checked']]: checked,
	}

	const tabIndex = disabled ? -1 : 0

	return (
		<label
			className={classNames(styles['radio-wrapper'], additionalClasses, mods)}
		>
			<input
				className={styles['input']}
				type="radio"
				name={name}
				value={value}
				onChange={handleChange}
				checked={checked}
				tabIndex={tabIndex}
				disabled={disabled}
				aria-labelledby={labelId ? labelId : undefined}
				{...inputProps}
			/>
			<div className={styles['radio']}>
				<span className={styles['emulator']}></span>
				<RippleWrapper ref={rippleWrapperRef} />
			</div>
		</label>
	)
})
