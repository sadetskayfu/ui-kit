import { SliderOrientation } from "../../ui/Slider/Slider"

export const getClickPosition = (
    event: React.MouseEvent | MouseEvent,
    orientation: SliderOrientation,
    sliderRect: DOMRect
) => {
    if (orientation === 'horizontal') {
        return event.clientX - sliderRect.left
    } else {
        return event.clientY - sliderRect.top
    }
}