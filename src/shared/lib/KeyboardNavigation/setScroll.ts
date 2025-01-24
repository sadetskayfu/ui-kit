export const setScroll = (
	focusedElement: HTMLElement,
	elementList: HTMLElement
) => {
	const elementListRect = elementList.getBoundingClientRect()
	const focusedElementRect = focusedElement.getBoundingClientRect()

	const focusedElementBottom = focusedElementRect.bottom
	const focusedElementTop = focusedElementRect.top
	const listBottom = elementListRect.bottom
	const listTop = elementListRect.top

	if (focusedElementBottom > listBottom) {
		elementList.scrollTop += focusedElementBottom - listBottom
	} else if (focusedElementTop < listTop) {
		elementList.scrollTop -= listTop - focusedElementTop
	}
}
