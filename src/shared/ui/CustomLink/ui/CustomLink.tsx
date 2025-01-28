import { classNames } from '@/shared/helpers/classNames'
import { AnchorHTMLAttributes, forwardRef, memo, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

type CustomLinkUnderline = 'none' | 'hover' | 'always'
type CustomLinkColor = 'primary' | 'inherit'

interface BaseCustomLinkProps {
	className?: string
	children: ReactNode
	to?: string
	href?: string
	underline?: CustomLinkUnderline
	color?: CustomLinkColor
}

type HTMLLinkProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	keyof BaseCustomLinkProps
>

interface CustomLinkProps extends BaseCustomLinkProps {
	linkProps?: HTMLLinkProps
}

export const CustomLink = memo(forwardRef((props: CustomLinkProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
	const { children, className, to, href, underline = 'hover', color = 'primary', linkProps, ...otherProps } = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[underline],
		styles[color]
	]

	if (to) {
		return (
				<Link
					to={to}
					className={classNames(styles['link'], additionalClasses)}
					ref={ref}
					{...linkProps}
					{...otherProps}
				>
					{children}
				</Link>
		)
	}

	return (
		<a
			href={href}
			className={classNames(styles['link'], additionalClasses)}
			ref={ref}
			{...linkProps}
			{...otherProps}
		>
			{children}
		</a>
	)
}))
