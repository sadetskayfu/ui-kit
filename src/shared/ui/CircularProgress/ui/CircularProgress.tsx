import { classNames } from '@/shared/lib/classNames/classNames'
import { useEffect, useRef} from 'react'
import styles from './style.module.scss'

type CircularProgressSize = 'medium' | 'large'
type CircularProgressColor = 'primary' | 'grey'

interface CircularProgressProps {
	className?: string
	size?: CircularProgressSize
	color?: CircularProgressColor
	value?: number
	maxValue?: number
	minValue?: number
    label?: string
    zIndex?: number
    absCenter?: boolean
}

const getCircumferenceLength = (element: HTMLSpanElement) => {
	const styles = getComputedStyle(element)
	const size = Number(styles.getPropertyValue('--height').slice(0, -3))
	const strokeWidth = Number(
		styles.getPropertyValue('--strokeWidth').slice(0, -3)
	)
	const radius = (size - strokeWidth) / 2
	const circumferenceLength = 2 * Math.PI * radius

	return circumferenceLength
}

export const CircularProgress = (props: CircularProgressProps) => {
	const { className, size = 'large', color = 'primary', value, maxValue = 100, minValue = 0, label, absCenter, zIndex = 1 } = props

	const progressRef = useRef<HTMLSpanElement | null>(null)
	const circleRef = useRef<SVGCircleElement | null>(null)

	const isControlled = typeof value === 'number'

	useEffect(() => {
		const circle = circleRef.current
		const progress = progressRef.current

		if (isControlled && circle && progress) {
            const circumferenceLength = getCircumferenceLength(progress)
            const offset = circumferenceLength - ((value - minValue) / (maxValue - minValue)) * circumferenceLength
            circle.style.strokeDashoffset = `${offset}rem`
        }
	}, [value, size])

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[size],
		styles[color],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['controlled']]: isControlled,
        [styles['abs-center']]: absCenter
	}

	return (
		<span
			className={classNames(styles['progress'], additionalClasses, mods)}
			ref={progressRef}
            style={{
                zIndex
            }}
			role="progressbar"
			aria-valuemax={isControlled ? maxValue : undefined}
			aria-valuemin={isControlled ? minValue : undefined}
			aria-valuenow={isControlled ? value : undefined}
		>
			<svg>
				<circle ref={circleRef} />
			</svg>
            {label && <p className={styles['label']}>{label}</p>}
		</span>
	)
}
