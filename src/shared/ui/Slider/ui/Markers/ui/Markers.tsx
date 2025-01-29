import {
	checkMarkerOnActive,
	getMarkerPosition,
	getMarkersArray,
} from '../helpers'
import { Marker, MarkerLabelPosition } from './Marker/Marker'
import { SliderOrientation, SliderSize, ValueType } from '../../Slider/Slider'

export type CustomMarker = {
	value: number
	label: string
}

interface MarkersProps {
	value: ValueType
	step: number
	min: number
	max: number
	customMarkers: CustomMarker[]
	isVisibleMarkersLabel: boolean | undefined
	orientation: SliderOrientation
	size: SliderSize
	labelPosition: MarkerLabelPosition
	getMarkerLabel?: (value: number) => string | number
}

const Markers = (props: MarkersProps) => {
	const {
		value,
		step,
		min,
		max,
		customMarkers,
		isVisibleMarkersLabel,
		orientation,
		size,
		labelPosition,
		getMarkerLabel,
	} = props

	const renderMarkers = () => {
		if (customMarkers.length > 0) {
			return customMarkers.map((marker) => {
				const markerValue = marker.value

				const position = getMarkerPosition(markerValue, min, max)
				const isActive = checkMarkerOnActive(markerValue, value)

				return (
					<Marker
						key={markerValue}
						label={marker.label}
						size={size}
						orientation={orientation}
						position={position}
						isActive={isActive}
						isVisibleLabel={isVisibleMarkersLabel}
						labelPosition={labelPosition}
					/>
				)
			})
		} else {
			const markersArray = getMarkersArray(min, max, step)

			return markersArray.map((markerValue) => {
				const position = getMarkerPosition(markerValue, min, max)
				const isActive = checkMarkerOnActive(markerValue, value)

				return (
					<Marker
						key={markerValue}
						label={getMarkerLabel ? getMarkerLabel(markerValue) : markerValue + ''}
						size={size}
						orientation={orientation}
						position={position}
						isActive={isActive}
						isVisibleLabel={isVisibleMarkersLabel}
						labelPosition={labelPosition}
					/>
				)
			})
		}
	}

	return <>{renderMarkers()}</>
}

export default Markers