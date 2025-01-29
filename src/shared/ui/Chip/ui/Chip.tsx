import { classNames } from '@/shared/helpers/classNames'
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
import { AvatarProps } from '@/shared/ui/Avatar'
import { XMark } from '@/shared/assets/icons'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import { Link } from 'react-router-dom'
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

			const rippleWrapperRef = useRef<HTMLSpanElement>(null)

			const handleKeyDown = (event: React.KeyboardEvent) => {
				if (event.key === 'Backspace' && onClose) {
					event.preventDefault()
					onClose(event)
				}
			}

			const handleClick = (event: React.MouseEvent) => {
				onClick?.(event)

				if(event.clientX) {
					handleRippleCursorPosition(rippleWrapperRef, event)
				} else {
					handleRipple(rippleWrapperRef)
				}
			}

			const handleClose = (event: React.MouseEvent) => {
				event.stopPropagation()
				onClose?.(event)
			}

			const mods: Record<string, boolean | undefined> = {
				[styles['clickable']]: Boolean(onClick || to || href),
			}

			const additionalClasses: Array<string | undefined> = [
				className,
				styles[variant],
				styles[color],
				styles[size],
			]

			const Parent = ({ children }: { children: ReactNode }) => {
				if (onClick)
					return (
						<button
							className={classNames(styles['chip'], additionalClasses, mods)}
							onClick={handleClick}
							onKeyDown={handleKeyDown}
							tabIndex={disabled ? -1 : tabIndex}
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
							onKeyDown={handleKeyDown}
							tabIndex={tabIndex}
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
							<Link
								className={classNames(styles['chip'], additionalClasses, mods)}
								onClick={handleClick}
								onKeyDown={handleKeyDown}
								tabIndex={tabIndex}
								to={to}
								ref={ref as React.RefObject<HTMLAnchorElement>}
								{...linkProps}
								{...otherProps}
							>
								{children}
								<RippleWrapper ref={rippleWrapperRef}/>
							</Link>
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
						<button
							className={styles['close-button']}
							onClick={handleClose}
							onMouseDown={(event) => event.preventDefault()}
							disabled={disabled}
							tabIndex={-1}
						>
							<XMark />
						</button>
					)}
				</Parent>
			)
		}
	)
)
