import * as React from 'react'
import { FloatingContext, ReferenceType } from "@floating-ui/react"

export interface AsideMenuRootContext {
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
}

export const AsideMenuRootContext = React.createContext<AsideMenuRootContext | undefined>(undefined)

export function useAsideMenuRootContext() {
    const context = React.useContext(AsideMenuRootContext)

    if (!context) {
        throw new Error('AsideMenuRootContext is missing. AsideMenu parts must be used within <AsideMenu.Root>')
    }

    return context
}