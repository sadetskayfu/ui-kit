import { useCallback, useRef, useState } from "react"

export const useFocusOption = (optionsRef: React.MutableRefObject<HTMLLIElement[]>, focusedClassName: string) => {

        const [focusedOptionId, setFocusedOptionId ]= useState<string | undefined>('')
    
        const activeIndexRef = useRef<number>(-1)
        const lastFocusedOptionRef = useRef<HTMLLIElement | null>(null)
    
        const setFocusedOption = useCallback((index: number) => {
            if(index === activeIndexRef.current) return

            const lastFocusedOption = lastFocusedOptionRef.current
            const options = optionsRef.current
    
            if (lastFocusedOption) {
                lastFocusedOption.classList.remove(focusedClassName)
            }
    
            const nextOption = options[index]
    
            if(nextOption) {
                const optionId = nextOption.getAttribute('id')
    
                nextOption.classList.add(focusedClassName)
                
                lastFocusedOptionRef.current = nextOption
                activeIndexRef.current = index

                setFocusedOptionId(optionId!)
            } else {
                activeIndexRef.current = -1
                
                setFocusedOptionId(undefined)
            }
        }, [])

        return {focusedOptionId, setFocusedOption, activeIndexRef, focusedClassName}
}