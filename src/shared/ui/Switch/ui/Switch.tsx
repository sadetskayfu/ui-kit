import { classNames } from '@/shared/lib/classNames/classNames'
import { handleRipple } from '@/shared/lib/handleRipple/handleRipple'
import { InputHTMLAttributes, memo, useRef } from 'react'
import { RippleWrapper } from '../../RippleWrapper'
import styles from './style.module.scss'

export type SwitchSize = 'medium'

interface BaseSwitchProps {
	className?: string
	size?: SwitchSize
	name?: string
	labelId?: string
	required?: boolean
	disabled?: boolean
	checked: boolean
	onChange: (checked: boolean, name:string) => void
	tabIndex?: number
}

type HTMLInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	keyof BaseSwitchProps
>

interface SwitchProps extends BaseSwitchProps {
	inputProps?: HTMLInputProps
}

export const Switch = memo((props: SwitchProps) => {
	const {
		className,
		size = 'medium',
		name,
		labelId,
		disabled,
		required,
		checked,
		onChange,
		tabIndex = 0,
		inputProps,
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.checked, event.target.name)
		handleRipple(rippleWrapperRef, true)
	}

	const additionalClasses: Array<string | undefined> = [className, styles[size]]

	const mods: Record<string, boolean | undefined> = {
		[styles['checked']]: checked,
		[styles['required']]: required,
		[styles['disabled']]: disabled,
	}

	const localTabIndex = disabled ? -1 : tabIndex

	return (
		<label className={classNames(styles['switch'], additionalClasses, mods)}>
			<input
				className={styles['input']}
				type="checkbox"
				value={name}
				name={name}
				onChange={handleChange}
				tabIndex={localTabIndex}
				disabled={disabled}
				required={required}
				checked={checked}
				aria-labelledby={labelId ? labelId : undefined}
				{...inputProps}
			/>
			<div className={styles['track']}>
				<div className={styles['thumb']}>
					<RippleWrapper ref={rippleWrapperRef} />
				</div>
			</div>
		</label>
	)
})
