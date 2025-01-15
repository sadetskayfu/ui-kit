import { classNames } from '@/shared/lib/classNames/classNames'
import { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

type CustomLinkUnderline = 'none' | 'hover' | 'always'

interface BaseCustomLinkProps {
	className?: string
	children: ReactNode
	to?: string
	href?: string
	underline?: CustomLinkUnderline
}

type HTMLLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseCustomLinkProps>

interface CustomLinkProps extends BaseCustomLinkProps {
	linkProps?: HTMLLinkProps
}

export const CustomLink = (props: CustomLinkProps) => {
	const { children, className, to, href, underline = 'hover', linkProps } = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[underline],
	]

	if (to) {
		return (
			<Link to={to} className={classNames(styles['link'], additionalClasses)} {...linkProps}>
				{children}
			</Link>
		)
	}

	return (
		<a href={href} className={classNames(styles['link'], additionalClasses)} {...linkProps}>
			{children}
		</a>
	)
}
