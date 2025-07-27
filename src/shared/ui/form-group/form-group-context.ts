import * as React from 'react'

export interface FormGroupContext {
    value: string[]
    onChange: React.ChangeEventHandler<HTMLInputElement>
    disabled: boolean
    readOnly: boolean
}

export const FormGroupContext = React.createContext<FormGroupContext | undefined>(undefined)

export function useFormGroupContext() {
    return React.useContext(FormGroupContext)
}