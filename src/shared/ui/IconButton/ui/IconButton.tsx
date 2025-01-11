import {
	ButtonHTMLAttributes,
	forwardRef,
	LinkHTMLAttributes,
	ReactNode,
	useRef,
} from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
	handleRipple,
	handleRippleMousePosition,
} from '@/shared/lib/handleRipple/handleRipple'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

type IconButtonVariant = 'filled' | 'outlined' | 'clear'
export type IconButtonColor = 'primary' | 'dark' | 'grey' | 'custom-color'
type IconButtonSize =
	| 'small-xx'
	| 'small-x'
	| 'small'
	| 'medium'
	| 'large'
	| 'custom-size'

export type IconButtonBorderRadius =
	| 'rounded-left'
	| 'rounded-right'
	| 'rounded'
	| 'circular'
	| 'square'

interface BaseIconButtonProps {
	className?: string
	id?: string
	variant?: IconButtonVariant
	color?: IconButtonColor
	size?: IconButtonSize
	borderRadius?: IconButtonBorderRadius
	disabled?: boolean
	stopFocus?: boolean
	stopPropagation?: boolean;
	to?: string
	href?: string
	children: ReactNode
	type?: 'submit' | 'reset' | 'button' | undefined
	tabIndex?: number
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
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

export const IconButton = forwardRef(
	(
		props: IconButtonProps,
		ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement | null>
	) => {
		const {
			children,
			id,
			className,
			disabled,
			stopFocus,
			stopPropagation,
			to,
			href,
			variant = 'filled',
			size = 'medium',
			color = 'primary',
			borderRadius = 'circular',
			type = 'button',
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

		const handleMouseDown = (event: React.MouseEvent) => {
			if (stopFocus) {
				event.preventDefault()
			}
		}

		const handleClick = (event: React.MouseEvent) => {
			stopPropagation && event.stopPropagation()
			onClick?.(event)
			handleRippleMousePosition(rippleWrapperRef, event)
		}

		const additionalClasses: Array<string | undefined> = [
			styles[variant],
			styles[color],
			styles[size],
			styles[borderRadius],
			className,
		]

		const localTabIndex = disabled ? -1 : tabIndex

		if (to) {
			return (
				<Link
					className={classNames(styles['button'], additionalClasses)}
					id={id}
					to={to}
					tabIndex={localTabIndex}
					onClick={handleClick}
					onKeyUp={handleKeyUp}
					onKeyDown={handleKeyDown}
					onMouseDown={handleMouseDown}
					ref={linkRef}
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
					tabIndex={localTabIndex}
					onClick={handleClick}
					onKeyUp={handleKeyUp}
					onKeyDown={handleKeyDown}
					onMouseDown={handleMouseDown}
					ref={linkRef}
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
				onMouseDown={handleMouseDown}
				onKeyUp={handleKeyUp}
				onKeyDown={handleKeyDown}
				onClick={handleClick}
				tabIndex={localTabIndex}
				disabled={disabled}
				ref={ref && (ref as React.ForwardedRef<HTMLButtonElement>)}
				{...buttonProps}
				{...otherProps}
			>
				{children}
				<RippleWrapper ref={rippleWrapperRef} />
			</button>
		)
	}
)
