import { getNextIndex } from '@/shared/lib/KeyboardNavigation'
import { useCallback, useEffect, useRef } from 'react'

type UseKeyboardNavigationArgs = {
	elementRef: React.RefObject<HTMLElement | null>
	focusableElementsRef: React.MutableRefObject<HTMLElement[]>
	isOpen: boolean
	isOpenSubMenu?: boolean
	isDropdownMenu?: boolean
	onClose: () => void
}

export const useKeyboardNavigation = (
	args: UseKeyboardNavigationArgs
) => {
	const {
		elementRef,
		focusableElementsRef,
		isOpen,
		isOpenSubMenu,
		isDropdownMenu,
		onClose,
	} = args

	const activeIndexRef = useRef<number>(-1)

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			const focusableElements = focusableElementsRef.current
			const currentIndex = activeIndexRef.current

			let nextIndex = activeIndexRef.current

			if (isDropdownMenu) {
				if(isOpenSubMenu) return

				switch (event.key) {
					case 'ArrowDown':
					case 'ArrowUp':
					case 'ArrowLeft':
					case 'ArrowRight':
						event.preventDefault()

						const direction =
							event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1

						nextIndex = getNextIndex(
							focusableElements.length,
							currentIndex,
							direction
						)
						break
					case 'Escape':
					case 'Tab':
						event.preventDefault()

						onClose()

						break
					default:
						break
				}
			} else {
				switch (event.key) {
					case 'Tab':
						event.preventDefault()

						const direction = event.shiftKey ? -1 : 1

						nextIndex = getNextIndex(
							focusableElements.length,
							currentIndex,
							direction
						)

						break
					case 'Escape':
						event.preventDefault()

						onClose()

						break
					default:
						break
				}
			}

			if (nextIndex !== currentIndex) {
				activeIndexRef.current = nextIndex
				focusableElements[nextIndex].focus()
			}
		},
		[onClose, isDropdownMenu, isOpenSubMenu]
	)

	// Reset active index
	useEffect(() => {
		if (!isOpen && activeIndexRef.current !== -1) {
			activeIndexRef.current = -1
		}
	}, [isOpen])

	// Focus on element after open
	useEffect(() => {
		if (isOpen && activeIndexRef.current === -1) {
			elementRef.current?.focus()
		}
	}, [isOpen])

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown)
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [handleKeyDown, isOpen])
}
