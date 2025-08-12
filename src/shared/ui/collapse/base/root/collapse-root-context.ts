import * as React from 'react'

export interface CollapseRootContext {
    labelId: string | undefined
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
    panelId: string | undefined
    setPanelId: React.Dispatch<React.SetStateAction<string | undefined>>
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    panelRef: React.RefObject<HTMLDivElement | null>
    mounted: boolean
    open: boolean
    onTransitionEnd: (event: React.TransitionEvent) => void
}

export const CollapseRootContext = React.createContext<CollapseRootContext | undefined>(undefined)

export function useCollapseRootContext() {
    const context = React.useContext(CollapseRootContext)

    if (!context) {
        throw new Error('CollapseRootContext is missing. Collapse parts must be used within <Collapse.Root>')
    }

    return context
}
