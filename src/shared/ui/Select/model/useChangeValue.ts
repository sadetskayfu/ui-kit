import { checkValue } from '@/shared/lib/formOptions'
import { useCallback } from 'react'

type UseChangeValueInputValues = {
	selectedValueRef: React.MutableRefObject<string | string[]>
	activeIndexRef: React.MutableRefObject<number>
	optionsRef: React.MutableRefObject<HTMLLIElement[]>
	focusedClassName: string
	onChange: (value: string | string[]) => void
	onClose: () => void
}

export const useChangeValue = (inputValues: UseChangeValueInputValues) => {
	const { selectedValueRef, activeIndexRef, optionsRef, focusedClassName, onChange, onClose } = inputValues

	const handleDeleteValue = useCallback((value: string) => {
		const selectedValue = selectedValueRef.current

		let newSelectedValues: string | string[]

		if (Array.isArray(selectedValue)) {
			newSelectedValues = selectedValue.filter(
				(selectedValue) => selectedValue !== value
			)
		} else {
			newSelectedValues = ''
		}

		onChange(newSelectedValues)
	}, [onChange])

	const handleSelectValue = useCallback(
		(value: string) => {
			const selectedValue = selectedValueRef.current

			const isSelected = checkValue(value, selectedValue)

			if (isSelected) {
				setTimeout(() => {
					optionsRef.current[activeIndexRef.current].classList.add(focusedClassName)
				}, 0)
				handleDeleteValue(value)
			} else {
				let newSelectedValues: string | string[]

				if (Array.isArray(selectedValue)) {
					newSelectedValues = [...selectedValue, value]

					setTimeout(() => {
						optionsRef.current[activeIndexRef.current].classList.add(
							focusedClassName
						)
					}, 0)
				} else {
					newSelectedValues = value
					onClose()
				}

				onChange(newSelectedValues)
			}
		},
		[handleDeleteValue, onChange, onClose, focusedClassName]
	)

    const handleClick = useCallback((event: React.MouseEvent) => {
        const option = (event.target as HTMLElement).closest('li') as HTMLLIElement | null;
		
        if (!option) return;
		
        const optionValue = option.getAttribute('data-value');

        if(optionValue) {
			handleSelectValue(optionValue)
		}

    }, [handleSelectValue])

	return { handleSelectValue, handleDeleteValue, handleClick }
}
