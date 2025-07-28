import * as React from 'react';
import { CheckboxProviderContext } from './checkbox-provider-context';

export const CheckboxProvider = (props: CheckboxProvider.Props) => {
	const { children, color, size, variant, offset, disabled, readOnly, required } = props;

	const contextValue: CheckboxProviderContext = React.useMemo(
		() => ({ color, size, variant, offset, disabled, readOnly, required }),
		[color, size, variant, offset, disabled, readOnly, required]
	);

	return (
		<CheckboxProviderContext.Provider value={contextValue}>
			{children}
		</CheckboxProviderContext.Provider>
	);
};

export namespace CheckboxProvider {
	export interface Props extends CheckboxProviderContext {
		children?: React.ReactNode;
	}
}
