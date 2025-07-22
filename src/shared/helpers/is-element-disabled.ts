export function isElementDisabled(element: HTMLElement | null) {
	if (
		element == null ||
		element.getAttribute('aria-disabled') === 'true' ||
		element.hasAttribute('disabled')
	) {
		return true;
	}

	return false;
}
