import * as React from 'react'

export interface OutlinedFieldRootContext {
    label: string | number | undefined
    setLabel: React.Dispatch<React.SetStateAction<string | number | undefined>>
    required: boolean
    withLabel: boolean
    setWithLabel: React.Dispatch<React.SetStateAction<boolean>>
}

export const OutlinedFieldRootContext = React.createContext<OutlinedFieldRootContext | undefined>(undefined)

export function useOutlinedFieldRootContext() {
    const context = React.useContext(OutlinedFieldRootContext)

    if (!context) {
        throw new Error('OutlinedFieldRootContext is missing. Field parts must be used within <Field.Root>')
    }

    return context
}