import { ValueType } from '../../Slider/Slider'

export const checkMarkerOnActive = (markerValue: number, value: ValueType) => {
	const isActive = Array.isArray(value)
		? markerValue >= value[0] && markerValue <= value[1]
		: markerValue <= value

	return isActive
}
