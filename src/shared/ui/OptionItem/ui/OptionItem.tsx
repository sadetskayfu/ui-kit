import { AriaRole, memo, ReactNode, useRef } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { CheckMark } from '@/shared/assets/icons'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRippleCursorPosition } from '@/shared/lib/ripple'
import styles from './style.module.scss'

export interface OptionItemProps {
	className?: string
	children?: ReactNode
	isSelected?: boolean
	disabled?: boolean
	readOnly?: boolean
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
		isSelected,
		readOnly,
		value,
		label,
		id,
		role = 'option',
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

	const mods: Record<string, boolean | undefined> = {
		[styles['disabled']]: disabled,
		[styles['readonly']]: readOnly,
		[styles['selected']]: isSelected,
	}

	const handleClick = (event: React.MouseEvent) => {
		if(event.clientX) {
			handleRippleCursorPosition(rippleWrapperRef, event)
		}
	}

	return (
		<li
			className={classNames(styles['menu-item'], [className], mods)}
			id={id}
			role={role}
			tabIndex={-1}
			data-disabled={disabled || readOnly ? true : undefined}
			data-value={value}
			aria-selected={isSelected ? 'true' : 'false'}
			aria-disabled={disabled ? 'true' : undefined}
			aria-readonly={readOnly ? 'true' : undefined}
			onClick={handleClick}
		>
			<span className={styles['bg']}></span>
			{children ? children : label}
			{isSelected && (
				<CheckMark
					className={styles['check-mark']}
					color="primary"
					size="small-xx"
				/>
			)}
			<RippleWrapper ref={rippleWrapperRef}/>
		</li>
	)
})
