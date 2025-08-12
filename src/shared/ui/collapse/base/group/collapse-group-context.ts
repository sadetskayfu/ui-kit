import * as React from 'react'

export interface CollapseGroupContext {
    value: string | string[] | null
    onChange: (value: string) => void
    closeAll: () => void
}

export const CollapseGroupContext = React.createContext<CollapseGroupContext | undefined>(undefined)

export function useCollapseGroupContext() {
    const context = React.useContext(CollapseGroupContext)

    if (!context) {
        throw new Error('CollapseGroupContext is missing. <Collapse.Root> must be used within <Collapse.Group>')
    }

    return context
}