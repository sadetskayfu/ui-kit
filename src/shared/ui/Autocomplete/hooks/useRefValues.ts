import { useEffect, useRef } from "react"

type UseRefValuesArgs = {
    value: string
    selectedValue: string | string[]
    isOpen: boolean
    isMountedMenu: boolean
    isFilterOptions: boolean
}

export const useRefValues = (args: UseRefValuesArgs) => {
    const {value, selectedValue, isOpen, isMountedMenu, isFilterOptions} = args

    const valueRef = useRef<string>(value)
    const selectedValueRef = useRef<string | string[]>(selectedValue)
    const isOpenRef = useRef<boolean>(isOpen)
    const isMountedMenuRef = useRef<boolean>(isOpen)
    const isFilterOptionsRef = useRef<boolean>(isOpen)


    useEffect(() => {
        valueRef.current = value
    }, [value])

    useEffect(() => {
        selectedValueRef.current = selectedValue
    }, [selectedValue])

    useEffect(() => {
        isOpenRef.current = isOpen
    }, [isOpen])

    useEffect(() => {
        isMountedMenuRef.current = isMountedMenu
    }, [isMountedMenu])

    useEffect(() => {
        isFilterOptionsRef.current = isFilterOptions
    }, [isFilterOptions])

    return {valueRef, selectedValueRef, isOpenRef, isMountedMenuRef, isFilterOptionsRef}
}