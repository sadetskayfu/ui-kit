export function isValueSelected(optionValue: string, selectedValue: string | string[]) {
	if (Array.isArray(selectedValue)) {
		return Boolean(selectedValue.find(value => value === optionValue));
	} else {
		return optionValue === selectedValue;
	}
}
