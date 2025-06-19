export function applyStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
	Object.assign(element.style, styles);
}
