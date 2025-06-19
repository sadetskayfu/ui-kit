export function getPercentage(value: number) {
	return (value * 100).toString().slice(0, 4) + '%';
};