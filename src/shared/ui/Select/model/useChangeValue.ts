import { useCallback } from 'react'
import { checkValue } from './checkValue'

type UseChangeValueInputValues = {
	selectedValueRef: React.MutableRefObject<string | string[]>
	onChange: (value: string | string[]) => void
}

export const useChangeValue = (inputValues: UseChangeValueInputValues) => {
	const { selectedValueRef, onChange } = inputValues

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
				handleDeleteValue(value)
			} else {
				let newSelectedValues: string | string[]

				if (Array.isArray(selectedValue)) {
					newSelectedValues = [...(selectedValue as string[]), value]
				} else {
					newSelectedValues = value
				}

				onChange(newSelectedValues)
			}
		},
		[handleDeleteValue, onChange]
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
