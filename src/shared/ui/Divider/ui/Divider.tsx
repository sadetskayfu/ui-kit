import { classNames } from '@/shared/helpers/classNames'
import { memo } from 'react'
import styles from './style.module.scss'

type DividerOrientation = 'horizontal' | 'vertical'
type DividerComponent = 'div' | 'li' | 'hr'

interface DividerProps {
	className?: string
	orientation?: DividerOrientation
	component?: DividerComponent
}

export const Divider = memo((props: DividerProps) => {
	const { orientation = 'vertical', component = 'div', className } = props

	const additionalClasses: Array<string | undefined> = [
		styles[orientation],
		className,
	]

	const Tag = component

	return (
		<Tag
			className={classNames(styles['divider'], additionalClasses)}
			role="separator"
			aria-orientation={orientation}
		/>
	)
})
