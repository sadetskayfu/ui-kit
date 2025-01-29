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

type ButtonVariant = 'filled' | 'outlined' | 'clear'
type ButtonColor = 'primary' | 'secondary' | 'red' | 'orange' | 'green'
type ButtonSize = 'small' | 'medium' | 'large'

interface BaseButtonProps {
	className?: string
	id?: string
	variant?: ButtonVariant
	color?: ButtonColor
	size?: ButtonSize
	disabled?: boolean
	href?: string
	to?: string
	children: ReactNode
	type?: 'submit' | 'reset' | 'button'
	tabIndex?: number
	style?: React.CSSProperties
	onClick?: (event: any) => void
}

type HTMLLinkProps = Omit<
	LinkHTMLAttributes<HTMLAnchorElement>,
	keyof BaseButtonProps
>
type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof BaseButtonProps
>

interface ButtonProps extends BaseButtonProps {
	buttonProps?: HTMLButtonProps
	linkProps?: HTMLLinkProps
}

export const Button = memo(
	forwardRef(
		(
			props: ButtonProps,
			ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
		) => {
			const {
				children,
				id,
				className,
				disabled,
				href,
				to,
				variant = 'filled',
				size = 'medium',
				color = 'secondary',
				type = 'button',
				tabIndex,
				style,
				onClick,
				linkProps,
				buttonProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement>(null)

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)

				if (event.clientX) {
					handleRippleCursorPosition(rippleWrapperRef, event)
				} else {
					handleRipple(rippleWrapperRef)
				}
			}

			const additionalClasses: Array<string | undefined> = [
				className,
				styles[variant],
				styles[color],
				styles[size],
			]

			if (to) {
				return (
					<Link
						className={classNames(styles['button'], additionalClasses)}
						id={id}
						onClick={handleClick}
						to={to}
						tabIndex={tabIndex}
						ref={ref as React.ForwardedRef<HTMLAnchorElement>}
						style={{...style}}
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
						onClick={handleClick}
						href={href}
						tabIndex={tabIndex}
						ref={ref as React.ForwardedRef<HTMLAnchorElement>}
						style={{...style}}
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
					onClick={handleClick}
					tabIndex={disabled ? -1 : tabIndex}
					disabled={disabled}
					ref={ref as React.ForwardedRef<HTMLButtonElement>}
					style={{...style}}
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
