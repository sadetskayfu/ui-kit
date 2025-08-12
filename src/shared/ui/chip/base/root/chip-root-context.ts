import * as React from 'react'

export interface ChipRootContext {
    disabled: boolean
    onClose: undefined | ((event: Event) => void)
}

export const ChipRootContext = React.createContext<ChipRootContext | undefined>(undefined)

export function useChipRootContext() {
    const context = React.useContext(ChipRootContext)

    if (!context) {
        throw new Error('ChipRootContext is missing. Chip parts must be used within <Chip.Root>')
    }

    return context
}