import * as React from 'react'

export interface SelectItemContext {
    selected: boolean
}

export const SelectItemContext = React.createContext<SelectItemContext | undefined>(undefined)

export function useSelectItemContext() {
    const context = React.useContext(SelectItemContext)

    if (!context) {
        throw new Error('SelectItemContext is missing. <Select.ItemIndicator> must be used within <Select.Item>')
    }

    return context
}