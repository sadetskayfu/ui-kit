import throttle from 'lodash/throttle'
import { useCallback, useEffect } from 'react'

type Orientation = 'horizontal' | 'vertical'

type UseFloatingIndicatorInputValues = {
	indicatorRef: React.RefObject<HTMLSpanElement | null>
	elementListRef: React.RefObject<HTMLElement | null>
	activeElementRef: React.RefObject<HTMLElement | null>
	orientation: Orientation
	isVisible: boolean | undefined
}

export const useFloatingIndicator = (
	inputValues: UseFloatingIndicatorInputValues
) => {
	const {
		indicatorRef,
		elementListRef,
		activeElementRef,
		orientation,
		isVisible,
	} = inputValues

	const handleChangeIndicatorPosition = useCallback(() => {
		const indicator = indicatorRef.current
		const activeElement = activeElementRef.current
		const elementList = elementListRef.current
		
		if (!indicator || !activeElement || !elementList) return
		
		const activeElementRect = activeElement.getBoundingClientRect()
		const elementListRect = elementList.getBoundingClientRect()

		if (orientation === 'horizontal') {
			const left = activeElementRect.left - elementListRect.left

			Object.assign(indicator.style, {
				width: `${activeElementRect.width / 16}rem`,
				left: `${left / 16}rem`,
				height: '1px',
				top: '',
			  });
		} else {
			const top = activeElementRect.top - elementListRect.top

			Object.assign(indicator.style, {
				height: `${activeElementRect.height / 16}rem`,
				top: `${top / 16}rem`,
				width: '',
				left: '',
			  });
		}
	}, [orientation])

	useEffect(() => {
		if (!isVisible) return

		const throttledHandleChangeIndicatorPosition = throttle(
			handleChangeIndicatorPosition,
			100
		)

		window.addEventListener('resize', throttledHandleChangeIndicatorPosition)

		return () => {
			window.removeEventListener('resize', throttledHandleChangeIndicatorPosition)
			throttledHandleChangeIndicatorPosition.cancel()
		}
	}, [handleChangeIndicatorPosition, isVisible])

	return handleChangeIndicatorPosition
}
