import { useCallback, useRef, useState } from 'react'

export const useAnimation = (duration: number = 500) => {
	const [isAnimating, setIsAnimating] = useState<boolean>(false)
	const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

	const startAnimation = useCallback(() => {
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current)
		}
		if(isAnimating) {
			setIsAnimating(false)
		}

		timeoutIdRef.current = setTimeout(() => {
			setIsAnimating(true)
			
			timeoutIdRef.current = setTimeout(() => {
				setIsAnimating(false)
			}, duration)
		}, 0)
	}, [duration, isAnimating])

	return { isAnimating, startAnimation }
}
