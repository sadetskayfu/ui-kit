import {
	AriaRole,
	ButtonHTMLAttributes,
	forwardRef,
	lazy,
	LinkHTMLAttributes,
	memo,
	ReactElement,
	ReactNode,
	Suspense,
	useRef,
} from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { Typography } from '@/shared/ui/Typography'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import styles from './style.module.scss'

const LazyLink = lazy(() =>
	import('react-router-dom').then((module) => ({ default: module.Link }))
)

interface BaseMenuItemProps {
	className?: string
	label: string
	description?: string
	tabIndex?: number
	StartIcon?: ReactElement
	EndIcon?: ReactElement
	to?: string
	href?: string
	role?: AriaRole
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
				label,
				description,
				tabIndex = 0,
				StartIcon,
				EndIcon,
				to,
				href,
				role = 'menuitem',
				onClick,
				buttonProps,
				linkProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)
				handleRippleCursorPosition(rippleWrapperRef, event)
			}

			const handleKeyUp = (event: React.KeyboardEvent) => {
				if (event.key === 'Enter' || event.key === ' ') {
					handleRipple(rippleWrapperRef)
				}
			}

			const Component = ({ children }: { children: ReactNode }) => {
				if (to)
					return (
						<Suspense>
							<LazyLink
								className={styles['button']}
								role={role}
								tabIndex={tabIndex}
								to={to}
								onKeyUp={handleKeyUp}
								onClick={handleClick}
								ref={ref as React.ForwardedRef<HTMLAnchorElement>}
								{...linkProps}
								{...otherProps}
							>
								{children}
								<RippleWrapper ref={rippleWrapperRef}/>
							</LazyLink>
						</Suspense>
					)
				if (href)
					return (
						<a
							className={styles['button']}
							role={role}
							tabIndex={tabIndex}
							href={href}
							onKeyUp={handleKeyUp}
							onClick={handleClick}
							ref={ref as React.ForwardedRef<HTMLAnchorElement>}
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
						tabIndex={tabIndex}
						ref={ref as React.ForwardedRef<HTMLButtonElement>}
						{...buttonProps}
						{...otherProps}
					>
						{children}
						<RippleWrapper ref={rippleWrapperRef}/>
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
							{StartIcon && <span className={styles['start-icon']}>{StartIcon}</span>}
							{label}
							{EndIcon && <span className={styles['end-icon']}>{EndIcon}</span>}
						</div>
						{description && (
							<Typography color="soft" component="p" variant="helper-text">
								{description}
							</Typography>
						)}
					</Component>
				</li>
			)
		}
	)
)
