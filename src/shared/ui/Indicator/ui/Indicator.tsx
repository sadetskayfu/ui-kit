import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

export type IndicatorPosition = 'top' | 'right' | 'left' | 'bottom'
type IndicatorColor = 'primary' | 'secondary'
type IndicatorWeight = 'soft' | 'hard'

interface IndicatorProps {
	position?: IndicatorPosition
	color?: IndicatorColor
	weight?: IndicatorWeight
	isActive?: boolean
}

const Indicator = (props: IndicatorProps) => {
	const {
		position = 'bottom',
		color = 'primary',
		weight = 'hard',
		isActive,
	} = props

	const additionalClasses: Array<string | undefined> = [
		styles[position],
		styles[color],
		styles[weight],
	]

	const mods: Record<string, boolean | undefined> = {
		[styles['active']]: isActive,
	}

	return (
		<span
			className={classNames(styles['indicator'], additionalClasses, mods)}
            aria-hidden='true'
		></span>
	)
}

export default Indicator