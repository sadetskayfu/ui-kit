import * as React from 'react';

export type BorderRadiusPlacement =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
    | 'all'
	| ('top-left' | 'top-right' | 'bottom-left' | 'bottom-right')[];
export type BorderRadius = 's' | 'm' | 'full' | 'circular' | 'none';

export interface BorderContext {
	borderRadiusPlacement?: BorderRadiusPlacement;
	borderRadius?: BorderRadius;
    borderClassName?: string
}

export const BorderContext = React.createContext<BorderContext | undefined>(undefined);

export function useBorderContext() {
	return React.useContext(BorderContext);
}
