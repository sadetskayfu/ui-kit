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

type HTMLLinkProps = Omit<
	LinkHTMLAttributes<HTMLAnchorElement>,
	'href' | 'tabIndex' | 'onKeyDown' | 'onMouseDown' | 'onClick' | 'aria-readonly'
>
type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	| 'disabled'
	| 'type'
	| 'tabIndex'
	| 'onClick'
	| 'onKeyDown'
	| 'onMouseDown'
	| 'aria-readonly'
>

interface ButtonProps {
	className?: string
	id?: string
	variant?: ButtonVariant
	color?: ButtonColor
	size?: ButtonSize
	disabled?: boolean
	stopFocus?: boolean
	isLink?: boolean
	isExternalLink?: boolean
	to?: string
	children: string
	type?: 'submit' | 'reset' | 'button'
	StartIcon?: ReactNode
	EndIcon?: ReactNode
	tabIndex?: number
	onClick?: () => void
	onMouseDown?: () => void
	onKeyDown?: () => void
	linkProps?: HTMLLinkProps
	buttonProps?: HTMLButtonProps
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
				stopFocus,
				isLink,
				isExternalLink,
				to = '',
				variant = 'filled',
				size = 'medium',
				color = 'primary',
				type = 'button',
				StartIcon,
				EndIcon,
				tabIndex,
				onClick,
				onMouseDown,
				onKeyDown,
				linkProps,
				buttonProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)
			const localLinkRef = useRef<HTMLAnchorElement | null>(null)
			const linkRef = ref
				? (ref as React.RefObject<HTMLAnchorElement>)
				: localLinkRef

			const handleKeyDown = (event: React.KeyboardEvent) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
					event.stopPropagation()

					if (isLink || isExternalLink) {
						linkRef.current?.click()
					} else {
						onClick?.()
					}

					handleRipple(rippleWrapperRef)
				}
				onKeyDown?.()
			}

			const handleMouseDown = (event: React.MouseEvent) => {
				if (stopFocus) {
					event.preventDefault()
				}

				onMouseDown?.()
			}

			const handleClick = (event: React.MouseEvent) => {
				event.stopPropagation()
				onClick?.()
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

			if (isLink) {
				return (
					<Link
						className={classNames(styles['button'], additionalClasses, mods)}
						id={id}
						onKeyDown={handleKeyDown}
						onMouseDown={handleMouseDown}
						onClick={handleClick}
						to={to}
						tabIndex={localTabIndex}
						ref={linkRef}
						{...linkProps}
						{...otherProps}
					>
						{StartIcon ? StartIcon : undefined}
						{children}
						{EndIcon ? EndIcon : undefined}
						<RippleWrapper ref={rippleWrapperRef} />
					</Link>
				)
			}

			if (isExternalLink) {
				return (
					<a
						className={classNames(styles['button'], additionalClasses, mods)}
						id={id}
						onKeyDown={handleKeyDown}
						onMouseDown={handleMouseDown}
						onClick={handleClick}
						href={to}
						tabIndex={localTabIndex}
						ref={linkRef}
						{...linkProps}
						{...otherProps}
					>
						{StartIcon ? StartIcon : undefined}
						{children}
						{EndIcon ? EndIcon : undefined}
						<RippleWrapper ref={rippleWrapperRef} />
					</a>
				)
			}

			return (
				<button
					className={classNames(styles['button'], additionalClasses, mods)}
					id={id}
					type={type}
					onMouseDown={handleMouseDown}
					onKeyDown={handleKeyDown}
					onClick={handleClick}
					tabIndex={localTabIndex}
					disabled={disabled}
					ref={ref && (ref as React.ForwardedRef<HTMLButtonElement>)}
					{...buttonProps}
					{...otherProps}
				>
					{StartIcon ? StartIcon : undefined}
					{children}
					{EndIcon ? EndIcon : undefined}
					<RippleWrapper ref={rippleWrapperRef} />
				</button>
			)
		}
	)
)
