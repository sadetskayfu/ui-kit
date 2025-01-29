import {
	ButtonHTMLAttributes,
	forwardRef,
	LinkHTMLAttributes,
	memo,
	ReactNode,
	useRef,
} from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

type AriaAttributes = {
	'aria-label'?: string
	'aria-current'?: 'true' | 'false'
}

type IconButtonVariant = 'filled' | 'outlined' | 'clear'
type IconButtonSize =
	| 'small-xx'
	| 'small-x'
	| 'small'
	| 'medium'
	| 'large'
	| 'custom-size'
export type IconButtonColor = 'primary' | 'secondary' | 'green' | 'orange' | 'red' | 'inherit'
export type IconButtonBorderRadius =
	| 'rounded-left'
	| 'rounded-right'
	| 'rounded'
	| 'circular'
	| 'square'

interface BaseIconButtonProps extends AriaAttributes {
	className?: string
	id?: string
	variant?: IconButtonVariant
	color?: IconButtonColor
	size?: IconButtonSize
	borderRadius?: IconButtonBorderRadius
	stopPropagation?: boolean
	stopFocus?: boolean
	disabled?: boolean
	to?: string
	href?: string
	children: ReactNode
	type?: 'submit' | 'reset' | 'button'
	tabIndex?: number
	style?: React.CSSProperties
	onClick?: (event: any) => void
}

type HTMLLinkProps = Omit<
	LinkHTMLAttributes<HTMLAnchorElement>,
	keyof BaseIconButtonProps
>
type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof BaseIconButtonProps
>

interface IconButtonProps extends BaseIconButtonProps {
	buttonProps?: HTMLButtonProps
	linkProps?: HTMLLinkProps
}

const IconButton = memo(
	forwardRef(
		(
			props: IconButtonProps,
			ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
		) => {
			const {
				children,
				id,
				className,
				disabled,
				stopPropagation,
				stopFocus,
				to,
				href,
				variant = 'filled',
				size = 'medium',
				color = 'secondary',
				borderRadius = 'circular',
				type = 'button',
				tabIndex,
				style,
				onClick,
				linkProps,
				buttonProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement>(null)

			const handleKeyUp = (event: React.KeyboardEvent) => {
				if (event.key === ' ' || event.key === 'Enter') {
					if(stopPropagation) {
						event.stopPropagation()
					}
				}
			}

			const handleClick = (event: React.MouseEvent) => {
				if(stopPropagation) {
					event.stopPropagation()
				}

				onClick?.(event)

				if (event.clientX) {
					handleRippleCursorPosition(rippleWrapperRef, event)
				} else {
					handleRipple(rippleWrapperRef)
				}
			}

			const handleMouseDown = (event: React.MouseEvent) => {
				event.preventDefault()
			}

			const additionalClasses: Array<string | undefined> = [
				className,
				styles[variant],
				styles[color],
				styles[size],
				styles[borderRadius],
			]

			if (to) {
				return (
					<Link
						className={classNames(styles['button'], additionalClasses)}
						id={id}
						to={to}
						tabIndex={tabIndex}
						onClick={handleClick}
						onKeyUp={handleKeyUp}
						onMouseDown={stopFocus ? handleMouseDown : undefined}
						style={{...style}}
						ref={ref as React.ForwardedRef<HTMLAnchorElement>}
						{...linkProps}
						{...otherProps}
					>
						{children}
						<RippleWrapper ref={rippleWrapperRef} />
					</Link>
				)
			}

			if (href) {
				return (
					<a
						className={classNames(styles['button'], additionalClasses)}
						id={id}
						href={href}
						tabIndex={tabIndex}
						onClick={handleClick}
						onKeyUp={handleKeyUp}
						onMouseDown={stopFocus ? handleMouseDown : undefined}
						style={{...style}}
						ref={ref as React.ForwardedRef<HTMLAnchorElement>}
						{...linkProps}
						{...otherProps}
					>
						{children}
					</a>
				)
			}

			return (
				<button
					className={classNames(styles['button'], additionalClasses)}
					id={id}
					type={type}
					onKeyUp={handleKeyUp}
					onClick={handleClick}
					onMouseDown={stopFocus ? handleMouseDown : undefined}
					tabIndex={disabled ? -1 : tabIndex}
					disabled={disabled}
					style={{...style}}
					ref={ref as React.ForwardedRef<HTMLButtonElement>}
					{...buttonProps}
					{...otherProps}
				>
					{children}
					<RippleWrapper ref={rippleWrapperRef} />
				</button>
			)
		}
	)
)

export default IconButton
