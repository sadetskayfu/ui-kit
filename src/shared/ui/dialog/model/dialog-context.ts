import { createContext } from 'react'
import { type useDialog } from './use-dialog'

type ContextType = ReturnType<typeof useDialog> | null

export const DialogContext = createContext<ContextType>(null)