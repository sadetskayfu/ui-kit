import * as React from 'react'

export interface SelectRootContext {
    scrollAreaRootRef: React.RefObject<HTMLDivElement | null>
}

export const SelectRootContext = React.createContext<SelectRootContext | undefined>(undefined)

export function useSelectRootContext() {
    const context = React.useContext(SelectRootContext)

    if (!context) {
        throw new Error('SelectRootContext is missing. Select parts must be used within <Select.Root>.')
    }

    return context
}