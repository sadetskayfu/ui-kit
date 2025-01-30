import { useEffect, useRef } from 'react'

type EventType = React.TouchEvent<HTMLElement>

type UseLongTouchArgs = {
	onTouchStart: (event: EventType) => void
	onTouchEnd?: (event: EventType) => void
	touchTime?: number
	delayOnTouchEnd?: number
}

export const useLongTouch = (args: UseLongTouchArgs) => {
	const {
		onTouchStart,
		onTouchEnd,
		touchTime = 500,
		delayOnTouchEnd = 2000,
	} = args

	const startTouchTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)
	const delayOnTouchEndTimeoutIdRef = useRef<NodeJS.Timeout | null>(null)

	const handleTouchStart = (event: EventType) => {
		if (delayOnTouchEndTimeoutIdRef.current) {
			clearTimeout(delayOnTouchEndTimeoutIdRef.current)
		}
		startTouchTimeoutIdRef.current = setTimeout(() => {
			onTouchStart(event)
		}, touchTime)
	}

	const handleTouchEnd = (event: EventType) => {
		
		if (startTouchTimeoutIdRef.current) {
			clearTimeout(startTouchTimeoutIdRef.current)
		}
		if (onTouchEnd) {
			delayOnTouchEndTimeoutIdRef.current = setTimeout(() => {
				onTouchEnd(event)
			}, delayOnTouchEnd)
		}
	}

	useEffect(() => {
		return () => {
			if (startTouchTimeoutIdRef.current) {
				clearTimeout(startTouchTimeoutIdRef.current)
			}
			if (delayOnTouchEndTimeoutIdRef.current) {
				clearTimeout(delayOnTouchEndTimeoutIdRef.current)
			}
		}
	}, [])

	return { handleTouchStart, handleTouchEnd }
}
