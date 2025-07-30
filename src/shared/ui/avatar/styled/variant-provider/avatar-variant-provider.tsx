import * as React from 'react';
import { AvatarVariantContext } from './avatar-variant-context';

export const AvatarVariantProvider = ({ children, size = 's' }: AvatarVariantProvider.Props) => {
	const contextValue: AvatarVariantContext = React.useMemo(() => ({ size }), [size]);

	return (
		<AvatarVariantContext.Provider value={contextValue}>
			{children}
		</AvatarVariantContext.Provider>
	);
};

export namespace AvatarVariantProvider {
	export interface Props extends AvatarVariantContext {
		children?: React.ReactNode;
	}
}
