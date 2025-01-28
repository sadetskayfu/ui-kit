import { useCallback, useRef } from 'react'
import { getNextEnabledIndex } from '../getNextEnabledIndex'

export const useKeyboardNavigation = (
	elementsRef: React.MutableRefObject<
		Array<HTMLButtonElement | HTMLAnchorElement>
	>
) => {
	const activeIndexRef = useRef<number>(-1)

	const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
		const currentIndex = activeIndexRef.current
		const elements = elementsRef.current

		let nextIndex: number = currentIndex

		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowUp':
				event.preventDefault()
				nextIndex = getNextEnabledIndex(elements, currentIndex, -1)
				break
			case 'ArrowRight':
			case 'ArrowDown':
				event.preventDefault()
				nextIndex = getNextEnabledIndex(elements, currentIndex, 1)
				break
			default:
				break
		}

		if (nextIndex !== currentIndex) {
			activeIndexRef.current = nextIndex
			elements[nextIndex].focus()
		}
	}, [])

	const updateActiveIndex = useCallback((index: number) => {
		if (index !== activeIndexRef.current) {
			activeIndexRef.current = index
		}
	}, [])

	return { handleKeyDown, updateActiveIndex }
}
