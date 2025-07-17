import { createContext } from 'react'

type ContextType = {
    getItemProps: (
        userProps?: React.HTMLProps<HTMLElement>
    ) => Record<string, unknown>
    activeIndex: number | null 
}

export const MenuContext = createContext<ContextType>({
    getItemProps: () => ({}),
    activeIndex: null,
})