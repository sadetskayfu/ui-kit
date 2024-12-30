import {
	AriaRole,
	ButtonHTMLAttributes,
	cloneElement,
	forwardRef,
	LinkHTMLAttributes,
	memo,
	ReactElement,
	ReactNode,
	useRef,
} from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
	handleRipple,
	handleRippleMousePosition,
} from '@/shared/lib/handleRipple/handleRipple'
import { Link } from 'react-router-dom'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { IconProps } from '@/shared/ui/Icon'
import styles from './style.module.scss'

interface BaseMenuItemProps {
	className?: string
	label: string
	description?: string
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
	tabIndex?: number
	StartIcon?: ReactElement<IconProps>
	EndIcon?: ReactElement<IconProps>
	to?: string
	href?: string
	role?: AriaRole
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
			ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement | null>
		) => {
			const {
				className,
				label,
				description,
				onClick,
				tabIndex = 0,
				StartIcon,
				EndIcon,
				to,
				href,
				role = 'menuitem',
				buttonProps,
				linkProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)
			const localLinkRef = useRef<HTMLAnchorElement | null>(null)
			const linkRef = ref
				? (ref as React.RefObject<HTMLAnchorElement>)
				: localLinkRef

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)
				handleRippleMousePosition(rippleWrapperRef, event)
			}

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
				if(event.key === 'Enter' || event.key === ' ') {
					event.preventDefault()
				}
			}

			const Component = ({ children }: { children: ReactNode }) => {
				if (to)
					return (
						<Link
							className={styles['button']}
							role={role}
							tabIndex={tabIndex}
							to={to}
							onKeyUp={handleKeyUp}
							onKeyDown={handleKeyDown}
							onClick={handleClick}
							ref={linkRef}
							{...linkProps}
							{...otherProps}
						>
							{children}
							<RippleWrapper ref={rippleWrapperRef} />
						</Link>
					)
				if (href)
					return (
						<a
							className={styles['button']}
							role={role}
							tabIndex={tabIndex}
							href={href}
							onKeyUp={handleKeyUp}
							onKeyDown={handleKeyDown}
							onClick={handleClick}
							ref={linkRef}
							{...linkProps}
							{...otherProps}
						>
							{children}
						</a>
					)
				return (
					<button
						className={styles['button']}
						role={role}
						onClick={handleClick}
						onKeyUp={handleKeyUp}
						onKeyDown={handleKeyDown}
						tabIndex={tabIndex}
						ref={ref && (ref as React.ForwardedRef<HTMLButtonElement>)}
						{...buttonProps}
						{...otherProps}
					>
						{children}
						<RippleWrapper ref={rippleWrapperRef} />
					</button>
				)
			}

			const mods: Record<string, boolean | undefined> = {
				[styles['with-start-icon']]: !!StartIcon,
				[styles['with-end-icon']]: !!EndIcon,
			}

			return (
				<li
					className={classNames(styles['menu-item'], [className], mods)}
					role="none"
				>
					<Component>
						<div className={styles['title']}>
							{StartIcon && cloneElement(StartIcon, {className: styles['start-icon']})}
							{label}
							{EndIcon && cloneElement(EndIcon, {className: styles['end-icon']})}
						</div>
						{description && <p>{description}</p>}
					</Component>
				</li>
			)
		}
	)
)
