import { memo, ReactElement, useRef } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import styles from './style.module.scss'

interface AriaAttributes {
	'aria-label'?: string
}

export type TabSize = 'medium' | 'large'
export type TabIconPosition = 'left' | 'top' | 'right' | 'bottom'
export type TabVariant = 'filled' | 'clear'

export interface TabProps extends AriaAttributes {
	className?: string
	id: string
	panelId: string
	value: string
	isSelected?: boolean
	label?: string
	disabled?: boolean
	Icon?: ReactElement
	size?: TabSize
	variant?: TabVariant
	iconPosition?: TabIconPosition
	tabIndex?: number
	onClick?: (value: string) => void
	onKeyDown?: (event: React.KeyboardEvent) => void
	onFocus?: () => void
}

export const Tab = memo((props: TabProps) => {
	const {
		className,
		id,
		panelId,
		value,
		isSelected,
		label,
		onClick,
		onKeyDown,
		onFocus,
		disabled,
		tabIndex = -1,
		Icon,
		size = 'medium',
		iconPosition = 'left',
		variant = 'filled',
		...otherProps
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

	const handleClick = (event: React.MouseEvent) => {
		if (!isSelected) {
			handleRippleCursorPosition(rippleWrapperRef, event)
			onClick!(value)
		}
	}

	const handleKeyUp = (event: React.KeyboardEvent) => {
		if (event.key === ' ') {
			if (isSelected) {
				event.preventDefault()
			} else {
				handleRipple(rippleWrapperRef)
			}
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			if (isSelected) {
				event.preventDefault()
			} else {
				handleRipple(rippleWrapperRef)
			}
		}
		onKeyDown!(event)
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[size],
		styles[iconPosition],
		styles[variant],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['selected']]: isSelected,
		[styles['disabled']]: disabled,
	}

	const localTabIndex = isSelected && !disabled ? 0 : disabled ? -1 : tabIndex

	return (
		<button
			className={classNames(styles['tab'], additionalClasses, mods)}
			id={id}
			tabIndex={localTabIndex}
			disabled={disabled}
			onClick={handleClick}
			onKeyUp={handleKeyUp}
			onKeyDown={handleKeyDown}
			onFocus={onFocus}
			data-disabled={disabled ? 'true' : undefined}
			data-value={value}
			type="button"
			role="tab"
			aria-selected={isSelected ? 'true' : 'false'}
			aria-controls={panelId}
			{...otherProps}
		>
			{Icon && <span className={styles['icon']}>{Icon}</span>}
			{label && label}
			<RippleWrapper ref={rippleWrapperRef} />
		</button>
	)
})
