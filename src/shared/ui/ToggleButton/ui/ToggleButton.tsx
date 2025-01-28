import { ButtonHTMLAttributes, forwardRef, memo, ReactNode, useRef } from 'react'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { classNames } from '@/shared/helpers/classNames'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import styles from './style.module.scss'

type ToggleButtonSize = 'small' | 'medium' | 'large'
type ToggleButtonColor = 'primary' | 'secondary'

type AriaAttribute = {
	'aria-label'?: string
}

interface BaseToggleButtonProps extends AriaAttribute {
	className?: string
	size?: ToggleButtonSize
	color?: ToggleButtonColor
	children: ReactNode
	value: string
	isSelected?: boolean
	disabled?: boolean
    tabIndex?: number
	onChange?: (value: string) => void
}

type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof BaseToggleButtonProps
>

export interface ToggleButtonProps extends BaseToggleButtonProps {
	buttonProps?: HTMLButtonProps
}

export const ToggleButton = memo(forwardRef((props: ToggleButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
	const {
		className,
		size = 'medium',
		color = 'primary',
		children,
		value,
		isSelected,
        disabled,
        tabIndex = 0,
		onChange,
		buttonProps,
		...otherProps
	} = props

    const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

    const handleClick = (event: React.MouseEvent) => {
        onChange!(value)

        if(event.clientX) {
            handleRippleCursorPosition(rippleWrapperRef, event)
        } else {
            handleRipple(rippleWrapperRef)
        }
    }

    const mods: Record<string, boolean | undefined> = {
        [styles['selected']]: isSelected
    }

    const additionalClasses: Array<string | undefined> = [
        className,
		styles[size],
		styles[color]
    ]

	return (
		<button
			className={classNames(styles['button'], additionalClasses, mods)}
            ref={ref}
            disabled={disabled}
            tabIndex={disabled ? -1 : tabIndex}
			type='button'
            onClick={handleClick}
			aria-pressed={isSelected ? 'true' : 'false'}
			{...buttonProps}
			{...otherProps}
		>
			{children}
            <RippleWrapper ref={rippleWrapperRef}/>
		</button>
	)
}))
