import * as React from 'react'
import { FloatingContext, ReferenceType } from "@floating-ui/react"

export interface DrawerRootContext {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    mounted: boolean
    modal: boolean
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
    status: 'close' | 'open' | undefined
    closeOnFocusOut: boolean
    position: 'top' | 'right' | 'bottom' | 'left'
    snapPoints: (number | string)[]
    initialSnapPointIndex: number
}

export const DrawerRootContext = React.createContext<DrawerRootContext | undefined>(undefined)

export function useDrawerRootContext() {
    const context = React.useContext(DrawerRootContext)

    if (!context) {
        throw new Error('DrawerRootContext is missing. Drawer parts must be used within <Drawer.Root>')
    }

    return context
}