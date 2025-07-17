type ScrollToItemProps = {
	activeItem: HTMLElement;
	itemList: HTMLElement;
	orientation?: 'horizontal' | 'vertical';
};

export function scrollToItem({
	activeItem,
	itemList,
	orientation = 'vertical',
}: ScrollToItemProps) {
	const itemListRect = itemList.getBoundingClientRect();
	const activeItemRect = activeItem.getBoundingClientRect();

	if (orientation === 'vertical') {
		const activeItemBottom = activeItemRect.bottom;
		const activeItemTop = activeItemRect.top;
		const listBottom = itemListRect.bottom;
		const listTop = itemListRect.top;

		if (activeItemBottom > listBottom) {
			itemList.scrollTop += activeItemBottom - listBottom;
		} else if (activeItemTop < listTop) {
			itemList.scrollTop -= listTop - activeItemTop;
		}
	} else {
		const activeItemRight = activeItemRect.right;
		const activeItemLeft = activeItemRect.left;
		const listRight = itemListRect.right;
		const listLeft = itemListRect.left;

		if (activeItemRight > listRight) {
			itemList.scrollLeft += activeItemRight - listRight;
		} else if (activeItemLeft < listLeft) {
			itemList.scrollLeft -= listLeft - activeItemLeft;
		}
	}
}
