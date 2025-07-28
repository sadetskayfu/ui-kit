import * as React from 'react'

export interface ToggleGroupContext {
    value: string | string[]
    onChange: (value: string, event: React.MouseEvent) => void
    disabled: boolean
}

export const ToggleGroupContext = React.createContext<ToggleGroupContext | undefined>(undefined)

export function useToggleGroupContext() {
    return React.useContext(ToggleGroupContext)
}