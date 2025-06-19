import { createContext } from "react"

type AccordionGroupContextType = {
    onClose: () => void
} | null

export const AccordionGroupContext = createContext<AccordionGroupContextType>(null)