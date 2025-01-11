import {
	handleRipple,
	handleRippleMousePosition,
} from '@/shared/lib/handleRipple/handleRipple'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
	ButtonHTMLAttributes,
	cloneElement,
	forwardRef,
	LinkHTMLAttributes,
	memo,
	ReactElement,
	ReactNode,
	useRef,
} from 'react'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { IconButton } from '@/shared/ui/IconButton'
import { Link } from 'react-router-dom'
import { AvatarProps } from '@/shared/ui/Avatar'
import { IconProps, XMark } from '@/shared/assets/icons'
import styles from './style.module.scss'

type ChipVariant = 'filled' | 'outlined'
type ChipColor = 'primary' | 'secondary'
type ChipSize = 'small' | 'medium'

interface BaseChipProps {
	className?: string
	variant?: ChipVariant
	color?: ChipColor
	size?: ChipSize
	label: string
	onClose?: (event: React.MouseEvent | React.KeyboardEvent) => void
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
	stopFocus?: boolean
	stopPropagation?: boolean
	tabIndex?: number
	disabled?: boolean
	to?: string
	href?: string
	Avatar?: ReactElement<AvatarProps>
	Icon?: ReactElement<IconProps>
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
				HTMLButtonElement | HTMLAnchorElement | HTMLDivElement | null
			>
		) => {
			const {
				className,
				variant = 'filled',
				color = 'primary',
				size = 'medium',
				label,
				onClick,
				onClose,
				stopFocus,
				stopPropagation,
				disabled,
				tabIndex = 0,
				to,
				href,
				Avatar,
				Icon,
				buttonProps,
				linkProps,
				...otherProps
			} = props

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)
			const localLinkRef = useRef<HTMLAnchorElement | null>(null)
			const linkRef = ref ? (ref as React.RefObject<HTMLAnchorElement>) : localLinkRef

			const handleKeyUp = (event: React.KeyboardEvent) => {
				if (event.key === 'Backspace' && onClose) {
					event.preventDefault()
					onClose?.(event)
				}

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
				if (event.key === 'Enter') {
					event.preventDefault()
				}
			}

			const handleClick = (event: React.MouseEvent) => {
				if (stopPropagation) event.stopPropagation()
				onClick?.(event)
				handleRippleMousePosition(rippleWrapperRef, event)
			}

			const handleMouseDown = (event: React.MouseEvent) => {
				stopFocus && event.preventDefault()
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
							onMouseDown={handleMouseDown}
							tabIndex={localTabIndex}
							disabled={disabled}
							ref={ref && ref as React.RefObject<HTMLButtonElement>}
							{...buttonProps}
							{...otherProps}
						>
							{children}
							<RippleWrapper ref={rippleWrapperRef} />
						</button>
					)
				if (href)
					return (
						<a
							className={classNames(styles['chip'], additionalClasses, mods)}
							onClick={handleClick}
							onKeyUp={handleKeyUp}
							onKeyDown={handleKeyDown}
							onMouseDown={handleMouseDown}
							tabIndex={localTabIndex}
							href={href}
							ref={linkRef}
							{...linkProps}
							{...otherProps}
						>
							{children}
						</a>
					)
				if (to)
					return (
						<Link
							className={classNames(styles['chip'], additionalClasses, mods)}
							onClick={handleClick}
							onKeyUp={handleKeyUp}
							onKeyDown={handleKeyDown}
							onMouseDown={handleMouseDown}
							tabIndex={localTabIndex}
							to={to}
							ref={linkRef}
							{...linkProps}
							{...otherProps}
						>
							{children}
							<RippleWrapper ref={rippleWrapperRef} />
						</Link>
					)
				return (
					<div
						className={classNames(styles['chip'], additionalClasses, mods)}
						onMouseDown={handleMouseDown}
						tabIndex={tabIndex}
						ref={ref && ref as React.RefObject<HTMLDivElement>}
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
							height: '100%',
							width: 'auto',
							defaultBgColor: false,
							className: styles['avatar'],
						})}
					{Icon && cloneElement(Icon, { className: styles['icon'] })}
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
							stopFocus
							stopPropagation
						>
							<XMark />
						</IconButton>
					)}
				</Parent>
			)
		}
	)
)
