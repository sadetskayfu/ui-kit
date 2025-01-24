import { classNames } from '@/shared/helpers/classNames/classNames'
import { IconProps } from '../types/IconProps'
import { memo } from 'react'
import styles from '../styles/style.module.scss'

export const Eye = memo((props: IconProps) => {
	const { className, color = 'inherit', size = 'inherit' } = props

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[color],
		styles[size],
	]

	return (
		<svg
			className={classNames(styles['icon'], additionalClasses)}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M11.9998 2.5C7.80915 2.5 4.80625 4.84327 2.90277 7.0685C1.75082 8.41516 0.784974 9.9348 0.0778624 11.5618C-0.0226214 11.793 -0.026017 12.0548 0.0686626 12.2885C0.738203 13.9407 1.67953 15.4881 2.81769 16.8577C4.70132 19.1243 7.70679 21.5 11.9998 21.5C16.2929 21.5 19.2983 19.1243 21.182 16.8577C22.3201 15.4881 23.2614 13.9407 23.931 12.2885C24.0257 12.0548 24.0222 11.793 23.9219 11.5617C23.2116 9.92407 22.2616 8.43011 21.0969 7.0685C19.1934 4.84327 16.1905 2.5 11.9998 2.5ZM15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z"
			/>
		</svg>
	)
})
