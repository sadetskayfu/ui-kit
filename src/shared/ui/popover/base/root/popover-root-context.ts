import * as React from 'react'
import { FloatingContext, ReferenceType } from "@floating-ui/react"

export interface PopoverRootContext {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    mounted: boolean
    titleId: string | undefined
    setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>
    descriptionId: string | undefined
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
    initialFocus: number | React.RefObject<HTMLElement | null> | undefined;
    returnFocus: boolean | React.RefObject<HTMLElement | null> | undefined;
    removeScroll: boolean
    setFloating: (node: HTMLElement | null) => void
    setReference: (node: ReferenceType | null) => void
    floatingContext: FloatingContext
    getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
    getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>
    closeElementRef: React.RefObject<HTMLElement | null>
    arrowRef: React.RefObject<HTMLElement | null>
    status: 'close' | 'open' | undefined
    modal: boolean
    closeOnFocusOut: boolean
    setArrowPadding: React.Dispatch<React.SetStateAction<number>>
    setShowArrow: React.Dispatch<React.SetStateAction<boolean>>
}

export const PopoverRootContext = React.createContext<PopoverRootContext | undefined>(undefined)

export function usePopoverRootContext() {
    const context = React.useContext(PopoverRootContext)

    if (!context) {
        throw new Error('PopoverRootContext is missing. Popover parts must be used within <Popover.Root>')
    }

    return context
}