import { useEffect, useRef } from 'react'

export const getElements = (
	elementRef: React.RefObject<HTMLElement | null>,
    isVisible: boolean = true
) => {
	const interactiveElementsRef = useRef<
		Array<HTMLButtonElement | HTMLAnchorElement>
	>([])

	// Get elements
	useEffect(() => {
		const element = elementRef.current

		if (!element || !isVisible) return

		const updateInteractiveElements = () => {
			const interactiveElements = Array.from(
				element.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>('a, button')
			)
			interactiveElementsRef.current = interactiveElements
		}

		const observer = new MutationObserver(updateInteractiveElements)

		observer.observe(element, {
			childList: true,
		})

		updateInteractiveElements()

		return () => {
			observer.disconnect()
		}
	}, [isVisible])

	return interactiveElementsRef
}
