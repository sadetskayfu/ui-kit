export const isValueSelected = (
	value: string,
	selectedValue: string | string[]
): boolean => {
	let isSelected: boolean

	if (Array.isArray(selectedValue)) {
		isSelected = Boolean(
			selectedValue.find((selectedValue) => selectedValue === value)
		)
	} else {
		isSelected = selectedValue === value
	}

	return isSelected
}
