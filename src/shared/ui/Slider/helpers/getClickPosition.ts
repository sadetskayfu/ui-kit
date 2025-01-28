import { SliderOrientation } from '../ui/Slider/Slider'

export const getClickPosition = (
	event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent,
	orientation: SliderOrientation,
	sliderRect: DOMRect
) => {
	const isTouchEvent = event instanceof TouchEvent || 'touches' in event
	const isHorizontal = orientation === 'horizontal'
	const offset = isHorizontal ? sliderRect.left : sliderRect.top
	
	if (isTouchEvent) {
		if (event.touches.length === 0) return 0

		const coordinate = isHorizontal
			? event.touches[0].clientX
			: event.touches[0].clientY

		return coordinate - offset
	} else {
		const coordinate = isHorizontal ? event.clientX : event.clientY

		return coordinate - offset
	}
}
