export type setPositionFollowCursorArgs = {
	event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent
	tooltip: HTMLElement
	offset?: number
	reserveSpace?: number
}

export const setPositionFollowCursor = (args: setPositionFollowCursorArgs) => {
	const { event, tooltip, offset = 20, reserveSpace = 10 } = args

    const isTouchEvent = event instanceof TouchEvent || 'touches' in event

    let clientX: number
    let clientY: number

    if(isTouchEvent) {
        if (event.touches.length === 0) return 0

        clientX = event.touches[0].clientX
        clientY = event.touches[0].clientY
    } else {
        clientX = event.clientX
        clientY = event.clientY
    }

	const tooltipWidth = tooltip.offsetWidth
	const halfTooltipWidth = tooltipWidth / 2
	const tooltipHeight = tooltip.offsetHeight

	let x = clientX + window.scrollX - halfTooltipWidth
	let y = clientY + window.scrollY + offset

	if (clientY + offset + tooltipHeight > window.innerHeight) {
		y = clientY + window.scrollY - tooltipHeight - offset
	}
	if (clientX + reserveSpace + halfTooltipWidth >= window.innerWidth) {
		x = window.innerWidth - tooltipWidth - reserveSpace + window.scrollX
	}
	if (clientX <= halfTooltipWidth + reserveSpace) {
		x = reserveSpace + window.scrollX
	}

	tooltip.style.translate = `${x / 16}rem ${y / 16}rem`
}
