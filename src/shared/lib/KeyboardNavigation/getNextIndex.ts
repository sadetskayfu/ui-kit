export const getNextIndex = (
	totalCountElements: number,
	currentIndex: number,
	direction: 1 | -1,
	infinity: boolean = true
): number => {
	let nextIndex = currentIndex

	if (infinity) {
		nextIndex =
			currentIndex === -1 && direction === -1
				? totalCountElements - 1
				: (currentIndex + direction + totalCountElements) % totalCountElements
	} else {
		nextIndex = currentIndex + direction

		if (nextIndex > totalCountElements - 1 || nextIndex < 0) {
			return currentIndex
		}
	}

	return nextIndex
}
