import { useCallback, useEffect, useRef } from 'react'
import { Option } from '../ui/Autocomplete'
import { checkValue } from '@/shared/lib/formOptions'

type UseChangeValueInputValues = {
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

export const useChangeValue = (inputValues: UseChangeValueInputValues) => {
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
	} = inputValues

	const selectedOptionLabelRef = useRef<string>('')

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
				selectedOptionLabelRef.current = ''
			}
			
			onSelect(newSelectedValues)
			onChange('')
			onStopFilter()
		},
		[onSelect, onChange, onStopFilter] 
	)

	const handleSelectValue = useCallback(
		(optionValue: string) => {
			const selectedValue = selectedValueRef.current
			const value = valueRef.current
			
			const isSelected = checkValue(optionValue, selectedValue)

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

					const optionLabel = options[newSelectedValues].label
					selectedOptionLabelRef.current = optionLabel

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
			options
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
			onSelect('')
		}
	}, [value])

	return { handleSelectValue, handleDeleteValue, handleClick, selectedOptionLabelRef }
}
