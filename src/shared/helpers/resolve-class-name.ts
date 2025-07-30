export function resolveClassName<State extends Record<string, any>>(
	className: string | ((state: State) => string | undefined) | undefined,
	state: State
) {
	return typeof className === 'function' ? className(state) : className;
}
