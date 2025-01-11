export const getNextEnabledIndex = (
	elements: HTMLElement[],
	currentIndex: number,
	direction: 1 | -1
): number => {
	const elementCount = elements.length

	let nextIndex = currentIndex

	for (let i = 1; i <= elementCount; i++) {
		const step = direction * i
		nextIndex =
			currentIndex === -1 && direction === -1
				? elementCount - 1
				: (currentIndex + step + elementCount) % elementCount

		const isDisabled =
			elements[nextIndex].getAttribute('data-disabled') === 'true' ||
			elements[nextIndex].getAttribute('disabled') === 'true'

		if (!isDisabled) return nextIndex
	}
	return -1
}
