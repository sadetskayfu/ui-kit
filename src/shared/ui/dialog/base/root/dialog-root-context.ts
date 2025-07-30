import * as React from 'react'
import { FloatingContext, ReferenceType } from "@floating-ui/react"

export interface DialogRootContext {
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
    status: 'close' | 'open' | undefined
}

export const DialogRootContext = React.createContext<DialogRootContext | undefined>(undefined)

export function useDialogRootContext() {
    const context = React.useContext(DialogRootContext)

    if (!context) {
        throw new Error('DialogRootContext is missing. Dialog parts must be used within <Dialog.Root>')
    }

    return context
}