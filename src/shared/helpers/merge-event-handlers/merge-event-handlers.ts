export function mergeEventHandlers<TEvent>(
	handlers: (((event: TEvent) => void) | undefined)[]
) {
	return (event: TEvent) => {
		handlers.forEach(handler => {
			handler?.(event);
		});
	};
}
