import { useState, useRef, useCallback, memo, useEffect } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
	CustomMarker,
	useChangeValue,
	useDragging,
	useKeyboardNavigation,
	useMarkers,
} from '../../model/hooks'
import { Thumb } from '../Thumb/Thumb'
import { calculateTranslateThumb } from '../../model/lib'
import { TooltipPosition } from '../Tooltip/Tooltip'
import { MarkerPosition } from '../Marker/Marker'
import styles from './style.module.scss'

export type SliderSize = 'small' | 'medium'

export type SliderOrientation = 'horizontal' | 'vertical'

export type ValueType = number | [number, number]

export interface AriaAttributes {
	'aria-label'?: string
	'aria-labelledby'?: string
}

interface SliderProps extends AriaAttributes {
	className?: string
	size?: SliderSize
	orientation?: SliderOrientation
	tooltipPosition?: TooltipPosition
	markersPosition?: MarkerPosition
	value: ValueType
	min: number
	max: number
	step?: number
	minRange?: number
	disabled?: boolean
	tabIndex?: number
	customMarkers?: CustomMarker[]
	isMarkers?: boolean
	isVisibleMarkersLabel?: boolean
	onChange?: (value: ValueType) => void
	getMarkerLabel?: (value: number) => string | number
	getTooltipLabel?: (value: number) => string | number
}

export const Slider = memo((props: SliderProps) => {
	const {
		className,
		size = 'medium',
		orientation = 'horizontal',
		tooltipPosition = 'top',
		markersPosition = 'bottom',
		value: externalValue,
		min = 1,
		max = 100,
		step = 1,
		minRange = 1,
		disabled,
		tabIndex = 0,
		isMarkers,
		isVisibleMarkersLabel,
		customMarkers = [],
		onChange: externalOnChange,
		getMarkerLabel,
		getTooltipLabel,
		...otherProps
	} = props

	const [value, setValue] = useState<ValueType>(externalValue)
	const valueRef = useRef<ValueType>(value)

	const sliderRef = useRef<HTMLDivElement | null>(null)
	const minThumbRef = useRef<HTMLDivElement | null>(null)
	const maxThumbRef = useRef<HTMLDivElement | null>(null)
	const fillRef = useRef<HTMLDivElement | null>(null)
	const activeThumbIndexRef = useRef<0 | 1>(0)
	const isHorizontal = orientation === 'horizontal'

	const onChange = useCallback(
		(value: ValueType) => {
			setValue(value)
			externalOnChange?.(value)
		},
		[externalOnChange]
	)

	const { handleChange } = useChangeValue({
		valueRef,
		sliderRef,
		activeThumbIndexRef,
		minThumbRef,
		maxThumbRef,
		max,
		min,
		minRange,
		step,
		orientation,
		onChange,
	})

	const { isDragging, handleMouseDown } = useDragging({
		minThumbRef,
		maxThumbRef,
		fillRef,
		handleChange,
	})

	const { handleKeyDown } = useKeyboardNavigation({
		valueRef,
		activeThumbIndexRef,
		step,
		max,
		min,
		minRange,
		onChange,
	})

	const { renderMarkers } = useMarkers({
		value,
		step,
		min,
		max,
		customMarkers,
		isVisibleMarkersLabel,
		size,
		position: markersPosition,
		orientation,
		getMarkerLabel,
	})

	const handleFocus = useCallback((thumbIndex: 0 | 1) => {
		activeThumbIndexRef.current = thumbIndex
	}, [])

	const localCalculateTranslateThumb = useCallback(
		(value: number) => {
			return calculateTranslateThumb(value, min, max)
		},
		[min, max]
	)

	useEffect(() => {
		valueRef.current = value
	}, [value])

	const renderThumb = (
		value: number,
		index: 0 | 1,
		ref: React.RefObject<HTMLDivElement>
	) => {
		return (
			<Thumb
				ref={ref}
				orientation={orientation}
				size={size}
				tooltipPosition={tooltipPosition}
				tabIndex={tabIndex}
				disabled={disabled}
				isDragging={isDragging && activeThumbIndexRef.current === index}
				index={index}
				value={value}
				max={max}
				min={min}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				getTooltipLabel={getTooltipLabel}
				{...otherProps}
			></Thumb>
		)
	}

	const mods: Record<string, boolean | undefined> = {
		[styles['disabled']]: disabled,
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[size],
		styles[orientation],
	]

	return (
		<>
			<div
				className={classNames(styles['slider'], additionalClasses, mods)}
				ref={sliderRef}
				onMouseDown={handleMouseDown}
			>
				<div className={styles['track']}>
					{typeof value === 'number' ? (
						<>
							<div
								className={styles['fill']}
								style={{
									width: isHorizontal ? `${localCalculateTranslateThumb(value)}%` : '',
									height: !isHorizontal ? `${localCalculateTranslateThumb(value)}%` : '',
								}}
								ref={fillRef}
							></div>
							{isMarkers && renderMarkers()}
							{renderThumb(value, 0, minThumbRef)}
						</>
					) : (
						<>
							<div
								className={styles['fill']}
								style={{
									left: isHorizontal ? `${localCalculateTranslateThumb(value[0])}%` : '',
									bottom: !isHorizontal ? `${localCalculateTranslateThumb(value[0])}%` : '',
									width: isHorizontal ?  `${
										localCalculateTranslateThumb(value[1]) -
										localCalculateTranslateThumb(value[0])
									}%` : '',
									height: !isHorizontal ?  `${
										localCalculateTranslateThumb(value[1]) -
										localCalculateTranslateThumb(value[0])
									}%` : '',
								}}
								ref={fillRef}
							></div>
							{isMarkers && renderMarkers()}
							{renderThumb(value[0], 0, minThumbRef)}
							{renderThumb(value[1], 1, maxThumbRef)}
						</>
					)}
				</div>
			</div>
		</>
	)
})
