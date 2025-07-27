import * as React from 'react'

export interface FormControlLabelContext {
    required?: boolean
    disabled?: boolean
    color?: 'soft' | 'hard'
    placement?: 'left' | 'top' | 'right' | 'bottom'
    labelId?: string
}

export const FormControlLabelContext = React.createContext<FormControlLabelContext | undefined>(undefined)

export function useFormControlLabelContext() {
    return React.useContext(FormControlLabelContext)
}