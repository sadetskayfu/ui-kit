export function getLastSelectedOption(options: HTMLLIElement[], lastSelectedValue: string) {
	const option = options.find(option => option.getAttribute('data-value') === lastSelectedValue);

	const dirtyOptionIndex = option?.getAttribute('data-index');
	const optionIndex = dirtyOptionIndex ? Number(dirtyOptionIndex) : -1;

	return { option, optionIndex };
}
