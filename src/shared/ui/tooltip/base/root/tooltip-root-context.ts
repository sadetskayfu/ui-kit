import * as React from 'react'
import { FloatingContext, ReferenceType } from "@floating-ui/react"

export interface TooltipRootContext {
    mounted: boolean
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setFloating: (node: HTMLElement | null) => void
    setReference: (node: ReferenceType | null) => void
    floatingContext: FloatingContext
    getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
    getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>
    arrowRef: React.RefObject<HTMLElement | null>
    setArrowPadding: React.Dispatch<React.SetStateAction<number>>
    setShowArrow: React.Dispatch<React.SetStateAction<boolean>>
    onTouchStart: React.TouchEventHandler
    onTouchEnd: React.TouchEventHandler
    interactive: boolean
    popupId: string | undefined
    setPopupId: React.Dispatch<React.SetStateAction<string | undefined>>
    describeChild: boolean
    status: 'open' | 'close' | undefined
    instantPhase: boolean
}

export const TooltipRootContext = React.createContext<TooltipRootContext | undefined>(undefined)

export function useTooltipRootContext() {
    const context = React.useContext(TooltipRootContext)

    if (!context) {
        throw new Error('TooltipRootContext is missing. Tooltip parts must be used within <Tooltip.Root>')
    }

    return context
}