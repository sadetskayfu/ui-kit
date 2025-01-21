import { SliderOrientation } from '../ui/Slider/Slider'

export const getNearestThumb = (
	sliderRect: DOMRect,
	minThumb: HTMLDivElement,
	maxThumb: HTMLDivElement,
	clickPosition: number,
	orientation: SliderOrientation
): 0 | 1 => {
	const minThumbRect = minThumb.getBoundingClientRect()
	const maxThumbRect = maxThumb.getBoundingClientRect()

	let minThumbPosition
	let maxThumbPosition

	if (orientation === 'horizontal') {
		const halfThumbWidth = minThumbRect.width / 2

		minThumbPosition =
			minThumbRect.left - sliderRect.left + halfThumbWidth

		maxThumbPosition =
			maxThumbRect.left - sliderRect.left + halfThumbWidth
	} else {
		const halfThumbHeight = minThumbRect.height / 2

		minThumbPosition =
			minThumbRect.top - sliderRect.top + halfThumbHeight

		maxThumbPosition =
			maxThumbRect.top - sliderRect.top + halfThumbHeight
	}

	const thumbIndex =
		Math.abs(clickPosition - minThumbPosition) <
		Math.abs(clickPosition - maxThumbPosition)
			? 0
			: 1

	return thumbIndex
}
