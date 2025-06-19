import { useLayoutEffect, useRef, useState } from "react"

export function useTouchDevice() {
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const isTouchDeviceRef = useRef(false)

    useLayoutEffect(() => {
        if(window.matchMedia('(pointer: coarse)').matches){
            isTouchDeviceRef.current = true
            setIsTouchDevice(true)
        }
    }, [])

    return { isTouchDevice, isTouchDeviceRef }
}

