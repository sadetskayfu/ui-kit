import React from 'react';
import { DirectionContext, type TextDirection } from './direction-context';

/**
 * Enables RTL behavior for components.
 */
export const DirectionProvider = ({ direction = 'ltr', children }: DirectionProvider.Props) => {
	const contextValue = React.useMemo(() => ({ direction }), [direction]);

	return <DirectionContext.Provider value={contextValue}>{children}</DirectionContext.Provider>;
};

export namespace DirectionProvider {
	export interface Props {
		children?: React.ReactNode;
		/**
		 * @default 'ltr'
		 */
		direction?: TextDirection;
	}
}
