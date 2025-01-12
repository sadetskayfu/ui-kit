import { getNextEnabledIndex, setScroll } from '@/shared/lib/KeyboardNavigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getLastSelectedValue } from './getLastSelectedValue'
import throttle from 'lodash/throttle'

type UseKeyboardNavigationInputValues = {
	optionsRef: React.MutableRefObject<HTMLLIElement[]>
	optionsListRef: React.MutableRefObject<HTMLUListElement | null>
	selectedValueRef: React.MutableRefObject<string | string[]>
	focusedClassName: string  
	isOpen: boolean
	isOpenRef: React.MutableRefObject<boolean>
	onOpen: () => void
	onClose: () => void
	onToggle: () => void
	onSelect: (value: string) => void
	onDelete: (value: string) => void
}

export const useKeyboardNavigation = (
	inputValues: UseKeyboardNavigationInputValues
) => {
	const { optionsRef, optionsListRef, focusedClassName, selectedValueRef, isOpen, isOpenRef, onOpen, onClose, onToggle, onSelect, onDelete } = inputValues

	const [focusedOptionId, setFocusedOptionId ]= useState<string>('')

	const activeIndexRef = useRef<number>(-1)
	const lastFocusedOptionRef = useRef<HTMLLIElement | null>(null)

	const setFocusedOption = useCallback((index: number) => {
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

			setFocusedOptionId(optionId!)
		}

		activeIndexRef.current = index
	}, [])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			const currentIndex = activeIndexRef.current
			const options = optionsRef.current
			const optionsList = optionsListRef.current
			const isOpen = isOpenRef.current

			let nextIndex = currentIndex

			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowDown':
					event.preventDefault()
					isOpen ? nextIndex = getNextEnabledIndex(options, currentIndex, 1) : onOpen()
					break
				case 'ArrowLeft':
				case 'ArrowUp':
					event.preventDefault()
					isOpen ? nextIndex = getNextEnabledIndex(options, currentIndex, -1) : onOpen()
					break
				case 'Enter':
				case ' ':
					event.preventDefault()
					isOpen && nextIndex !== -1 ? onSelect(options[nextIndex].getAttribute('data-value')!) : onToggle()
					break
				case 'Backspace':
					event.preventDefault()
					const selectedValue = selectedValueRef.current

					if(Array.isArray(selectedValue) && selectedValue.length > 0) {
						const lastSelectedValue = getLastSelectedValue(selectedValue)
						onDelete(lastSelectedValue)
					}
					break
				case 'Escape':
					event.preventDefault()
					isOpen && onClose()
					break
				case 'Tab':
					isOpen && onClose()
					break
				default:
					break
			}

			if (nextIndex !== currentIndex) {
				setFocusedOption(nextIndex)
				
				if(optionsList) {
					setScroll(options[nextIndex], optionsList)
				}
			}
		},
		[setFocusedOption, onSelect, onDelete, onOpen, onClose, onToggle]
	)

	const handleChangeIndex = useCallback(
		(index: number) => {
			const currentIndex = activeIndexRef.current
			
			if (index !== currentIndex) {
				setFocusedOption(index)
			}
		},
		[setFocusedOption]
	)

	const throttleHandleChangeIndex = useCallback(throttle(handleChangeIndex, 10), [handleChangeIndex])

	useEffect(() => {
		return () => {
			throttleHandleChangeIndex.cancel()
		}
	}, [throttleHandleChangeIndex])

	// Set focused option after open menu
	useEffect(() => {
		const selectedValue = selectedValueRef.current

		if(isOpen && selectedValue.length > 0) {
			const lastSelectedValue = getLastSelectedValue(selectedValue)
			const options = optionsRef.current
			const optionsList = optionsListRef.current

			const lastSelectedOption = options.find((option) => {
				const optionValue = option.getAttribute('data-value')

				return optionValue === lastSelectedValue
			})
			
			if(lastSelectedOption) {
				const optionIndex = Number(lastSelectedOption.getAttribute('data-index'))

				handleChangeIndex(Number(optionIndex))
				
				if(optionsList) {
					setScroll(lastSelectedOption, optionsList)
				}
			} 
		}
	}, [isOpen])

	return { handleKeyDown, throttleHandleChangeIndex, focusedOptionId }
}
