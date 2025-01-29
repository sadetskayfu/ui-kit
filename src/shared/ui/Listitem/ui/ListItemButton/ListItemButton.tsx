import { ButtonHTMLAttributes, forwardRef, memo, useRef } from 'react'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { classNames } from '@/shared/helpers/classNames'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import { BaseListItemProps } from '../../types/BaseListItemProps'
import { Indicator } from '@/shared/ui/Indicator'
import styles from './style.module.scss'

type AriaAttributes = {
	'aria-controls'?: string
	'aria-expanded'?: 'true' | 'false'
}

interface BaseListItemButtonProps extends AriaAttributes, BaseListItemProps {
	id?: string
	disabled?: boolean
	isActive?: boolean
	isSelected?: boolean
	tabIndex?: number
	onClick?: (event: any) => void
}

type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof BaseListItemButtonProps
>

interface ListItemButtonProps extends BaseListItemButtonProps {
	buttonProps?: HTMLButtonProps
}

export const ListItemButton = memo(
	forwardRef(
		(props: ListItemButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
			const {
				className,
				id,
				children,
				disabled,
				isActive,
				isSelected,
				tabIndex = 0,
				role = 'listitem',
				style,
				onClick,
				buttonProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)

				if(event.clientX) {
					handleRippleCursorPosition(rippleWrapperRef, event)
				} else {
					handleRipple(rippleWrapperRef)
				}
			}

			const mods: Record<string, boolean | undefined> = {
				[styles['selected']]: isSelected,
				[styles['active']]: isActive,
			}

			const additionalClasses: Array<string | undefined> = [className]

			return (
				<button
					className={classNames(styles['button'], additionalClasses, mods)}
					id={id}
					onClick={handleClick}
					tabIndex={disabled ? -1 : tabIndex}
					type="button"
					role={role}
					disabled={disabled}
					ref={ref}
					style={{ ...style }}
					{...buttonProps}
					{...otherProps}
				>
					{children}
					<RippleWrapper ref={rippleWrapperRef} />
					<Indicator color='secondary' isActive={isActive} position='bottom' weight='soft'/>
				</button>
			)
		}
	)
)
