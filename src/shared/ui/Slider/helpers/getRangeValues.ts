export const getRangeValues = (
	value: [number, number],
	newValue: number,
	activeThumbIndex: 0 | 1,
	minRange: number,
	step: number
) => {
	const newValues: [number, number] = [...value]

	const minThumbValue = activeThumbIndex === 0 ? newValue : newValues[0]
	const maxThumbValue = activeThumbIndex === 1 ? newValue : newValues[1]
	const range = step > minRange ? step : minRange

	let correctedValue: number = 0

	if (activeThumbIndex === 0) {
		if (minThumbValue + minRange >= maxThumbValue) {
			correctedValue = maxThumbValue - range
		} else {
			correctedValue = minThumbValue
		}
	}
	if (activeThumbIndex === 1) {
		if (maxThumbValue - minRange <= minThumbValue) {
			correctedValue = minThumbValue + range
		} else {
			correctedValue = maxThumbValue
		}
	}

	newValues[activeThumbIndex] = correctedValue

	return { newValues, correctedValue }
}
