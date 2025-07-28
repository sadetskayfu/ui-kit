import * as React from 'react';
import { BorderContext } from './border-context';
import { getBorderClassName } from './get-border-class-name';

export const BorderProvider = (props: BorderProvider.Props) => {
	const { children, borderRadius = 'm', borderRadiusPlacement = 'all' } = props;

    const borderClassName = React.useMemo(() => getBorderClassName(borderRadius, borderRadiusPlacement), [borderRadius, borderRadiusPlacement])

	const contextValue: BorderContext = React.useMemo(
		() => ({ borderRadiusPlacement, borderRadius, borderClassName }),
		[borderRadiusPlacement, borderRadius, borderClassName]
	);

	return <BorderContext.Provider value={contextValue}>{children}</BorderContext.Provider>;
};

export namespace BorderProvider {
	export interface Props extends Omit<BorderContext, 'borderClassName'> {
		children?: React.ReactNode;
	}
}
