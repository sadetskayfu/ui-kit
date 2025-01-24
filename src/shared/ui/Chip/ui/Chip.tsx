import { classNames } from '@/shared/helpers/classNames'
import {
	ButtonHTMLAttributes,
	cloneElement,
	forwardRef,
	lazy,
	LinkHTMLAttributes,
	memo,
	ReactElement,
	ReactNode,
	Suspense,
	useRef,
} from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { AvatarProps } from '@/shared/ui/Avatar'
import { XMark } from '@/shared/assets/icons'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import styles from './style.module.scss'

const LazyLink = lazy(() =>
	import('react-router-dom').then((module) => ({ default: module.Link }))
)

type ChipVariant = 'filled' | 'outlined'
type ChipColor = 'primary' | 'secondary'
type ChipSize = 'small' | 'medium'

interface BaseChipProps {
	className?: string
	variant?: ChipVariant
	color?: ChipColor
	size?: ChipSize
	label: string
	tabIndex?: number
	disabled?: boolean
	to?: string
	href?: string
	Avatar?: ReactElement<AvatarProps>
	Icon?: ReactElement
	onClose?: (event: any) => void
	onClick?: (event: any) => void
}

type HTMLLinkProps = Omit<
	LinkHTMLAttributes<HTMLAnchorElement>,
	keyof BaseChipProps
>
type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof BaseChipProps
>

interface ChipProps extends BaseChipProps {
	buttonProps?: HTMLButtonProps
	linkProps?: HTMLLinkProps
}

export const Chip = memo(
	forwardRef(
		(
			props: ChipProps,
			ref: React.ForwardedRef<
				HTMLButtonElement | HTMLAnchorElement | HTMLDivElement
			>
		) => {
			const {
				className,
				variant = 'filled',
				color = 'primary',
				size = 'medium',
				label,
				disabled,
				tabIndex = 0,
				to,
				href,
				Avatar,
				Icon,
				onClick,
				onClose,
				buttonProps,
				linkProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

			const handleKeyDown = (event: React.KeyboardEvent) => {
				if (event.key === 'Backspace' && onClose) {
					event.preventDefault()
					onClose(event)
				}
			}

			const handleKeyUp = (event: React.KeyboardEvent) => {
				if (event.key === 'Enter' || event.key === ' ') {
					handleRipple(rippleWrapperRef)
				}
			}

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)
				handleRippleCursorPosition(rippleWrapperRef, event)
			}

			const mods: Record<string, boolean | undefined> = {
				[styles['clickable']]: Boolean(onClick || to || href),
				[styles['disabled']]: disabled,
			}

			const additionalClasses: Array<string | undefined> = [
				className,
				styles[variant],
				styles[color],
				styles[size],
			]

			const localTabIndex = disabled ? -1 : tabIndex

			const Parent = ({ children }: { children: ReactNode }) => {
				if (onClick)
					return (
						<button
							className={classNames(styles['chip'], additionalClasses, mods)}
							onClick={handleClick}
							onKeyUp={handleKeyUp}
							onKeyDown={handleKeyDown}
							tabIndex={localTabIndex}
							disabled={disabled}
							ref={ref as React.RefObject<HTMLButtonElement>}
							{...buttonProps}
							{...otherProps}
						>
							{children}
							<RippleWrapper ref={rippleWrapperRef}/>
						</button>
					)
				if (href)
					return (
						<a
							className={classNames(styles['chip'], additionalClasses, mods)}
							onClick={handleClick}
							onKeyUp={handleKeyUp}
							onKeyDown={handleKeyDown}
							tabIndex={localTabIndex}
							href={href}
							ref={ref as React.RefObject<HTMLAnchorElement>}
							{...linkProps}
							{...otherProps}
						>
							{children}
						</a>
					)
				if (to)
					return (
						<Suspense>
							<LazyLink
								className={classNames(styles['chip'], additionalClasses, mods)}
								onClick={handleClick}
								onKeyUp={handleKeyUp}
								onKeyDown={handleKeyDown}
								tabIndex={localTabIndex}
								to={to}
								ref={ref as React.RefObject<HTMLAnchorElement>}
								{...linkProps}
								{...otherProps}
							>
								{children}
								<RippleWrapper ref={rippleWrapperRef}/>
							</LazyLink>
						</Suspense>
					)
				return (
					<div
						className={classNames(styles['chip'], additionalClasses, mods)}
						tabIndex={tabIndex}
						ref={ref as React.RefObject<HTMLDivElement>}
						{...otherProps}
					>
						{children}
					</div>
				)
			}

			return (
				<Parent>
					{Avatar &&
						cloneElement(Avatar, {
							defaultBgColor: false,
							size: 'custom',
							className: styles['avatar'],
						})}
					{Icon && <span className={styles['icon']}>{Icon}</span>}
					<span className={styles['label']}>{label}</span>
					{onClose && (
						<IconButton
							className={styles['close-button']}
							size="custom-size"
							color="custom-color"
							variant="filled"
							onClick={onClose}
							disabled={disabled}
							tabIndex={-1}
							stopPropagation
							stopFocus
						>
							<XMark />
						</IconButton>
					)}
				</Parent>
			)
		}
	)
)
