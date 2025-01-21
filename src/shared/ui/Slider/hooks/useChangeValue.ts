import { useCallback, useEffect } from 'react'
import {
	getClickPosition,
	getNearestThumb,
	getPercentage,
	getRangeValues,
	roundToStep,
} from '../helpers'
import throttle from 'lodash/throttle'
import { SliderOrientation, ValueType } from '../ui/Slider/Slider'

type UseChangeValueInputValues = {
	valueRef: React.MutableRefObject<ValueType>
	sliderRef: React.RefObject<HTMLDivElement | null>
	activeThumbIndexRef: React.MutableRefObject<0 | 1>
	minThumbRef: React.RefObject<HTMLDivElement | null>
	maxThumbRef: React.RefObject<HTMLDivElement | null>
	min: number
	max: number
	step: number
	minRange: number
	orientation: SliderOrientation
	onChange: (value: ValueType) => void
}

export const useChangeValue = (inputValues: UseChangeValueInputValues) => {
	const {
		valueRef,
		sliderRef,
		activeThumbIndexRef,
		minThumbRef,
		maxThumbRef,
		min,
		max,
		step,
		minRange,
		orientation,
		onChange,
	} = inputValues

	const handleChange = useCallback(
		throttle(
			(event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
				const value = valueRef.current
				const slider = sliderRef.current

				if (!slider) return

				const sliderRect = slider.getBoundingClientRect()

				const clickPosition = getClickPosition(event, orientation, sliderRect)

				if (
					clickPosition >
						(orientation === 'horizontal' ? sliderRect.width : sliderRect.height) +
							10 ||
					clickPosition < -10
				)
					return

				const percentage = getPercentage(clickPosition, sliderRect, orientation)

				let newValue = Math.round(((max - min) / 100) * percentage + min)

				if (step > 1) {
					newValue = roundToStep(newValue, min, step)
				}

				if (Array.isArray(value)) {
					const minThumb = minThumbRef.current
					const maxThumb = maxThumbRef.current

					if (!minThumb || !maxThumb) return

					const thumbIndex = getNearestThumb(
						sliderRect,
						minThumb,
						maxThumb,
						clickPosition,
						orientation
					)

					if (activeThumbIndexRef.current !== thumbIndex) {
						activeThumbIndexRef.current = thumbIndex
					}

					if (thumbIndex === 0 && document.activeElement !== minThumb) {
						minThumb.focus()
					} else if (thumbIndex === 1 && document.activeElement !== maxThumb) {
						maxThumb.focus()
					}

					const { newValues, correctedValue } = getRangeValues(
						value,
						newValue,
						thumbIndex,
						minRange,
						step
					)

					if (correctedValue !== value[thumbIndex]) {
						onChange(newValues)
					}
				} else {
					const minThumb = minThumbRef.current

					if (minThumb && document.activeElement !== minThumb) {
						minThumb.focus()
					}
					if (value !== newValue) {
						onChange(newValue)
					}
				}
			},
			15
		),
		[max, min, minRange, step, orientation, onChange]
	)

	useEffect(() => {
		return () => {
			handleChange.cancel()
		}
	}, [handleChange])

	return { handleChange }
}
