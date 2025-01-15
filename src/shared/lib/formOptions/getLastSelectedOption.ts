export const getLastSelectedOption = (
	lastSelectedValue: string,
	options: HTMLLIElement[]
) => {
	const lastSelectedOption = options.find((option) => {
		const optionValue = option.getAttribute('data-value')

		return optionValue === lastSelectedValue
	})

	const lastSelectedOptionIndex = lastSelectedOption?.getAttribute('data-index')

	return { lastSelectedOption, lastSelectedOptionIndex }
}
