export const setScroll = (
	focusedElement: HTMLElement,
	list: HTMLElement
) => {
	const listRect = list.getBoundingClientRect()
	const focusedElementRect = focusedElement.getBoundingClientRect()

	const focusedElementBottom = focusedElementRect.bottom
	const focusedElementTop = focusedElementRect.top
	const listBottom = listRect.bottom
	const listTop = listRect.top

	if (focusedElementBottom > listBottom) {
		list.scrollTop += focusedElementBottom - listBottom
	} else if (focusedElementTop < listTop) {
		list.scrollTop -= listTop - focusedElementTop
	}
}
