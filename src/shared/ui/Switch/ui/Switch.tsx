import { classNames } from '@/shared/helpers/classNames'
import { HTMLAttributes, InputHTMLAttributes, memo, useRef } from 'react'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple } from '@/shared/lib/ripple'
import styles from './style.module.scss'

type SwitchSize = 'medium'
type SwitchOffset =
	| 'left'
	| 'right'
	| 'top'
	| 'bottom'
	| 'center-horizontal'
	| 'center-vertical'
	| 'all'

interface BaseSwitchProps {
	className?: string
	size?: SwitchSize
	offset?: SwitchOffset
	name?: string
	labelId?: string
	required?: boolean
	disabled?: boolean
	checked?: boolean
	tabIndex?: number
	onChange?: (checked: boolean, name: string) => void
}

type HTMLInputProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	keyof BaseSwitchProps
>

type HTMLProps = Omit<HTMLAttributes<HTMLElement>, keyof BaseSwitchProps>

interface SwitchProps extends BaseSwitchProps {
	inputProps?: HTMLInputProps
	htmlProps?: HTMLProps
}

export const Switch = memo((props: SwitchProps) => {
	const {
		className,
		size = 'medium',
		offset,
		name,
		labelId,
		disabled,
		required,
		checked,
		tabIndex,
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
		className,
		styles[size],
		offset && styles[offset],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['required']]: required,
		[styles['disabled']]: disabled,
	}

	return (
		<label
			className={classNames(styles['switch'], additionalClasses, mods)}
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
			<div className={styles['track']}>
				<div className={styles['thumb']}>
					<RippleWrapper ref={rippleWrapperRef} />
				</div>
			</div>
		</label>
	)
})
