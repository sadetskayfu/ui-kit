import { type HTMLAttributes } from 'react';

export type HTMLProps<T = any> = HTMLAttributes<T> & {
	ref?: React.Ref<T>;
};

export type ModernEvent<E extends React.SyntheticEvent<Element, Event>> = E & {
	preventLocalHandler?: () => void;
	readonly localHandlerPrevented?: boolean;
};

type WithPreventHandler<T> = T extends (event: infer E) => any
	? E extends React.SyntheticEvent<Element, Event>
		? (event: ModernEvent<E>) => ReturnType<T>
		: T
	: T extends undefined
		? undefined
		: T;

/**
 * Adds a `preventHandler` method to all event handlers.
 */
export type WithModernEvent<T> = {
	[K in keyof T]: WithPreventHandler<T[K]>;
};

export type ModernComponentProps<
	ElementType extends React.ElementType,
	State,
	RenderFunctionProps = Omit<HTMLProps, 'color' | 'size'>,
> = Omit<
	WithModernEvent<React.ComponentPropsWithoutRef<ElementType>>,
	'color' | 'size' | 'className'
> & {
	className?: string | ((state: State) => string);
	render?:
		| React.ReactElement<Record<string, any>>
		| ((props: RenderFunctionProps, state: State) => React.ReactElement<Record<string, any>>);
};
