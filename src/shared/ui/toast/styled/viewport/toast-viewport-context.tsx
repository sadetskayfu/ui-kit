import * as React from 'react'

export interface ToastViewportContext {
    position: 'bottom-right' | 'top-center'
}

export const ToastViewportContext = React.createContext<ToastViewportContext>({ position: 'bottom-right' })

export function useToastViewportContext() {
    const context = React.useContext(ToastViewportContext)

    if(!context) {
        throw new Error('ToastViewportContext is missing. Toast.Toast must be used within <Toast.Viewport>.')
    }

    return context
}