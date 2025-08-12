import * as React from 'react'
import { Store } from "@/shared/lib/store";
import { State } from "../store";
import { Placement } from '@floating-ui/react';

export interface SelectRootContext {
    store: Store<State>
    placement: Placement | undefined
    multiple: boolean
    minValueLength: number
    valuesRef: React.RefObject<string[]>
    labelsRef: React.RefObject<(string | null)[]>
    labelId: string | undefined
    setLabelId: React.Dispatch<React.SetStateAction<string | undefined>>
    onChange: (value: string | string[]) => void
    onSelect: (value: string) => void
    onDelete: (value: string) => void
    onClose: () => void
    onOpen: () => void
    isRegisteredItems: boolean
    setIsRegisteredItems: React.Dispatch<React.SetStateAction<boolean>>
    removeScroll: boolean
    disabled: boolean
    readOnly: boolean
    required: boolean
}

export const SelectRootContext = React.createContext<SelectRootContext | undefined>(undefined)

export function useSelectRootContext() {
    const context = React.useContext(SelectRootContext)

    if (!context) {
        throw new Error('SelectRootContext is missing. Select parts must be used within <Select.Root>')
    }

    return context
}