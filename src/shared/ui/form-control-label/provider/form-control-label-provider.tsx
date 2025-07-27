import * as React from 'react';
import { FormControlLabelContext } from './form-control-label-context';

export const FormControlLabelProvider = (props: FormControlLabelProvider.Props) => {
	const { children, color, placement, disabled, required } = props;

	const contextValue: FormControlLabelContext = React.useMemo(
		() => ({ color, placement, required, disabled }),
		[color, placement, required, disabled]
	);

	return (
		<FormControlLabelContext.Provider value={contextValue}>
			{children}
		</FormControlLabelContext.Provider>
	);
};

export namespace FormControlLabelProvider {
	export interface Props extends Omit<FormControlLabelContext, 'labelId'> {
		children?: React.ReactNode;
	}
}
