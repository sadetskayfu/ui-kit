import * as React from 'react'

export interface AvatarVariantContext {
    /**
     * @default undefined
     */
    size?: 's'
    width?: number
    height?: number
}

export const AvatarVariantContext = React.createContext<AvatarVariantContext | undefined>(undefined)

export function useAvatarVariantContext() {
    return React.useContext(AvatarVariantContext)
}