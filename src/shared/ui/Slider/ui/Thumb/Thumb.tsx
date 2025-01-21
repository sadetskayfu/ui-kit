import { forwardRef, lazy, memo, Suspense } from 'react'
import { AriaAttributes, SliderOrientation, SliderSize } from '../Slider/Slider'
import { classNames } from '@/shared/lib/classNames/classNames'
import { TooltipPosition } from '../Tooltip/Tooltip'
import { calculateTranslateThumb } from '../../helpers'
import styles from './style.module.scss'

const Tooltip = lazy(() => import('../Tooltip/Tooltip'))

interface ThumbProps extends AriaAttributes {
	index: 0 | 1
	value: number
	min: number
	max: number
	name?: string
	orientation: SliderOrientation
	disabled?: boolean
	isDragging: boolean
	isTooltip: boolean
	tabIndex: number
	size: SliderSize
	tooltipPosition: TooltipPosition
	onKeyDown: (event: React.KeyboardEvent) => void
	onFocus: (index: 0 | 1) => void
	getTooltipLabel?: (value: number) => string | number
	getAriaValueText?: (value: number) => string
}

export const Thumb = memo(
	forwardRef((props: ThumbProps, ref: React.ForwardedRef<HTMLDivElement>) => {
		const {
			index,
			value,
			min,
			max,
			name,
			orientation,
			disabled,
			isDragging,
			isTooltip,
			tabIndex = 0,
			size,
			tooltipPosition,
			onKeyDown,
			onFocus,
			getTooltipLabel,
			getAriaValueText,
			...otherProps
		} = props

		const additionalClasses: Array<string | undefined> = [
			styles[size],
			styles[orientation],
		]

		const mods: Record<string, boolean | undefined> = {
			[styles['dragging']]: isDragging,
		}

		const isHorizontal = orientation === 'horizontal'

		const tooltipLabel = getTooltipLabel ? getTooltipLabel(value) : value
		const ariaValueText = getAriaValueText ? getAriaValueText(value) : value + ''

		const translate = `${calculateTranslateThumb(value, min, max)}%`

		return (
			<div
				className={classNames(styles['thumb'], additionalClasses, mods)}
				ref={ref}
				style={{
					left: isHorizontal ? translate : '',
					bottom: !isHorizontal ? translate : '',
				}}
				tabIndex={disabled ? -1 : tabIndex}
				role="slider"
				aria-disabled={disabled ? 'true' : undefined}
				aria-valuetext={ariaValueText}
				aria-valuenow={value}
				aria-valuemax={max}
				aria-valuemin={min}
				aria-orientation={orientation}
				onKeyDown={onKeyDown}
				onFocus={() => onFocus(index)}
				{...otherProps}
			>
				<input name={name} value={value} type="range"></input>
				{isTooltip && (
					<Suspense>
						<Tooltip
							className={styles['tooltip']}
							label={tooltipLabel}
							position={tooltipPosition}
						/>
					</Suspense>
				)}
			</div>
		)
	})
)
