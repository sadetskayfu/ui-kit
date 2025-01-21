import { SliderOrientation } from '../ui/Slider/Slider'

export const getPercentage = (
	clickPosition: number,
	sliderRect: DOMRect,
	orientation: SliderOrientation
) => {
	if (orientation === 'horizontal') {
		const percentage = Math.min(
			Math.max((clickPosition / sliderRect.width) * 100, 0),
			100
		)
		return percentage
	} else {
		const percentage = Math.max(
			Math.min(100 - (clickPosition / sliderRect.height) * 100, 100),
			0
		)
		return percentage
	}
}
