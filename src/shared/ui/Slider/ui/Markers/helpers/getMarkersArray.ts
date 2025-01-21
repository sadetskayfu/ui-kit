export const getMarkersArray = (min: number, max: number, step: number) => {
	const markers = []

	for (let i = min; i <= max; i += step) {
		markers.push(i)
	}

	return markers
}
