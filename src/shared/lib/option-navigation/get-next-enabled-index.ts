type GetNextEnabledIndexProps = {
	items: HTMLElement[];
	currentIndex: number;
	direction: 1 | -1;
	step?: number;
};

export function getNextEnabledIndex({
	items,
	currentIndex,
	direction,
	step = 1,
}: GetNextEnabledIndexProps): number {
	const itemCount = items.length;

	let nextIndex = currentIndex;

    console.log(itemCount)

	for (let i = 1; i <= itemCount; i++) {
		nextIndex = (direction * i * step) + currentIndex;

		if (nextIndex > itemCount - 1) {
			nextIndex = 0;
		}

		if (nextIndex < 0) {
			nextIndex = itemCount - 1;
		}

		const isDisabled =
			items[nextIndex].getAttribute('aria-disabled') === 'true' ||
			items[nextIndex].getAttribute('disabled') ||
			items[nextIndex].getAttribute('data-is-not-option');

		if (!isDisabled) return nextIndex;
	}
	return -1;
}
