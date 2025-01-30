import { useCallback, useEffect, useRef, useState } from 'react'

type UseDraggingInputValues = {
	minThumbRef: React.RefObject<HTMLDivElement | null>
	maxThumbRef: React.RefObject<HTMLDivElement | null>
	fillRef: React.RefObject<HTMLDivElement | null>
	isTouchDevice: boolean
	handleChange: (event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => void
}

export const useDragging = (inputValues: UseDraggingInputValues) => {
	const { minThumbRef, maxThumbRef, fillRef, isTouchDevice, handleChange } = inputValues

	const [isDragging, setIsDragging] = useState<boolean>(false)

	const isTransitionClearedRef = useRef<boolean>(false)

	const handleMouseDown = useCallback(
		(event: React.MouseEvent | React.TouchEvent) => {
			event.preventDefault()

			setIsDragging(true)
			handleChange(event)
		},
		[handleChange]
	)

	const handleMouseMove = useCallback(
		(event: MouseEvent | TouchEvent) => {
			event.preventDefault()

			const minThumb = minThumbRef.current
			const maxThumb = maxThumbRef.current
			const fill = fillRef.current

			if (!isTransitionClearedRef.current) {
				if (minThumb && fill) {
					minThumb.style.transitionDuration = ''
					fill.style.transitionDuration = ''
				}
				if (maxThumb) {
					maxThumb.style.transitionDuration = ''
				}
				isTransitionClearedRef.current = true
			}

			handleChange(event)
		},
		[handleChange, fillRef, maxThumbRef, minThumbRef]
	)

	const handleMouseUp = useCallback((event: MouseEvent | TouchEvent) => {
		event.preventDefault()

		const minThumb = minThumbRef.current
		const maxThumb = maxThumbRef.current
		const fill = fillRef.current

		setIsDragging(false)

		isTransitionClearedRef.current = false

		if (minThumb && fill) {
			minThumb.style.transitionDuration = '0.2s'
			fill.style.transitionDuration = '0.2s'
		}
		if (maxThumb) {
			maxThumb.style.transitionDuration = '0.2s'
		}
	}, [fillRef, maxThumbRef, minThumbRef])

	useEffect(() => {
		if (isDragging) {
			if(isTouchDevice) {
				document.addEventListener('touchmove', handleMouseMove)
				document.addEventListener('touchend', handleMouseUp)
			} else {
				document.addEventListener('mousemove', handleMouseMove)
				document.addEventListener('mouseup', handleMouseUp)
			}
		}

		return () => {
				document.removeEventListener('touchmove', handleMouseMove)
				document.removeEventListener('touchend', handleMouseUp)
				document.removeEventListener('mousemove', handleMouseMove)
				document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [isDragging, isTouchDevice, handleMouseMove, handleMouseUp])

	return { isDragging, handleMouseDown }
}
