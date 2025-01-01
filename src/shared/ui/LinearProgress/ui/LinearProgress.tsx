import { classNames } from '@/shared/lib/classNames/classNames'
import { useEffect, useRef } from 'react'
import styles from './style.module.scss'

type LinearProgressColor = 'primary' | 'grey'

interface LinearProgressProps {
	className?: string
	color?: LinearProgressColor
	visibleLabel?: boolean
	value?: number
}

export const LinearProgress = (props: LinearProgressProps) => {
	const { className, color = 'primary', visibleLabel, value } = props

	const fillRef = useRef<HTMLSpanElement | null>(null)

	const isControlled = typeof value === 'number'

	useEffect(() => {
		const fill = fillRef.current

		if (isControlled && fill) {
			fill.style.transform = `translateX(${-100 + value}%)`
		}
	}, [value, isControlled])

	const additionalClasses: Array<string | undefined> = [className, styles[color]]

	const mods: Record<string, boolean | undefined> = {
		[styles['controlled']]: isControlled,
	}

	return (
		<div
			className={classNames(styles['progress'], additionalClasses, mods)}
			role="progressbar"
			aria-valuemax={isControlled ? 100 : undefined}
			aria-valuemin={isControlled ? 0 : undefined}
			aria-valuenow={isControlled ? value : undefined}
		>
			<span className={styles['track']}>
				<span ref={fillRef} className={styles['fill']}></span>
			</span>
			{visibleLabel && <p>{value}%</p>}
		</div>
	)
}
