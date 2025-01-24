import { useState, useRef, useCallback, memo, useEffect, Suspense } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import { useChangeValue, useDragging, useKeyboardNavigation } from '../../hooks'
import { Thumb } from '../Thumb/Thumb'
import { calculateTranslateThumb } from '../../helpers'
import { TooltipPosition } from '../Tooltip/Tooltip'
import { MarkerLabelPosition } from '../Markers/ui/Marker/Marker'
import { CustomMarker } from '../Markers'
import { Markers } from '../Markers'
import { useTouchDevice } from '@/shared/hooks'
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
	markerLabelPosition?: MarkerLabelPosition
	value: ValueType
	min: number
	max: number
	step?: number
	minRange?: number
	name?: string
	minInputName?: string
	maxInputName?: string
	disabled?: boolean
	tabIndex?: number
	customMarkers?: CustomMarker[]
	isTooltip?: boolean
	isMarkers?: boolean
	isVisibleMarkersLabel?: boolean
	onChange?: (value: ValueType, name: string) => void
	getMarkerLabel?: (value: number) => string | number
	getTooltipLabel?: (value: number) => string | number
	getAriaValueText?: (value: number) => string
}

export const Slider = memo((props: SliderProps) => {
	const {
		className,
		size = 'medium',
		orientation = 'horizontal',
		tooltipPosition = 'top',
		markerLabelPosition = 'bottom',
		value: externalValue,
		min = 1,
		max = 100,
		step = 1,
		minRange = 1,
		name = '',
		minInputName,
		maxInputName,
		disabled,
		tabIndex = 0,
		isTooltip = true,
		isMarkers,
		isVisibleMarkersLabel,
		customMarkers = [],
		onChange: externalOnChange,
		getMarkerLabel,
		getTooltipLabel,
		getAriaValueText,
		...otherProps
	} = props

	const [value, setValue] = useState<ValueType>(externalValue)
	const valueRef = useRef<ValueType>(value)
	const { isTouchDevice } = useTouchDevice()

	const sliderRef = useRef<HTMLDivElement | null>(null)
	const minThumbRef = useRef<HTMLDivElement | null>(null)
	const maxThumbRef = useRef<HTMLDivElement | null>(null)
	const fillRef = useRef<HTMLDivElement | null>(null)
	const activeThumbIndexRef = useRef<0 | 1>(0)
	const isHorizontal = orientation === 'horizontal'

	const onChange = useCallback(
		(value: ValueType) => {
			setValue(value)
			externalOnChange?.(value, name)
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
		isTouchDevice,
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

	useEffect(() => {
		if (Array.isArray(externalValue)) {
			const arrayValue = value as [number, number]

			if (
				externalValue[0] !== arrayValue[0] ||
				externalValue[1] !== arrayValue[1]
			) {
				onChange(externalValue)
			}
		} else {
			if (externalValue !== value) {
				onChange(externalValue)
			}
		}
	}, [externalValue])

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
				isTooltip={isTooltip}
				index={index}
				value={value}
				max={max}
				min={min}
				name={index === 0 ? minInputName : maxInputName}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				getTooltipLabel={getTooltipLabel}
				getAriaValueText={getAriaValueText}
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
				onMouseDown={isTouchDevice ? undefined : handleMouseDown}
				onTouchStart={isTouchDevice ? handleMouseDown : undefined}
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
							{isMarkers && (
								<Suspense>
									<Markers
										value={value}
										min={min}
										max={max}
										step={step}
										size={size}
										labelPosition={markerLabelPosition}
										orientation={orientation}
										isVisibleMarkersLabel={isVisibleMarkersLabel}
										customMarkers={customMarkers}
										getMarkerLabel={getMarkerLabel}
									/>
								</Suspense>
							)}
							{renderThumb(value, 0, minThumbRef)}
						</>
					) : (
						<>
							<div
								className={styles['fill']}
								style={{
									left: isHorizontal ? `${localCalculateTranslateThumb(value[0])}%` : '',
									bottom: !isHorizontal
										? `${localCalculateTranslateThumb(value[0])}%`
										: '',
									width: isHorizontal
										? `${
												localCalculateTranslateThumb(value[1]) -
												localCalculateTranslateThumb(value[0])
											}%`
										: '',
									height: !isHorizontal
										? `${
												localCalculateTranslateThumb(value[1]) -
												localCalculateTranslateThumb(value[0])
											}%`
										: '',
								}}
								ref={fillRef}
							></div>
							{isMarkers && (
								<Suspense>
									<Markers
										value={value}
										min={min}
										max={max}
										step={step}
										size={size}
										labelPosition={markerLabelPosition}
										orientation={orientation}
										isVisibleMarkersLabel={isVisibleMarkersLabel}
										customMarkers={customMarkers}
										getMarkerLabel={getMarkerLabel}
									/>
								</Suspense>
							)}
							{renderThumb(value[0], 0, minThumbRef)}
							{renderThumb(value[1], 1, maxThumbRef)}
						</>
					)}
				</div>
			</div>
		</>
	)
})
