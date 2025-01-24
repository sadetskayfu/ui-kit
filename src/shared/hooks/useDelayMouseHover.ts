import { useEffect, useRef } from 'react'

type EventType = any

type UseDelayHoverArgs = {
	onMouseEnter: (event: EventType) => void
	onMouseLeave: (event: EventType) => void
	delay?: number
}

export const useDelayMouseHover = (args: UseDelayHoverArgs) => {
	const { onMouseEnter, onMouseLeave, delay = 200 } = args

	const mouseEnterTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
	const mouseLeaveTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

	const handleMouseEnterDelay = (event: EventType) => {
		if (delay > 0) {
			if (mouseLeaveTimeoutIdRef.current) {
				clearTimeout(mouseLeaveTimeoutIdRef.current)
			}
			mouseEnterTimeoutIdRef.current = setTimeout(() => {
				onMouseEnter(event)
			}, delay)
		} else {
			onMouseEnter(event)
		}
	}

	const handleMouseLeaveDelay = (event: EventType) => {
		if (delay > 0) {
			if (mouseEnterTimeoutIdRef.current) {
				clearTimeout(mouseEnterTimeoutIdRef.current)
			}
			mouseLeaveTimeoutIdRef.current = setTimeout(() => {
				onMouseLeave(event)
			}, delay)
		} else {
			onMouseLeave(event)
		}
	}

    useEffect(() => {
        return () => {
            if (mouseEnterTimeoutIdRef.current) {
				clearTimeout(mouseEnterTimeoutIdRef.current)
			}
            if (mouseLeaveTimeoutIdRef.current) {
				clearTimeout(mouseLeaveTimeoutIdRef.current)
			}
        }
    }, [])

	return { handleMouseEnterDelay, handleMouseLeaveDelay }
}
