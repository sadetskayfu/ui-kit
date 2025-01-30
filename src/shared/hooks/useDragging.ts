import { useCallback, useEffect, useRef, useState } from 'react'

type Diff = {
	x: number
	y: number
}

export const useDragging = (elementRef: React.RefObject<HTMLElement>) => {
	const [isDragging, setIsDragging] = useState(false)

	const diffRef = useRef<Diff>({
		x: 0,
		y: 0,
	})

	const handleMouseDown = useCallback((event: React.MouseEvent) => {
		const element = elementRef.current

		if (element) {
			const elementRect = element.getBoundingClientRect()

			diffRef.current.x = Math.abs(elementRect.left - event.clientX)
			diffRef.current.y = Math.abs(elementRect.top - event.clientY)
		}

		setIsDragging(true)
	}, [elementRef])

	const handleMouseUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			if (isDragging) {
				const element = elementRef.current
				const diff = diffRef.current

				if (element) {
					element.style.left = event.clientX - diff.x + 'px'
					element.style.top = event.clientY - diff.y + 'px'
				}
			}
		},
		[isDragging, elementRef]
	)

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mouseup', handleMouseUp)
            document.addEventListener('mousemove', handleMouseMove)
		}
		return () => {
			document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mousemove', handleMouseMove)
		}
	}, [isDragging, handleMouseMove, handleMouseUp])

	return { handleMouseDown }
}
