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

export type ComponentState = Record<string, any>
export type ComponentRender<Props, State extends ComponentState> = (props: Props, state: State) => React.ReactElement;
export type ComponentClassName<State extends ComponentState> = string | ((state: State) => string)

export type ModernComponentProps<ElementType extends React.ElementType> = WithModernEvent<React.ComponentPropsWithoutRef<ElementType>>
export type ModernComponentPropsWithClassName<ElementType extends React.ElementType, State extends ComponentState> = Omit<WithModernEvent<React.ComponentPropsWithoutRef<ElementType>>, 'className'> & { className?: ComponentClassName<State> }
