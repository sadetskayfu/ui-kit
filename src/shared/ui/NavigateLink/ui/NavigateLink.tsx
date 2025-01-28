import { classNames } from '@/shared/helpers/classNames'
import { AnchorHTMLAttributes, forwardRef, memo, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Indicator, IndicatorPosition } from '@/shared/ui/Indicator'
import styles from './style.module.scss'

interface BaseNavigateLinkProps {
	className?: string
	children: ReactNode
	to: string
	indicatorPosition?: IndicatorPosition
}

type HTMLLinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof BaseNavigateLinkProps
>

interface NavigateLinkProps extends BaseNavigateLinkProps {
	linkProps?: HTMLLinkProps
}

export const NavigateLink = memo(
	forwardRef(
		(props: NavigateLinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
			const { className, children, to, indicatorPosition = 'bottom', linkProps, ...otherProps } = props

			const location = useLocation()
			const isActive = location.pathname === to

			const mods: Record<string, boolean | undefined> = {
				[styles['active']]: isActive,
			}

			return (
				<Link
					ref={ref}
					className={classNames(styles['link'], [className], mods)}
					to={to}
					{...linkProps}
					{...otherProps}
				>
					{children}
					<Indicator isActive={isActive} position={indicatorPosition}/>
				</Link>
			)
		}
	)
)
