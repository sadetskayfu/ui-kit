import * as React from 'react';

export interface CheckboxProviderContext {
	color?: 'primary';
	variant?: 'filled' | 'outlined';
	size?: 's' | 'm';
	/**
	 * Передайте смещение, чтобы компенсировать сдвиг, из за увеличенной кликабельной области
	 */
	offset?: 'left' | 'top' | 'right' | 'bottom' | ('left' | 'top' | 'right' | 'bottom')[];
	disabled?: boolean
	readOnly?: boolean
	required?: boolean
}

export const CheckboxProviderContext = React.createContext<CheckboxProviderContext | undefined>(
	undefined
);

export function useCheckboxProviderContext() {
	return React.useContext(CheckboxProviderContext);
}
