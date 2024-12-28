import {
	ButtonHTMLAttributes,
	forwardRef,
	LinkHTMLAttributes,
	memo,
	ReactNode,
	useRef,
} from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
	handleRipple,
	handleRippleMousePosition,
} from '@/shared/lib/handleRipple/handleRipple'
import styles from './style.module.scss'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { Link } from 'react-router-dom'

type ButtonVariant = 'filled' | 'outlined' | 'clear'
type ButtonColor = 'primary' | 'dark' | 'grey'
type ButtonSize = 'medium' | 'large'

interface BaseButtonProps {
	className?: string
	id?: string
	variant?: ButtonVariant
	color?: ButtonColor
	size?: ButtonSize
	disabled?: boolean
	href?: string
	to?: string
	children: string
	type?: 'submit' | 'reset' | 'button'
	StartIcon?: ReactNode
	EndIcon?: ReactNode
	tabIndex?: number
	onClick?: (event: React.KeyboardEvent | React.MouseEvent) => void
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
			ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement | null>
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
				color = 'primary',
				type = 'button',
				StartIcon,
				EndIcon,
				tabIndex,
				onClick,
				linkProps,
				buttonProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)
			const localLinkRef = useRef<HTMLAnchorElement | null>(null)
			const linkRef = ref
				? (ref as React.RefObject<HTMLAnchorElement>)
				: localLinkRef

			const handleKeyUp = (event: React.KeyboardEvent) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()

					if (to || href) {
						linkRef.current?.click()
					} else {
						onClick?.(event)
					}

					handleRipple(rippleWrapperRef)
				}
			}

			const handleKeyDown = (event: React.KeyboardEvent) => {
				if(event.key === 'Enter') {
					event.preventDefault()
				}
			}

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)
				handleRippleMousePosition(rippleWrapperRef, event)
			}

			const additionalClasses: Array<string | undefined> = [
				className,
				styles[variant],
				styles[color],
				styles[size],
			]

			const mods: Record<string, boolean | undefined> = {
				[styles['disabled']]: disabled,
			}

			const localTabIndex = disabled ? -1 : tabIndex

			if (to) {
				return (
					<Link
						className={classNames(styles['button'], additionalClasses, mods)}
						id={id}
						onKeyUp={handleKeyUp}
						onKeyDown={handleKeyDown}
						onClick={handleClick}
						to={to}
						tabIndex={localTabIndex}
						ref={linkRef}
						{...linkProps}
						{...otherProps}
					>
						{StartIcon && StartIcon}
						{children}
						{EndIcon && EndIcon}
						<RippleWrapper ref={rippleWrapperRef} />
					</Link>
				)
			}

			if (href) {
				return (
					<a
						className={classNames(styles['button'], additionalClasses, mods)}
						id={id}
						onKeyUp={handleKeyUp}
						onKeyDown={handleKeyDown}
						onClick={handleClick}
						href={href}
						tabIndex={localTabIndex}
						ref={linkRef}
						{...linkProps}
						{...otherProps}
					>
						{StartIcon && StartIcon}
						{children}
						{EndIcon && EndIcon}
					</a>
				)
			}

			return (
				<button
					className={classNames(styles['button'], additionalClasses, mods)}
					id={id}
					type={type}
					onKeyUp={handleKeyUp}
					onKeyDown={handleKeyDown}
					onClick={handleClick}
					tabIndex={localTabIndex}
					disabled={disabled}
					ref={ref && (ref as React.ForwardedRef<HTMLButtonElement>)}
					{...buttonProps}
					{...otherProps}
				>
					{StartIcon && StartIcon}
					{children}
					{EndIcon && EndIcon}
					<RippleWrapper ref={rippleWrapperRef} />
				</button>
			)
		}
	)
)
