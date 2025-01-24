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

type IconButtonVariant = 'filled' | 'outlined' | 'clear'
type IconButtonSize =
	| 'small-xx'
	| 'small-x'
	| 'small'
	| 'medium'
	| 'large'
	| 'custom-size'
export type IconButtonColor = 'primary' | 'secondary' | 'custom-color'
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
	stopPropagation?: boolean
	stopFocus?: boolean
	disabled?: boolean
	to?: string
	href?: string
	children: ReactNode
	type?: 'submit' | 'reset' | 'button'
	tabIndex?: number
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

			const handleKeyUp = (event: React.KeyboardEvent) => {
				if (event.key === ' ' || event.key === 'Enter') {
					stopPropagation && event.stopPropagation()

					handleRipple(rippleWrapperRef)
				}
			}

			const handleClick = (event: React.MouseEvent) => {
				stopPropagation && event.stopPropagation()

				onClick?.(event)
				handleRippleCursorPosition(rippleWrapperRef, event)
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

			const localTabIndex = disabled ? -1 : tabIndex

			if (to) {
				return (
					<Suspense>
						<LazyLink
							className={classNames(styles['button'], additionalClasses)}
							id={id}
							to={to}
							tabIndex={localTabIndex}
							onClick={handleClick}
							onKeyUp={handleKeyUp}
							onMouseDown={stopFocus ? handleMouseDown : undefined}
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
						href={href}
						tabIndex={localTabIndex}
						onClick={handleClick}
						onKeyUp={handleKeyUp}
						onMouseDown={stopFocus ? handleMouseDown : undefined}
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

export default IconButton
