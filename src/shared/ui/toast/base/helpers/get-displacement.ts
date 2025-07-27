export function getDisplacement(
	direction: 'up' | 'down' | 'left' | 'right' | undefined,
	deltaX: number,
	deltaY: number
) {
	switch (direction) {
		case 'up':
			return -deltaY;
		case 'down':
			return deltaY;
		case 'left':
			return -deltaX;
		case 'right':
			return deltaX;
		default:
			return 0;
	}
}
