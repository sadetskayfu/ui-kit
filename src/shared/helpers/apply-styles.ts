
export function applyStyles(element: HTMLElement | null, styles: Partial<CSSStyleDeclaration>) {
	if(element) {
		Object.assign(element.style, styles);
	}
}

