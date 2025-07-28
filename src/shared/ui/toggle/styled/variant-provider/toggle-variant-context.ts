import * as React from 'react'

export interface ToggleVariantContext {
    /**
     * @default 'm'
     */
    size?: 'xs' | 's' | 'm' | 'l';
        /**
     * @default 'primary'
     */
    color?: 'primary' | 'secondary'
}

export const ToggleVariantContext = React.createContext<ToggleVariantContext | undefined>(undefined)

export function useToggleVariantContext() {
    return React.useContext(ToggleVariantContext)
}