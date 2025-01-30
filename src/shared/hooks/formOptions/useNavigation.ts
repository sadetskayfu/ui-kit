import { getNextEnabledIndex, scrollToItem } from '@/shared/lib/KeyboardNavigation'
import { useCallback, useEffect } from 'react'
import {
	getLastSelectedOption,
	getLastSelectedValue,
} from '@/shared/helpers/formOptions'
import throttle from 'lodash/throttle'

type UseNavigationArgs = {
	optionsRef: React.MutableRefObject<HTMLLIElement[]>
	optionsListRef: React.RefObject<HTMLUListElement>
	valueRef?: React.MutableRefObject<string>
	selectedValueRef: React.MutableRefObject<string | string[]>
	isOpen: boolean
	isLoading?: boolean
	isOpenRef: React.MutableRefObject<boolean>
	activeIndexRef: React.MutableRefObject<number>
	setFocusedOption: (index: number) => void
	onOpen: () => void
	onClose: () => void
	onToggle: () => void
	onSelect: (value: string) => void
	onDelete: (value: string) => void
}

export const useNavigation = (args: UseNavigationArgs) => {
	const {
		optionsRef,
		optionsListRef,
		valueRef,
		selectedValueRef,
		isOpen,
		isLoading,
		isOpenRef,
		activeIndexRef,
		setFocusedOption,
		onOpen,
		onClose,
		onToggle,
		onSelect,
		onDelete,
	} = args

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			const currentIndex = activeIndexRef.current
			const options = optionsRef.current
			const optionsList = optionsListRef.current
			const isOpen = isOpenRef.current

			let nextIndex = currentIndex

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault()
					isOpen
						? (nextIndex = getNextEnabledIndex(options, currentIndex, 1))
						: onOpen()
					break
				case 'ArrowUp':
					event.preventDefault()
					isOpen
						? (nextIndex = getNextEnabledIndex(options, currentIndex, -1))
						: onOpen()
					break
				case 'Enter':
                case ' ':
                    if(event.key === ' ' && valueRef) break

					event.preventDefault()

					isOpen && nextIndex !== -1
						? onSelect(options[nextIndex].getAttribute('data-value')!) : onToggle()
					break
				case 'Backspace':
					const selectedValue = selectedValueRef.current

					if (valueRef && valueRef.current !== '') break

					if (Array.isArray(selectedValue) && selectedValue.length > 0) {
						event.preventDefault()
						
						const lastSelectedValue = getLastSelectedValue(selectedValue)
						onDelete(lastSelectedValue)
					}
					break
				case 'Escape':
					event.preventDefault()
					if(isOpen) {
						onClose()
					}
					break
				default:
					break
			}

			if (nextIndex !== currentIndex) {
				setFocusedOption(nextIndex)

				if (optionsList) {
					scrollToItem(options[nextIndex], optionsList)
				}
			}
		},
		[setFocusedOption, onSelect, onDelete, onOpen, onClose, onToggle, valueRef, selectedValueRef, isOpenRef, activeIndexRef]
	)

	const handleMouseMove = useCallback(
		throttle((event: React.MouseEvent) => {
			const option = (event.target as HTMLElement).closest(
				'li'
			) as HTMLLIElement | null

			if (!option) return

			const optionIndex = Number(option.getAttribute('data-index'))
			const currentIndex = activeIndexRef.current

			if (optionIndex !== currentIndex) {
				setFocusedOption(Number(optionIndex))
			}
		}, 10),
		[setFocusedOption, activeIndexRef]
	)

	useEffect(() => {
		return () => {
			handleMouseMove.cancel()
		}
	}, [handleMouseMove])

	// Set focused option after open menu
	useEffect(() => {
		const selectedValue = selectedValueRef.current

		if (isOpen && !isLoading && selectedValue.length > 0) {
			const lastSelectedValue = getLastSelectedValue(selectedValue)
			const options = optionsRef.current
			const optionsList = optionsListRef.current
			
			const { lastSelectedOption, lastSelectedOptionIndex } =
				getLastSelectedOption(lastSelectedValue, options)

			if (lastSelectedOption && lastSelectedOptionIndex) {
				setFocusedOption(Number(lastSelectedOptionIndex))
		
				if (optionsList) {
					scrollToItem(lastSelectedOption, optionsList)
				}
			}
		}
	}, [isOpen, isLoading])

	return { handleKeyDown, handleMouseMove }
}
