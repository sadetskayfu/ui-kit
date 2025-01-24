import { forwardRef, memo, ReactElement, useRef } from 'react'
import { RippleWrapper } from '@/shared/ui/RippleWrapper'
import { useLocation, Link } from 'react-router-dom'
import { classNames } from '@/shared/helpers/classNames'
import { handleRipple, handleRippleCursorPosition } from '@/shared/lib/ripple'
import styles from './style.module.scss'

type ListItemIndicatorPosition = 'left' | 'right'

interface ListItemProps {
	className?: string
	children: string
	StartIcon?: ReactElement
	EndIcon?: ReactElement
	to?: string
    indicatorPosition?: ListItemIndicatorPosition
	onClick?: (event: any) => void
}

export const ListItem = memo(
	forwardRef(
		(
			props: ListItemProps,
			ref: React.ForwardedRef<HTMLAnchorElement | HTMLDivElement>
		) => {
			const { children, EndIcon, StartIcon, to, indicatorPosition = 'left', onClick } = props

			const location = useLocation()
			const isActive = !!to && to === location.pathname

			const rippleWrapperRef = useRef<HTMLSpanElement | null>(null)

			const handleClick = (event: React.MouseEvent) => {
				handleRippleCursorPosition(rippleWrapperRef, event)
				onClick?.(event)
			}

            const handleKeyUp = (event: React.KeyboardEvent) => {
                if(event.key === 'Enter' || event.key === ' ') {
                    handleRipple(rippleWrapperRef)
                }
            }

			const mods: Record<string, boolean | undefined> = {
				[styles['active']]: isActive,
			}

            const additionalClasses: Array<string | undefined> = [
                styles[indicatorPosition]
            ]

			const ListItemContent = () => (
				<>
					{StartIcon && StartIcon}
					<span>{children}</span>
					{EndIcon && <span className={styles['end-icon']}>{EndIcon}</span>}
					<RippleWrapper ref={rippleWrapperRef} />
				</>
			)

			if (to) {
				return (
					<Link
						className={classNames(styles['list-item'], additionalClasses, mods)}
						onClick={handleClick}
                        onKeyUp={handleKeyUp}
						to={to}
						ref={ref as React.ForwardedRef<HTMLAnchorElement>}
					>
						<ListItemContent />
					</Link>
				)
			}

			return (
				<div
					className={classNames(styles['list-item'])}
					onClick={handleClick}
                    onKeyUp={handleKeyUp}
					tabIndex={0}
					ref={ref as React.ForwardedRef<HTMLDivElement>}
				>
					<ListItemContent />
				</div>
			)
		}
	)
)
