import { classNames } from '@/shared/helpers/classNames'
import { AnchorHTMLAttributes, lazy, memo, ReactNode, Suspense } from 'react'
import styles from './style.module.scss'

const LazyLink = lazy(() =>
	import('react-router-dom').then((module) => ({ default: module.Link }))
)

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

export const CustomLink = memo((props: CustomLinkProps) => {
	const { children, className, to, href, underline = 'hover', color = 'primary', linkProps } = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[underline],
		styles[color]
	]

	if (to) {
		return (
			<Suspense>
				<LazyLink
					to={to}
					className={classNames(styles['link'], additionalClasses)}
					{...linkProps}
				>
					{children}
				</LazyLink>
			</Suspense>
		)
	}

	return (
		<a
			href={href}
			className={classNames(styles['link'], additionalClasses)}
			{...linkProps}
		>
			{children}
		</a>
	)
})
