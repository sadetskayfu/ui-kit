import { Children, Fragment, ReactElement } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

interface AriaAttributes {
	'aria-label': string
}

interface BreadcrumbsProps extends AriaAttributes {
	className?: string
	children: ReactElement[]
	separator?: string
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
	const {
		className,
		children,
		separator: externalSeparator,
		...otherProps
	} = props

	const childArray = Children.toArray(children)

	const separator = externalSeparator ? externalSeparator : '/'

	return (
		<nav
			className={classNames(styles['breadcrumbs'], [className])}
			{...otherProps}
		>
			<ol className={styles['list']}>
				{childArray.map((child, index) => (
					<Fragment key={index}>
						{index > 0 && (
							<li className={styles['separator']} aria-hidden="true">
								{separator}
							</li>
						)}
						<li className={styles['list-item']}>{child}</li>
					</Fragment>
				))}
			</ol>
		</nav>
	)
}
