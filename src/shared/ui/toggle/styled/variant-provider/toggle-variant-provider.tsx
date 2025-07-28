import * as React from 'react';
import { ToggleVariantContext } from './toggle-variant-context';

export const ToggleVariantProvider = (props: ToggleVariantProvider.Props) => {
	const { children, color, size } = props;

	const contextValue: ToggleVariantContext = React.useMemo(
		() => ({ color, size }),
		[color, size]
	);

	return (
		<ToggleVariantContext.Provider value={contextValue}>
			{children}
		</ToggleVariantContext.Provider>
	);
};

export namespace ToggleVariantProvider {
	export interface Props extends ToggleVariantContext {
		children?: React.ReactNode;
	}
}
