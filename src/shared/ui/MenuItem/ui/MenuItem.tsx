import {
	AriaRole,
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

interface BaseMenuItemProps {
	className?: string
	children: ReactNode
	to?: string
	href?: string
	role?: AriaRole
	tabIndex?: number
	onClick?: (event: any) => void
}

type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof BaseMenuItemProps
>
type HTMLLinkProps = Omit<
	LinkHTMLAttributes<HTMLAnchorElement>,
	keyof BaseMenuItemProps
>

export interface MenuItemProps extends BaseMenuItemProps {
	buttonProps?: HTMLButtonProps
	linkProps?: HTMLLinkProps
}

export const MenuItem = memo(
	forwardRef(
		(
			props: MenuItemProps,
			ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
		) => {
			const {
				className,
				children,
				to,
				href,
				role = 'menuitem',
				tabIndex = 0,
				onClick,
				buttonProps,
				linkProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement>(null)

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)

				if(event.clientX) {
					handleRippleCursorPosition(rippleWrapperRef, event)
				} else {
					handleRipple(rippleWrapperRef)
				}
			}

			if (to)
				return (
					<li className={classNames(styles['item'], [className])} role='none'>
						<Link
							className={styles['link']}
							role={role}
							tabIndex={tabIndex}
							to={to}
							onClick={handleClick}
							ref={ref as React.ForwardedRef<HTMLAnchorElement>}
							{...linkProps}
							{...otherProps}
						>
							{children}
							<RippleWrapper ref={rippleWrapperRef} />
						</Link>
					</li>
				)
			if (href)
				return (
					<li className={classNames(styles['item'], [className])} role='none'>
						<a
							className={styles['link']}
							role={role}
							tabIndex={tabIndex}
							href={href}
							onClick={handleClick}
							ref={ref as React.ForwardedRef<HTMLAnchorElement>}
							{...linkProps}
							{...otherProps}
						>
							{children}
						</a>
					</li>
				)
			return (
				<li className={classNames(styles['item'], [className])} role='none'>
					<button
						className={styles['button']}
						role={role}
						onClick={handleClick}
						tabIndex={tabIndex}
						ref={ref as React.ForwardedRef<HTMLButtonElement>}
						{...buttonProps}
						{...otherProps}
					>
						{children}
						<RippleWrapper ref={rippleWrapperRef} />
					</button>
				</li>
			)
		}
	)
)
