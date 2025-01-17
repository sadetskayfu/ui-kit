import { useCallback } from 'react'
import {
	SliderOrientation,
	SliderSize,
	ValueType,
} from '../../ui/Slider/Slider'
import { Marker, MarkerPosition } from '../../ui/Marker/Marker'

export type CustomMarker = {
	value: number
	label: string
}

type UseMarkersInputValues = {
	value: ValueType
	step: number
	min: number
	max: number
	customMarkers: CustomMarker[]
	isVisibleMarkersLabel: boolean | undefined
	orientation: SliderOrientation
	size: SliderSize
	position: MarkerPosition
	getMarkerLabel?: (value: number) => string | number
}

export const useMarkers = (inputValues: UseMarkersInputValues) => {
	const {
		value,
		step,
		min,
		max,
		customMarkers,
		isVisibleMarkersLabel,
		orientation,
		size,
		position,
		getMarkerLabel,
	} = inputValues

	const getMarkersArray = useCallback(() => {
		const markers = []

		for (let i = min; i <= max; i += step) {
			markers.push(i)
		}

		return markers
	}, [min, max, step])

	const getMarkerTranslate = useCallback(
		(markerValue: number) => {
			const position = `${((markerValue - min) / (max - min)) * 100}%`

			return position
		},
		[min, max]
	)

	const getActiveMarker = useCallback(
		(markerValue: number, value: ValueType) => {
			const isActive = Array.isArray(value)
				? markerValue >= value[0] && markerValue <= value[1]
				: markerValue <= value

			return isActive
		},
		[]
	)

	const renderMarkers = useCallback(() => {
		if (customMarkers.length > 0) {
			return customMarkers.map((marker) => {
				const markerValue = marker.value

				const translate = getMarkerTranslate(markerValue)
				const isActive = getActiveMarker(markerValue, value)

				return (
					<Marker
						label={marker.label}
						size={size}
						orientation={orientation}
						translate={translate}
						isActive={isActive}
						isVisibleLabel={isVisibleMarkersLabel}
						position={position}
					/>
				)
			})
		} else {
			const markersArray = getMarkersArray()

			return markersArray.map((markerValue) => {
				const translate = getMarkerTranslate(markerValue)
				const isActive = getActiveMarker(markerValue, value)

				return (
					<Marker
						label={getMarkerLabel ? getMarkerLabel(markerValue) : markerValue + ''}
						size={size}
						orientation={orientation}
						translate={translate}
						isActive={isActive}
						isVisibleLabel={isVisibleMarkersLabel}
						position={position}
					/>
				)
			})
		}
	}, [
		value,
		min,
		max,
		isVisibleMarkersLabel,
		customMarkers,
		orientation,
		size,
		position,
		getMarkersArray,
		getActiveMarker,
		getMarkerLabel,
	])

	return { renderMarkers }
}
