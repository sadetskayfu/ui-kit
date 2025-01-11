import { cloneElement, memo, ReactElement, useRef } from 'react'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import {
	handleRipple,
	handleRippleMousePosition,
} from '@/shared/lib/handleRipple/handleRipple'
import { classNames } from '@/shared/lib/classNames/classNames'
import { IconProps } from '@/shared/assets/icons'
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
	selectedValue?: string
	onClick?: (value: string) => void
	onKeyDown?: (event: React.KeyboardEvent) => void
	onFocus?: () => void
	label?: string
	disabled?: boolean
	Icon?: ReactElement<IconProps>
	size?: TabSize
    variant?: TabVariant
	iconPosition?: TabIconPosition
	tabIndex?: number
    fullWidth?: boolean
}

export const Tab = memo((props: TabProps) => {
	const {
        className,
        id,
        panelId,
		value,
		selectedValue,
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
        fullWidth,
        ...otherProps
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

	const isSelected = selectedValue === value

	const handleClick = (event: React.MouseEvent) => {
		if (isSelected) return

		handleRippleMousePosition(rippleWrapperRef, event)
		onClick!(value)
	}

	const handleKeyUp = (event: React.KeyboardEvent) => {
		if ((event.key === 'Enter' || event.key === ' ') && !isSelected) {
			event.preventDefault()
			handleRipple(rippleWrapperRef)
			onClick!(value)
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			event.preventDefault()
		}
		onKeyDown!(event)
	}

	const additionalClasses: Array<string | undefined> = [
        className,
		styles[size],
		styles[iconPosition],
        styles[variant]
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['selected']]: isSelected,
		[styles['disabled']]: disabled,
        [styles['full-width']]: fullWidth
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
            type='button'
            role='tab'
            aria-selected={isSelected ? 'true' : 'false'}
            aria-controls={panelId}
            {...otherProps}
		>
			{Icon && cloneElement(Icon, { className: styles['icon'] })}
			{label && label}
			<RippleWrapper ref={rippleWrapperRef} />
		</button>
	)
})
