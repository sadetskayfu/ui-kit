type Orientation = 'horizontal' | 'vertical'

export const setIndicatorPosition = (indicator: HTMLElement, activeElement: HTMLElement, parent: HTMLElement, orientation: Orientation) => {
    if(orientation === 'horizontal') {
        const activeElementRect = activeElement.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()

        const left = activeElementRect.left - parentRect.left

        indicator.style.width = activeElementRect.width + 'px'
        indicator.style.left = left + 'px'
        indicator.style.height = ''
        indicator.style.top = ''
    } else {
        const activeElementRect = activeElement.getBoundingClientRect()
        const parentRect = parent.getBoundingClientRect()

        const top = activeElementRect.top - parentRect.top

        indicator.style.height = activeElementRect.height + 'px'
        indicator.style.top = top + 'px'
        indicator.style.width = ''
        indicator.style.left = ''
    }
}
