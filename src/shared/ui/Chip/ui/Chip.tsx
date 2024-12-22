import {
	handleRipple,
	handleRippleMousePosition,
} from '@/shared/lib/handleRipple/handleRipple'
import { classNames } from '@/shared/lib/classNames/classNames'
import { cloneElement, memo, ReactElement, ReactNode, useRef } from 'react'
import { IconProps, Icon as XMarkIcon } from '@/shared/ui/Icon'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { IconButton } from '@/shared/ui/IconButton'
import { Link } from 'react-router-dom'
import { AvatarProps } from '@/shared/ui/Avatar'
import styles from './style.module.scss'

export type ChipVariant = 'filled' | 'outlined'
export type ChipColor = 'primary' | 'secondary'
export type ChipSize = 'small' | 'medium'

export interface ChipProps {
	className?: string
	variant?: ChipVariant
	color?: ChipColor
	size?: ChipSize
	label: string
	onClose?: () => void
	onClick?: () => void
	stopFocus?: boolean
	stopPropagation?: boolean
	tabIndex?: number
	disabled?: boolean
	isButton?: boolean
	isLink?: boolean
	isExternalLink?: boolean
	to?: string
	Avatar?: ReactElement<AvatarProps>
	Icon?: ReactElement<IconProps>
}

export const Chip = memo((props: ChipProps) => {
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
		isButton,
		isLink,
		isExternalLink,
		to = '',
		Avatar,
		Icon,
	} = props

	const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)
	const linkRef = useRef<HTMLAnchorElement | null>(null)

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (stopPropagation) event.stopPropagation()

		if (event.key === 'Backspace' && onClose) {
			event.preventDefault()
			onClose?.()
		}

		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()

			if (isLink || isExternalLink) {
				linkRef.current?.click()
			} else {
				onClick?.()
			}

			handleRipple(rippleWrapperRef)
		}
	}

	const handleClick = (event: React.MouseEvent) => {
		if (stopPropagation) event.stopPropagation()
		onClick?.()
		handleRippleMousePosition(rippleWrapperRef, event)
	}

	const handleStopFocus = (event: React.MouseEvent) => {
		stopFocus && event.preventDefault()
	}

	const mods: Record<string, boolean | undefined> = {
		[styles['clickable']]: isButton || isLink || isExternalLink,
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
		if (isButton)
			return (
				<button
					className={classNames(styles['chip'], additionalClasses, mods)}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					onMouseDown={handleStopFocus}
					tabIndex={localTabIndex}
					disabled={disabled}
				>
					{children}
					<RippleWrapper ref={rippleWrapperRef} />
				</button>
			)
		if (isExternalLink)
			return (
				<a
					className={classNames(styles['chip'], additionalClasses, mods)}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					onMouseDown={handleStopFocus}
					tabIndex={localTabIndex}
					href={to}
					ref={linkRef}
				>
					{children}
				</a>
			)
		if (isLink)
			return (
				<Link
					className={classNames(styles['chip'], additionalClasses, mods)}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					onMouseDown={handleStopFocus}
					tabIndex={localTabIndex}
					to={to}
					ref={linkRef}
				>
					{children}
					<RippleWrapper ref={rippleWrapperRef} />
				</Link>
			)
		return (
			<div
				className={classNames(styles['chip'], additionalClasses, mods)}
				onMouseDown={handleStopFocus}
				tabIndex={tabIndex}
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
					className: styles['avatar'],
					defaultBgColor: false,
					border: 'none',
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
				>
					<XMarkIcon variant="x-mark" />
				</IconButton>
			)}
		</Parent>
	)
})
