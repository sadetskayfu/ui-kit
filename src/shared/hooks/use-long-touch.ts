import * as React from "react"
import { useTimeout } from "./use-timeout"
import { useEventCallback } from "./use-event-callback"

type UseLongTouchParams = {
    callback: React.TouchEventHandler<HTMLElement>
    /**
     * @default 500
     */
    touchTime?: number
    enabled?: boolean
}

export function useLongTouch(params: UseLongTouchParams) {
    const { callback, touchTime = 500, enabled = true } = params

    const timeout = useTimeout()

    const handleTouchStart = useEventCallback(() => {
        if(!enabled) return

        timeout.start(touchTime, callback)
    })

    const handleTouchEnd = useEventCallback(() => {
        if(!enabled) return

        timeout.clear()
    })

    return { onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd }
}