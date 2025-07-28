import * as React from 'react'

export interface RadioGroupContext {
    name: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    disabled: boolean
}

export const RadioGroupContext = React.createContext<RadioGroupContext | undefined>(undefined)

export function useRadioGroupContext() {
    return React.useContext(RadioGroupContext)
}