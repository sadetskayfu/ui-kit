export const calculateTranslateThumb = (
	value: number,
	min: number,
	max: number
): number => ((value - min) * 100) / (max - min)
