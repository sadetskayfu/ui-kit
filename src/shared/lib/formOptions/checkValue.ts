export const checkValue = (
	value: string,
	selectedValue: string | string[]
): boolean => {
	let isSelected: boolean

	if (Array.isArray(selectedValue)) {
		isSelected =
			selectedValue.filter((selectedValue) => selectedValue === value).length > 0
	} else {
		isSelected = selectedValue === value
	}

	return isSelected
}
