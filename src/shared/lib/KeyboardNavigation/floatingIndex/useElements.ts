import { AriaRole, useEffect, useRef } from 'react'

export const useElements = (
	elementRef: React.RefObject<HTMLElement | null>,
    isVisible: boolean = true,
	role?: AriaRole
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
			if(role) {
				interactiveElementsRef.current = interactiveElements.filter((element) => element.role === role)
			} else {
				interactiveElementsRef.current = interactiveElements
			}
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
