import { useCallback, useEffect, useRef } from 'react'
import { Option } from '../ui/Autocomplete'
import { isValueSelected } from '@/shared/helpers/checkingValues'

type UseChangeValueArgs = {
	value: string
	valueRef: React.MutableRefObject<string>
	selectedValueRef: React.MutableRefObject<string | string[]>
	activeIndexRef: React.MutableRefObject<number>
	optionsRef: React.MutableRefObject<HTMLLIElement[]>
	options: Record<string, Option>
	isFilterOptionsRef: React.MutableRefObject<boolean>
	focusedClassName: string
	onChange: (value: string) => void
	onSelect: (value: string | string[]) => void
	onClose: () => void
	onStopFilter: () => void
	setFocusedOption: (index: number) => void
}

export const useChangeValue = (args: UseChangeValueArgs) => {
	const {
		value,
		valueRef,
		selectedValueRef,
		activeIndexRef,
		optionsRef,
		options,
		isFilterOptionsRef,
		focusedClassName,
		onChange,
		onSelect,
		onClose,
		onStopFilter,
		setFocusedOption,
	} = args

	const selectedOptionsRef = useRef<Record<string, string>>({})

	const handleDeleteValue = useCallback(
		(value: string) => {
			const selectedValue = selectedValueRef.current

			let newSelectedValues: string | string[]

			if (Array.isArray(selectedValue)) {
				newSelectedValues = selectedValue.filter(
					(selectedValue) => selectedValue !== value
				)
				
			} else {
				newSelectedValues = ''
			}

			delete selectedOptionsRef.current[value]
			
			onSelect(newSelectedValues)
			onChange('')
			onStopFilter()
		},
		[onSelect, onChange, onStopFilter, selectedValueRef] 
	)

	const handleSelectValue = useCallback(
		(optionValue: string) => {
			const selectedValue = selectedValueRef.current
			const value = valueRef.current
			
			const isSelected = isValueSelected(optionValue, selectedValue)

			if (isSelected) {
				if (value !== '' && isFilterOptionsRef.current) {
					setFocusedOption(-1)
				} else {
					setTimeout(() => {
						optionsRef.current[activeIndexRef.current].classList.add(focusedClassName)
					}, 0)
				}
				handleDeleteValue(optionValue)
			} else {
				const optionLabel = options[optionValue].label
				selectedOptionsRef.current[optionValue] = optionLabel

				let newSelectedValues: string | string[]

				if (Array.isArray(selectedValue)) {
					newSelectedValues = [...selectedValue, optionValue]

					if (value !== '') {
						setFocusedOption(-1)
					} else {
						setTimeout(() => {
							optionsRef.current[activeIndexRef.current].classList.add(
								focusedClassName
							)
						}, 0)
					}

					onChange('')
				} else {
					newSelectedValues = optionValue
					onClose()
					onChange(optionLabel)
				}
				onStopFilter()
				onSelect(newSelectedValues)
			}
		},
		[
			handleDeleteValue,
			onChange,
			onSelect,
			onClose,
			onStopFilter,
			setFocusedOption,
			focusedClassName,
			options,
			activeIndexRef,
			isFilterOptionsRef,
			optionsRef,
			selectedValueRef,
			valueRef
		]
	)

	const handleClick = useCallback(
		(event: React.MouseEvent) => {
			const option = (event.target as HTMLElement).closest(
				'li'
			) as HTMLLIElement | null

			if (!option) return

			const optionValue = option.getAttribute('data-value')

			if (optionValue) {
				handleSelectValue(optionValue)
			}
		},
		[handleSelectValue]
	)

	// Clear selected value if is single autocomplete and value === ''
	useEffect(() => {
		const selectedValue = selectedValueRef.current

		if (
			typeof selectedValue === 'string' &&
			selectedValue.length > 0 &&
			value === ''
		) {
			delete selectedOptionsRef.current[selectedValue]
			onSelect('')
		}
	}, [value])

	return { handleSelectValue, handleDeleteValue, handleClick, selectedOptionsRef }
}
