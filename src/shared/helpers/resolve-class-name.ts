import type { ComponentState } from './types';

export function resolveClassName<State extends ComponentState>(
	className: string | ((state: State) => string | undefined),
	state: State
) {
	return typeof className === 'function' ? className(state) : className;
}
