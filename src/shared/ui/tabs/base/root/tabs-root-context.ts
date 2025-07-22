import * as React from "react";
import type { TabsRoot } from "./tabs-root";
import { CompositeMetadata } from "@/shared/ui/composite";
import { TabsTab } from "../tab/tabs-tab";

export interface TabsRootContext {
    selectedValue: TabsRoot.Value
    onChange: (value: TabsRoot.Value, event?: Event) => void
    getTabElementBySelectedValue: (selectedValue: TabsRoot.Value) => HTMLElement | null
    getTabIdByPanelValueOrIndex: (panelValue: TabsRoot.Value | undefined, index: number) => string | undefined
    getPanelIdByTabValueOrIndex: (tabValue: TabsRoot.Value | undefined, index: number) => string | undefined
    setTabMap: (newMap: Map<Element, CompositeMetadata<TabsTab.Metadata> | null>) => void
    orientation: TabsRoot.Orientation
    activateOnFocus: boolean
    loop: boolean
}

export const TabsRootContext = React.createContext<TabsRootContext | undefined>(undefined)

export function useTabsRootContext() {
    const context = React.useContext(TabsRootContext)

    if(!context) {
        throw new Error('TabsRootContext is missing. Tabs parts must be placed within <Tabs.Root>')
    }

    return context
}