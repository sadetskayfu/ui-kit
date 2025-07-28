import * as React from 'react';
import { CheckboxVariantContext } from './checkbox-variant-context';

export const CheckboxVariantProvider = (props: CheckboxVariantProvider.Props) => {
	const { children, color, size, variant, offset, disabled, required } = props;

	const contextValue: CheckboxVariantContext = React.useMemo(
		() => ({ color, size, variant, offset, disabled, required }),
		[color, size, variant, offset, disabled, required]
	);

	return (
		<CheckboxVariantContext.Provider value={contextValue}>
			{children}
		</CheckboxVariantContext.Provider>
	);
};

export namespace CheckboxVariantProvider {
	export interface Props extends CheckboxVariantContext {
		children?: React.ReactNode;
	}
}
