import * as React from 'react';
import { FormLabel } from '@/shared/ui/form-label';
import { BaseField } from '../../base';

export const FieldLabel = React.memo((props: FieldLabel.Props) => {
	const { children, id, ...otherProps } = props;

	return (
		<BaseField.Label
			id={id}
			render={(props, state) => (
				<FormLabel
					focused={state.focused}
					required={state.required}
					errored={state.errored}
					{...props}
					{...otherProps}
				>
					{children}
				</FormLabel>
			)}
		/>
	);
});

export namespace FieldLabel {
	export interface Props extends Omit<FormLabel.Props, 'focused' | 'errored' | 'required' | 'children'> {
        children?: string | number
    }
}
