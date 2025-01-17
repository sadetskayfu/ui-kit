import { classNames } from '@/shared/lib/classNames/classNames'
import { SliderOrientation, SliderSize } from '../Slider/Slider'
import { memo } from 'react'
import styles from './style.module.scss'

export type MarkerPosition = 'top' | 'bottom' | 'left' | 'right'

interface MarkerProps {
	label: string | number
    size: SliderSize
	position: MarkerPosition
	orientation: SliderOrientation
	translate: string
    isActive: boolean
    isVisibleLabel?: boolean
}

export const Marker = memo((props: MarkerProps) => {
	const { label, size, position, orientation, translate, isVisibleLabel, isActive } = props

	const isHorizontal = orientation === 'horizontal'

	const additionalClasses: Array<string | undefined> = [
        styles[size],
		styles[position],
	]

    const mods: Record<string, boolean | undefined> = {
        [styles['active']]: isActive
    }

	return (
		<span
			className={classNames(styles['marker'], additionalClasses, mods)}
			style={{
				left: isHorizontal ? translate : '',
				bottom: !isHorizontal ? translate : '',
			}}
		>
			{isVisibleLabel && <span className={styles['label']} aria-hidden='true'>{label}</span>}
		</span>
	)
})
