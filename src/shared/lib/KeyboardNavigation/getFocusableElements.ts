import { ID } from '@/shared/constants/id'
import { useEffect, useRef } from 'react'

export const getFocusableElements = (
	elementRef: React.RefObject<HTMLElement | null>,
	isOpen: boolean
) => {
	const focusableElementsRef = useRef<HTMLElement[]>([])

	// Get elements
	useEffect(() => {
		const element = elementRef.current

		if (!element || !isOpen) return
        
		const updateFocusableElements = () => {
			const focusableElements = Array.from(
				element.querySelectorAll<HTMLElement>(
					'a, button, input, textarea, select, [tabindex]'
				)
			).filter((el) => el.tabIndex !== -1)

			focusableElementsRef.current = focusableElements
		}

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.type === 'childList') {
					// Ignoring non HTML elements and add ripple <span>
					mutation.addedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.id !== ID.RIPPLE) {
							updateFocusableElements()
						}
					})
					// Ignoring non HTML elements and remove ripple <span>
					mutation.removedNodes.forEach((node) => {
						if (node instanceof HTMLElement && node.id !== ID.RIPPLE) {
							updateFocusableElements()
						}
					})
				}
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'tabindex'
				) {
					updateFocusableElements()
				}
			})
		})

		observer.observe(element, {
			childList: true,
			subtree: true,
			attributes: true,
		})

		updateFocusableElements()

		return () => {
			observer.disconnect()
		}
	}, [isOpen])

    return focusableElementsRef
}
