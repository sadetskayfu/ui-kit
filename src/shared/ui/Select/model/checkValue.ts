export const checkValue = (
	value: string,
	selectedValues: string | string[]
): boolean => {
	let isSelected: boolean

	if (Array.isArray(selectedValues)) {
		isSelected =
			selectedValues.filter((selectedValue) => selectedValue === value).length > 0
	} else {
		isSelected = selectedValues === value
	}

	return isSelected
}
