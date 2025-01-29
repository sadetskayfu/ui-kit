import { AnchorHTMLAttributes, forwardRef, memo, useRef } from 'react'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { classNames } from '@/shared/helpers/classNames'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import { BaseListItemProps } from '../../types/BaseListItemProps'
import { Link, useLocation } from 'react-router-dom'
import { Indicator } from '@/shared/ui/Indicator'
import styles from './style.module.scss'

type ListItemIndicatorPosition = 'left' | 'right'

interface BaseListItemLinkProps extends BaseListItemProps {
	to: string
	isExternalLink?: boolean
	tabIndex?: number
	indicatorPosition?: ListItemIndicatorPosition
    onClick?: (event: any) => void
}

type HTMLLinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof BaseListItemLinkProps
>

interface ListItemLinkProps extends BaseListItemLinkProps {
	linkProps?: HTMLLinkProps
}

export const ListItemLink = memo(
	forwardRef(
		(props: ListItemLinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
			const {
				className,
				children,
				to,
				isExternalLink,
				indicatorPosition = 'left',
				tabIndex = 0,
				role = 'listitem',
				style,
                onClick,
				linkProps,
				...otherProps
			} = props

			const location = useLocation()
			const isActive = to === location.pathname

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

			const handleClick = (event: React.MouseEvent) => {
                onClick?.(event)

				if (event.clientX) {
					handleRippleCursorPosition(rippleWrapperRef, event)
				} else {
					handleRipple(rippleWrapperRef)
				}
			}

			const mods: Record<string, boolean | undefined> = {
				[styles['active']]: isActive,
			}

			const additionalClasses: Array<string | undefined> = [
				className,
				styles[indicatorPosition],
			]

			if (isExternalLink) {
				return (
					<a
						className={classNames(styles['link'], additionalClasses, mods)}
						href={to}
						onClick={handleClick}
						tabIndex={tabIndex}
						role={role}
						ref={ref}
						style={{ ...style }}
						{...linkProps}
						{...otherProps}
					>
						{children}
					</a>
				)
			}

			return (
				<Link
					className={classNames(styles['link'], additionalClasses, mods)}
					to={to}
					onClick={handleClick}
					tabIndex={tabIndex}
					role={role}
					ref={ref}
					style={{ ...style }}
					{...linkProps}
					{...otherProps}
				>
					{children}
					<Indicator isActive={isActive} position={indicatorPosition
					}/>
					<RippleWrapper ref={rippleWrapperRef} />
				</Link>
			)
		}
	)
)
