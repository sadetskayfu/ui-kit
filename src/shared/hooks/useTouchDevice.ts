import { useEffect, useRef } from "react"

export const useTouchDevice = () => {
    const isTouchDeviceRef = useRef<boolean>(false)

	useEffect(() => {
		if ('ontouchstart' in window) {
			isTouchDeviceRef.current = true
		} else {
			isTouchDeviceRef.current = false
		}
	}, [])

    return isTouchDeviceRef
}