import React from 'react';

export type TextDirection = 'ltr' | 'rtl';

export type DirectionContext = {
	direction: TextDirection;
};

export const DirectionContext = React.createContext<DirectionContext | undefined>(undefined);

export function useDirection(optional = true) {
	const context = React.useContext(DirectionContext);

	if (context === undefined && !optional) {
		throw new Error('DirectionContext is missing.');
	}

	return context?.direction ?? 'ltr';
}