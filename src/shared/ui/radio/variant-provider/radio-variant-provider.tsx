import * as React from 'react';
import { RadioVariantContext } from './radio-variant-context';

export const RadioVariantProvider = (props: RadioVariantProvider.Props) => {
	const { children, size, variant, offset, disabled } = props;

	const contextValue: RadioVariantContext = React.useMemo(
		() => ({ size, variant, offset, disabled }),
		[size, variant, offset, disabled]
	);

	return (
		<RadioVariantContext.Provider value={contextValue}>{children}</RadioVariantContext.Provider>
	);
};

export namespace RadioVariantProvider {
	export interface Props extends RadioVariantContext {
		children?: React.ReactNode;
	}
}
