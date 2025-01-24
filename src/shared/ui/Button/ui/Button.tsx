import {
	ButtonHTMLAttributes,
	forwardRef,
	lazy,
	LinkHTMLAttributes,
	memo,
	ReactNode,
	Suspense,
	useRef,
} from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import styles from './style.module.scss'

const LazyLink = lazy(() =>
	import('react-router-dom').then((module) => ({ default: module.Link }))
)

type ButtonVariant = 'filled' | 'outlined' | 'clear'
type ButtonColor = 'primary' | 'secondary'
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
	children: ReactNode
	type?: 'submit' | 'reset' | 'button'
	tabIndex?: number
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
				color = 'primary',
				type = 'button',
				tabIndex,
				onClick,
				linkProps,
				buttonProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

			const handleKeyUp = (event: React.KeyboardEvent) => {
				if (event.key === ' ' || event.key === 'Enter') {
					handleRipple(rippleWrapperRef)
				}
			}

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)
				handleRippleCursorPosition(rippleWrapperRef, event)
			}

			const additionalClasses: Array<string | undefined> = [
				className,
				styles[variant],
				styles[color],
				styles[size],
			]

			const localTabIndex = disabled ? -1 : tabIndex

			if (to) {
				return (
					<Suspense>
						<LazyLink
							className={classNames(styles['button'], additionalClasses)}
							id={id}
							onKeyUp={handleKeyUp}
							onClick={handleClick}
							to={to}
							tabIndex={localTabIndex}
							ref={ref as React.ForwardedRef<HTMLAnchorElement>}
							{...linkProps}
							{...otherProps}
						>
							{children}
							<RippleWrapper ref={rippleWrapperRef}/>
						</LazyLink>
					</Suspense>
				)
			}

			if (href) {
				return (
					<a
						className={classNames(styles['button'], additionalClasses)}
						id={id}
						onKeyUp={handleKeyUp}
						onClick={handleClick}
						href={href}
						tabIndex={localTabIndex}
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
					tabIndex={localTabIndex}
					disabled={disabled}
					ref={ref as React.ForwardedRef<HTMLButtonElement>}
					{...buttonProps}
					{...otherProps}
				>
					{children}
					<RippleWrapper ref={rippleWrapperRef}/>
				</button>
			)
		}
	)
)
