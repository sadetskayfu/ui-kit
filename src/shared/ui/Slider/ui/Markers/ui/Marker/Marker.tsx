import { classNames } from '@/shared/helpers/classNames'
import { SliderOrientation, SliderSize } from '../../../Slider/Slider'
import { memo } from 'react'
import styles from './style.module.scss'

export type MarkerLabelPosition = 'top' | 'bottom' | 'left' | 'right'

interface MarkerProps {
	label: string | number
    size: SliderSize
	labelPosition: MarkerLabelPosition
	orientation: SliderOrientation
	position: string
    isActive: boolean
    isVisibleLabel?: boolean
}

export const Marker = memo((props: MarkerProps) => {
	const { label, size, labelPosition, orientation, position, isVisibleLabel, isActive } = props

	const isHorizontal = orientation === 'horizontal'

	const additionalClasses: Array<string | undefined> = [
        styles[size],
		styles[labelPosition],
		styles[orientation]
	]

    const mods: Record<string, boolean | undefined> = {
        [styles['active']]: isActive
    }

	return (
		<span
			className={classNames(styles['marker'], additionalClasses, mods)}
			style={{
				left: isHorizontal ? position : '',
				bottom: !isHorizontal ? position : '',
			}}
		>
			{isVisibleLabel && <span className={styles['label']} aria-hidden='true'>{label}</span>}
		</span>
	)
})
