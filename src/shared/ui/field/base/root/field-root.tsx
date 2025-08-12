import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { FieldRootContext } from './field-root-context';

/**
 * Renders a `<div>` element.
 */
export const FieldRoot = React.forwardRef(
	(props: FieldRoot.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const {
			render,
			className,
			errored = false,
			required = false,
			readOnly = false,
			disabled = false,
			...otherProps
		} = props;

		const [labelId, setLabelId] = React.useState<string | undefined>(undefined);
		const [helperTextId, setHelperTextId] = React.useState<string | undefined>(undefined);
		const [focused, setFocused] = React.useState<boolean>(false);

        const controlElementRef = React.useRef<HTMLElement | null>(null)

		const state: FieldRoot.State = React.useMemo(
			() => ({ disabled, errored, readOnly, focused }),
			[disabled, errored, readOnly, focused]
		);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: forwardedRef,
			props: [otherProps],
		});

		const contextValue: FieldRootContext = React.useMemo(
			() => ({
				labelId,
				setLabelId,
				helperTextId,
				setHelperTextId,
				focused,
				setFocused,
				errored,
				required,
				readOnly,
				disabled,
                controlElementRef
			}),
			[labelId, helperTextId, focused, errored, readOnly, required, disabled]
		);

		return (
			<FieldRootContext.Provider value={contextValue}>{element}</FieldRootContext.Provider>
		);
	}
);

export namespace FieldRoot {
	export interface State {
		errored: boolean;
		readOnly: boolean;
		disabled: boolean;
		focused: boolean;
	}
	export interface Props extends ModernComponentProps<'div', State> {
		errored?: boolean;
		required?: boolean;
		readOnly?: boolean;
		disabled?: boolean;
	}
}
