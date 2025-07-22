import React from "react";

export interface TabsListContext {
    activeIndex: number
    setActiveIndex: (index: number) => void
    tabListRef: React.RefObject<HTMLElement | null>
}

export const TabsListContext = React.createContext<TabsListContext | undefined>(undefined)

export function useTabsListContext() {
    const context = React.useContext(TabsListContext)

    if(!context) {
        throw new Error('TabsListContext is missing. Tabs parts must be placed within <Tabs.List>')
    }

    return context
}