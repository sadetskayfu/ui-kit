type ScrollOrientation = 'horizontal' | 'vertical'

export const scrollToItem = (
	focusedItem: HTMLElement,
	itemList: HTMLElement,
	orientation: ScrollOrientation = 'vertical'
) => {
	const itemListRect = itemList.getBoundingClientRect()
	const focusedItemRect = focusedItem.getBoundingClientRect()

	if (orientation === 'vertical') {
		const focusedItemBottom = focusedItemRect.bottom
		const focusedItemTop = focusedItemRect.top
		const listBottom = itemListRect.bottom
		const listTop = itemListRect.top

		if (focusedItemBottom > listBottom) {
			itemList.scrollTop += focusedItemBottom - listBottom
		} else if (focusedItemTop < listTop) {
			itemList.scrollTop -= listTop - focusedItemTop
		}
	} else {
		const focusedItemRight = focusedItemRect.right
		const focusedItemLeft = focusedItemRect.left
		const listRight = itemListRect.right
		const listLeft = itemListRect.left

		if (focusedItemRight > listRight) {
			itemList.scrollLeft += focusedItemRight - listRight
		} else if (focusedItemLeft < listLeft) {
			itemList.scrollLeft -= listLeft - focusedItemLeft
		}
	}
}
