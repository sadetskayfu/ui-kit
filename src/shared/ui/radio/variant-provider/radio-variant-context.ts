import * as React from 'react';

export interface RadioVariantContext {
	variant?: 'filled' | 'outlined';
	size?: 's' | 'm';
	/**
	 * Передайте смещение, чтобы компенсировать сдвиг, из за увеличенной кликабельной области
	 */
	offset?: 'left' | 'top' | 'right' | 'bottom' | ('left' | 'top' | 'right' | 'bottom')[];
	disabled?: boolean
}

export const RadioVariantContext = React.createContext<RadioVariantContext | undefined>(
	undefined
);

export function useRadioVariantContext() {
	return React.useContext(RadioVariantContext);
}
