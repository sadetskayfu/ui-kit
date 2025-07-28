import * as React from 'react';

export interface CheckboxVariantContext {
	color?: 'primary';
	variant?: 'filled' | 'outlined';
	size?: 's' | 'm';
	/**
	 * Передайте смещение, чтобы компенсировать сдвиг, из за увеличенной кликабельной области
	 */
	offset?: 'left' | 'top' | 'right' | 'bottom' | ('left' | 'top' | 'right' | 'bottom')[];
	disabled?: boolean
	required?: boolean
}

export const CheckboxVariantContext = React.createContext<CheckboxVariantContext | undefined>(
	undefined
);

export function useCheckboxVariantContext() {
	return React.useContext(CheckboxVariantContext);
}
