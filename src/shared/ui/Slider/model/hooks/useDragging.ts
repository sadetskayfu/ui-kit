import { useCallback, useEffect, useRef, useState } from 'react'

type UseDraggingInputValues = {
	minThumbRef: React.RefObject<HTMLDivElement | null>
	maxThumbRef: React.RefObject<HTMLDivElement | null>
	fillRef: React.RefObject<HTMLDivElement | null>
	handleChange: (event: React.MouseEvent | MouseEvent) => void
}

export const useDragging = (inputValues: UseDraggingInputValues) => {
	const { minThumbRef, maxThumbRef, fillRef, handleChange } = inputValues

	const [isDragging, setIsDragging] = useState<boolean>(false)

	const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)
	const isTransitionClearedRef = useRef<boolean>(false)

	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			event.preventDefault()

			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
			}
			isTransitionClearedRef.current = false

			const minThumb = minThumbRef.current
			const maxThumb = maxThumbRef.current
			const fill = fillRef.current

			if (minThumb && fill) {
				minThumb.style.transition = '0.2s'
				fill.style.transition = '0.2s'
			}
			if (maxThumb) {
				maxThumb.style.transition = '0.2s'
			}

			timeoutIdRef.current = setTimeout(() => {
				if (minThumb && fill) {
					minThumb.style.transition = ''
					fill.style.transition = ''
				}
				if (maxThumb) {
					maxThumb.style.transition = ''
				}
			}, 200)

			setIsDragging(true)
			handleChange(event)
		},
		[handleChange]
	)

	const handleMouseMove = useCallback(
		(event: MouseEvent) => {
			const minThumb = minThumbRef.current
			const maxThumb = maxThumbRef.current
			const fill = fillRef.current

			if (!isTransitionClearedRef.current) {
				if (minThumb && fill) {
					minThumb.style.transition = ''
					fill.style.transition = ''
				}
				if (maxThumb) {
					maxThumb.style.transition = ''
				}
				isTransitionClearedRef.current = true
			}

			handleChange(event)
		},
		[handleChange]
	)

	const handleMouseUp = useCallback(() => {
		setIsDragging(false)
	}, [])

	useEffect(() => {
		if (isDragging) {
			document.addEventListener('mousemove', handleMouseMove)
			document.addEventListener('mouseup', handleMouseUp)
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging])

	useEffect(() => {
		return () => {
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
			}
		}
	}, [])

	return { isDragging, handleMouseDown }
}
