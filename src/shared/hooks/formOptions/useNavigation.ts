import { getNextEnabledIndex, setScroll } from '@/shared/lib/KeyboardNavigation'
import { useCallback, useEffect } from 'react'
import {
	getLastSelectedOption,
	getLastSelectedValue,
} from '@/shared/lib/formOptions'
import throttle from 'lodash/throttle'

type UseNavigationInputValues = {
	optionsRef: React.MutableRefObject<HTMLLIElement[]>
	optionsListRef: React.MutableRefObject<HTMLUListElement | null>
	valueRef?: React.MutableRefObject<string>
	selectedValueRef: React.MutableRefObject<string | string[]>
	isOpen: boolean
	isOpenRef: React.MutableRefObject<boolean>
	activeIndexRef: React.MutableRefObject<number>
	setFocusedOption: (index: number) => void
	onOpen: () => void
	onClose: () => void
	onToggle: () => void
	onSelect: (value: string) => void
	onDelete: (value: string) => void
}

export const useNavigation = (inputValues: UseNavigationInputValues) => {
	const {
		optionsRef,
		optionsListRef,
		valueRef,
		selectedValueRef,
		isOpen,
		isOpenRef,
		activeIndexRef,
		setFocusedOption,
		onOpen,
		onClose,
		onToggle,
		onSelect,
		onDelete,
	} = inputValues

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
						const lastSelectedValue = getLastSelectedValue(selectedValue)
						onDelete(lastSelectedValue)
					}
					break
				case 'Escape':
					event.preventDefault()
					isOpen && onClose()
					break
				default:
					break
			}

			if (nextIndex !== currentIndex) {
				setFocusedOption(nextIndex)

				if (optionsList) {
					setScroll(options[nextIndex], optionsList)
				}
			}
		},
		[setFocusedOption, onSelect, onDelete, onOpen, onClose, onToggle]
	)

	const handleMouseMove = useCallback(
		throttle((event: React.MouseEvent) => {
			const option = (event.target as HTMLElement).closest(
				'li'
			) as HTMLLIElement | null

			if (!option) return

			const optionIndex = option.getAttribute('data-index')

			if (optionIndex) {
				setFocusedOption(Number(optionIndex))
			}
		}, 10),
		[setFocusedOption]
	)

	useEffect(() => {
		return () => {
			handleMouseMove.cancel()
		}
	}, [handleMouseMove])

	// Set focused option after open menu
	useEffect(() => {
		const selectedValue = selectedValueRef.current

		if (isOpen && selectedValue.length > 0) {
			const lastSelectedValue = getLastSelectedValue(selectedValue)
			const options = optionsRef.current
			const optionsList = optionsListRef.current

			const { lastSelectedOption, lastSelectedOptionIndex } =
				getLastSelectedOption(lastSelectedValue, options)

			if (lastSelectedOption && lastSelectedOptionIndex) {
				setFocusedOption(Number(lastSelectedOptionIndex))

				if (optionsList) {
					setScroll(lastSelectedOption, optionsList)
				}
			}
		}
	}, [isOpen])

	return { handleKeyDown, handleMouseMove }
}
