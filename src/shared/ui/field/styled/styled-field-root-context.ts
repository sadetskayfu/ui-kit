import * as React from 'react'

export interface StyledFieldRootContext {
    setWithActions: React.Dispatch<React.SetStateAction<boolean>>
    setWithStartAdornment: React.Dispatch<React.SetStateAction<boolean>>
}

export const StyledFieldRootContext = React.createContext<StyledFieldRootContext | undefined>(undefined)

export function useStyledFieldRootContext() {
    const context = React.useContext(StyledFieldRootContext)

    if (!context) {
        throw new Error('StyledFieldRootContext is missing. Field parts must be used within <Field.Root>')
    }

    return context
}