import * as React from 'react'

export interface AlertRootContext {
    setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>
    setDescriptionId: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const AlertRootContext = React.createContext<AlertRootContext | undefined>(undefined)

export function useAlertRootContext() {
    const context = React.useContext(AlertRootContext)

    if (!context) {
        throw new Error('AlertRootContext is missing. Alert parts must be used within <Alert.Root>.')
    }

    return context
}