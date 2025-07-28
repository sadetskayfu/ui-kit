import * as React from 'react';
import { ButtonVariantContext } from './button-variant-context';

export const ButtonVariantProvider = (props: ButtonVariantProvider.Props) => {
	const { children, color, size, variant, disabled, iconButton } = props;

	const contextValue: ButtonVariantContext = React.useMemo(
		() => ({ color, size, variant, disabled, iconButton }),
		[color, size, variant, disabled, iconButton]
	);

	return (
		<ButtonVariantContext.Provider value={contextValue}>
			{children}
		</ButtonVariantContext.Provider>
	);
};

export namespace ButtonVariantProvider {
	export interface Props extends ButtonVariantContext {
		children?: React.ReactNode;
	}
}
