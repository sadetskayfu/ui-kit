import * as React from 'react';
import { CheckboxVariantContext } from './checkbox-variant-context';

export const CheckboxVariantProvider = (props: CheckboxVariantProvider.Props) => {
	const { children, color, size, variant, offset } = props;

	const contextValue: CheckboxVariantContext = React.useMemo(
		() => ({ color, size, variant, offset }),
		[color, size, variant, offset]
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
