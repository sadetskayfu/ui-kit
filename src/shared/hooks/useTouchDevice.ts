import { useEffect, useRef, useState } from 'react'

export const useTouchDevice = () => {
	const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false)
	const isTouchDeviceRef = useRef<boolean>(false)

	useEffect(() => {
		if ('ontouchstart' in window) {
			isTouchDeviceRef.current = true
			setIsTouchDevice(true)
		} else {
			isTouchDeviceRef.current = false
			setIsTouchDevice(false)
		}
	}, [])

	return { isTouchDevice, isTouchDeviceRef }
}
