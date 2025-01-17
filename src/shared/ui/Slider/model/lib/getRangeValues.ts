import { getCorrectedValueWithRange } from './getCorrectedValueWithRange'

export const getRangeValues = (
	value: [number, number],
	newValue: number,
	activeThumbIndex: 0 | 1,
	minRange: number
) => {
	const newValues: [number, number] = [...value]

	const minThumbValue = activeThumbIndex === 0 ? newValue : newValues[0]
	const maxThumbValue = activeThumbIndex === 1 ? newValue : newValues[1]

    const correctedValue = getCorrectedValueWithRange(
		minThumbValue,
		maxThumbValue,
		minRange,
		activeThumbIndex) as number

	newValues[activeThumbIndex] = correctedValue

	return {newValues, correctedValue}
}
