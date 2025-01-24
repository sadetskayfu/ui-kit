import { classNames } from '@/shared/helpers/classNames/classNames'
import { IconProps } from '../types/IconProps'
import { memo } from 'react'
import styles from '../styles/style.module.scss'

export const Minus = memo((props: IconProps) => {
	const { className, color = 'inherit', size = 'inherit' } = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[color],
		styles[size],
	]

	return (
		<svg
			className={classNames(styles['icon'], additionalClasses)}
			viewBox="0 0 16 2"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.25 1C0.25 0.585786 0.585786 0.25 1 0.25H15C15.4142 0.25 15.75 0.585786 15.75 1C15.75 1.41421 15.4142 1.75 15 1.75H1C0.585786 1.75 0.25 1.41421 0.25 1Z"
				fill="white"
			/>
		</svg>
	)
})
