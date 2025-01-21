export const getMarkerPosition = (markerValue: number, min: number, max: number) => {
	const position = `${((markerValue - min) / (max - min)) * 100}%`

	return position
}
