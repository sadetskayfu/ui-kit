import * as React from 'react';

export interface ScrollAreaRootContext {
	orientation: 'vertical' | 'horizontal' | 'both';
}

export const ScrollAreaRootContext = React.createContext<ScrollAreaRootContext | undefined>(
	undefined
);

export function useScrollAreaRootContext() {
	const context = React.useContext(ScrollAreaRootContext);

	if (!context) {
		throw new Error(
			'ScrollAreaRootContext is missing. ScrollArea parts must be used within <ScrollArea.Root />.'
		);
	}

	return context;
}
