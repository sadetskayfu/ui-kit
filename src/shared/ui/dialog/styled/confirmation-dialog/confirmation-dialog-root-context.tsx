import * as React from 'react'

export interface ConfirmationDialogRootContext {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    onConfirm?: (event: React.MouseEvent) => void
}

export const ConfirmationDialogRootContext = React.createContext<ConfirmationDialogRootContext | undefined>(undefined)

export function useConfirmationDialogRootContext() {
    const context = React.useContext(ConfirmationDialogRootContext)

    if (!context) {
        throw new Error('ConfirmationDialogRootContext is missing. ConfirmationDialog parts must be used within <ConfirmationDialog.Root />')
    }

    return context
}