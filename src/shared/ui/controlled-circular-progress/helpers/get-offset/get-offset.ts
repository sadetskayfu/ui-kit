export function getOffset(
	value: number,
	minValue: number,
	maxValue: number,
	circumferenceLength: number
) {
	if (maxValue === minValue) {
		throw new Error('maxValue must not equal minValue to avoid division by zero');
	}

	const correctedValue = Math.max(Math.min(value, maxValue), minValue);

	const offset =
		circumferenceLength -
		((correctedValue - minValue) / (maxValue - minValue)) * circumferenceLength;

	return offset;
}
