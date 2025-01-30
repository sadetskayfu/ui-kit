import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollableContentOrientation } from '../ui/ScrollableContent'
import { scrollToItem as externalScrollToItem } from '@/shared/lib/KeyboardNavigation'
import throttle from 'lodash/throttle'

type UseScrollArgs = {
	containerRef: React.RefObject<HTMLDivElement>
	orientation: ScrollableContentOrientation
}

export const useScroll = (args: UseScrollArgs) => {
	const { containerRef, orientation } = args

	const [showStartArrow, setShowStartArrow] = useState(false)
	const [showEndArrow, setShowEndArrow] = useState(true)

	const scrollAmountRef = useRef<number>(0)

	const checkScroll = useCallback(() => {
		const container = containerRef.current

		if (container) {
			const {
				scrollTop,
				scrollLeft,
				scrollWidth,
				scrollHeight,
				clientWidth,
				clientHeight,
			} = container

			if (orientation === 'horizontal') {
				setShowStartArrow(scrollLeft > 0)
				setShowEndArrow(scrollLeft < scrollWidth - clientWidth)
			} else {
				setShowStartArrow(scrollTop > 0)
				setShowEndArrow(scrollTop < scrollHeight - clientHeight)
			}
		}
	}, [orientation, containerRef])

	const scroll = useCallback(
		(direction: 'start' | 'end') => {
			const container = containerRef.current

			if (!container) return

			const options: ScrollToOptions = {
				behavior: 'smooth',
			}
			const scrollAmount = scrollAmountRef.current

			if (orientation === 'horizontal') {
				options.left = direction === 'start' ? -scrollAmount : scrollAmount
			} else {
				options.top = direction === 'start' ? -scrollAmount : scrollAmount
			}

			container.scrollBy(options)
		},
		[orientation, containerRef]
	)

	const scrollToItem = useCallback(
		(index: number) => {
			const container = containerRef.current

			if (!container) return

			const item = container.children[index] as HTMLElement

			if (item) {
				externalScrollToItem(item, container, orientation)
			}
		},
		[orientation, containerRef]
	)

	const setScrollAmount = useCallback(() => {
		const container = containerRef.current

		if (container) {
			const containerRect = container.getBoundingClientRect()

			if (orientation === 'horizontal') {
				scrollAmountRef.current = containerRect.width
			} else {
				scrollAmountRef.current = containerRect.height
			}
		}
	}, [orientation, containerRef])

	useEffect(() => {
		const container = containerRef.current

		if (!container) return

		const handleChangeScrollAmount = throttle(setScrollAmount, 100)

		const resizeObserver = new ResizeObserver(handleChangeScrollAmount)

		resizeObserver.observe(container)

		return () => {
			handleChangeScrollAmount.cancel()
			resizeObserver.disconnect()
		}
	}, [setScrollAmount, containerRef])

	return { checkScroll, scroll, scrollToItem, showStartArrow, showEndArrow }
}
