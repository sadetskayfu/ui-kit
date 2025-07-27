export function parseOffset(
	styles: CSSModuleClasses,
	offset?: 'left' | 'top' | 'right' | 'bottom' | ('left' | 'top' | 'right' | 'bottom')[]
) {
	if (!offset) {
		return undefined;
	}

	const className = Array.isArray(offset)
		? (offset as string[]).reduce(
				(className, side) => className + ' ' + styles[`offset-${side}`],
				''
			)
		: styles[`offset-${offset}`];

	return className;
}
