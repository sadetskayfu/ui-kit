export function getCircleParams(size: number, strokeWidth: number) {
	const radius = (size - strokeWidth) / 2;
	const circumferenceLength = 2 * Math.PI * radius;

	return { radius, circumferenceLength };
}
