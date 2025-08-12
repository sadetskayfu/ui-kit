import * as React from 'react'

export interface FieldRootContext {
    labelId: string | undefined
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
    helperTextId: string | undefined
    setHelperTextId: React.Dispatch<React.SetStateAction<string | undefined>>
    focused: boolean;
    setFocused: React.Dispatch<React.SetStateAction<boolean>>
    errored: boolean;
    required: boolean;
    readOnly: boolean;
    disabled: boolean;
    controlElementRef: React.RefObject<HTMLElement | null>
}

export const FieldRootContext = React.createContext<FieldRootContext | undefined>(undefined)

export function useFieldRootContext() {
    const context = React.useContext(FieldRootContext)

    if (!context) {
        throw new Error('FieldRootContext is missing. Field parts must be used within <Field.Root>')
    }

    return context
}