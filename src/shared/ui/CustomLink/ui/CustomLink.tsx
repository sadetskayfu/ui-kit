import { classNames } from '@/shared/lib/classNames/classNames'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

type CustomLinkUnderline = 'none' | 'hover' | 'always'

interface CustomLinkProps {
	className?: string
	children: ReactNode
	to?: string
	href?: string
	underline?: CustomLinkUnderline
}

export const CustomLink = (props: CustomLinkProps) => {
	const { children, className, to, href, underline = 'hover' } = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[underline],
	]

	if (to) {
		return (
			<Link to={to} className={classNames(styles['link'], additionalClasses)}>
				{children}
			</Link>
		)
	}

	return (
		<a href={href} className={classNames(styles['link'], additionalClasses)}>
			{children}
		</a>
	)
}
