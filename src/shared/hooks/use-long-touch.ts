import { useCallback, useEffect, useRef } from "react"

type UseLongTouchProps = {
    onTouchStart: React.TouchEventHandler<HTMLElement>
    onTouchEnd?: React.TouchEventHandler<HTMLElement>
    timeToStart?: number
    timeToEnd?: number
    enabled?: boolean
}

export function useLongTouch(props: UseLongTouchProps) {
    const { onTouchStart, onTouchEnd, timeToStart = 500, timeToEnd = 2000, enabled = true } = props

	const startTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
	const endTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

    const handleTouchStart = useCallback((event: React.TouchEvent<HTMLElement>) => {
        if(!enabled) return

        if(endTimeoutIdRef.current) {
            clearTimeout(endTimeoutIdRef.current)
        }
        startTimeoutIdRef.current = setTimeout(() => {
            onTouchStart(event)
        }, timeToStart)
    }, [onTouchStart, timeToStart, enabled])

    const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLElement>) => {
        if(!enabled) return

        if (startTimeoutIdRef.current) {
            clearTimeout(startTimeoutIdRef.current)
        }
        if (onTouchEnd) {
            endTimeoutIdRef.current = setTimeout(() => {
                onTouchEnd(event)
            }, timeToEnd)
        }
    }, [onTouchEnd, timeToEnd, enabled])

    useEffect(() => {
		return () => {
			if (startTimeoutIdRef.current) {
				clearTimeout(startTimeoutIdRef.current)
			}
			if (endTimeoutIdRef.current) {
				clearTimeout(endTimeoutIdRef.current)
			}
		}
	}, [])

    return { handleTouchStart, handleTouchEnd }
}