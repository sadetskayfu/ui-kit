import { AriaRole, memo, ReactNode, useRef } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { handleRippleMousePosition } from '@/shared/lib/handleRipple/handleRipple'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { CheckMark } from '@/shared/assets/icons'
import styles from './style.module.scss'

export interface OptionItemProps {
	className?: string
	children?: ReactNode
	disabled?: boolean
	selected?: boolean
	readonly?: boolean
	value?: string
	label?: string
	id?: string
	role?: AriaRole
}

export const OptionItem = memo((props: OptionItemProps) => {
	const {
		className,
		children,
		disabled,
		selected,
		readonly,
		value,
		label,
		id,
		role = 'option',
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

	const mods: Record<string, boolean | undefined> = {
		[styles['disabled']]: disabled,
		[styles['readonly']]: readonly,
		[styles['selected']]: selected,
	}

	const handleClick = (event: React.MouseEvent) => {
		handleRippleMousePosition(rippleWrapperRef, event)
	}

	return (
		<li
			className={classNames(styles['menu-item'], [className], mods)}
			id={id}
			role={role}
			tabIndex={-1}
			data-disabled={disabled || readonly ? true : undefined}
			data-value={value}
			aria-selected={selected ? 'true' : 'false'}
			aria-disabled={disabled ? 'true' : undefined}
			aria-readonly={readonly ? 'true' : undefined}
			onClick={handleClick}
		>
			<span className={styles['bg']}></span>
			{children ? children : label}
			{selected && (
				<CheckMark
					className={styles['check-mark']}
					color="primary"
					size="small-xx"
				/>
			)}
			<RippleWrapper ref={rippleWrapperRef} />
		</li>
	)
})
