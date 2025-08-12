import { ReferenceType } from "@floating-ui/react"

export type State = {
    multiple: boolean
    selectedValue: string | string[]
    activeIndex: number | null
    activeId: string | null
    open: boolean
    mounted: boolean
    status: 'open' | 'close' | undefined
    itemListId: string | undefined
    setFloating: (node: HTMLElement | null) => void
    setReference: (node: ReferenceType | null) => void
    getReferenceProps: (userProps?: React.HTMLProps<Element>) => Record<string, unknown>
    getItemProps: (userProps?: Omit<React.HTMLProps<HTMLElement>, "selected" | "active">) => Record<string, unknown>
    floatingStyles: React.CSSProperties
}

export const selectors = {
    multiple: (state: State) => state.multiple,
    selectedValue: (state: State) => state.selectedValue,
    activeIndex: (state: State) => state.activeIndex,
    activeId: (state: State) => state.activeId,
    mounted: (state: State) => state.mounted,
    open: (state: State) => state.open,
    status: (state: State) => state.status,
    itemListId: (state: State) => state.itemListId,
    setFloating: (state: State) => state.setFloating,
    setReference: (state: State) => state.setReference,
    getReferenceProps: (state: State) => state.getReferenceProps,
    getItemProps: (state: State) => state.getItemProps,
    floatingStyles: (state: State) => state.floatingStyles,

    isSelected: ((state: State, value: string) => {
        if (state.multiple) {
            return state.selectedValue.includes(value)
        }

        return state.selectedValue === value
    }),
    isActive: ((state: State, index: number) => {
        return state.activeIndex === index
    })
}