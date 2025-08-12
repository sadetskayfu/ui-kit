import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useFieldRootContext } from '../root/field-root-context';

/**
 * Renders a `<input>` element.
 */
export const FieldControl = React.forwardRef(
	(props: FieldControl.Props, forwardedRef: React.ForwardedRef<HTMLInputElement>) => {
		const {
			render,
			className,
			nativeInput = true,
			'aria-describedby': ariaDescribedbyProp,
			...otherProps
		} = props;

		const {
			labelId,
			helperTextId,
			disabled,
			errored,
			required,
			readOnly,
			controlElementRef,
			setFocused,
		} = useFieldRootContext();

		const element = useRenderElement('input', {
			render,
			className,
			ref: [forwardedRef, controlElementRef],
			props: [
				{
					...(labelId && { 'aria-labelledby': labelId }),
					'aria-describedby':
						ariaDescribedbyProp && helperTextId
							? `${ariaDescribedbyProp} ${helperTextId}`
							: ariaDescribedbyProp
								? ariaDescribedbyProp
								: helperTextId,
					'aria-invalid': errored ? 'true' : undefined,
					...(nativeInput && { disabled, required, readOnly }),
					...(!nativeInput && {
						'aria-disabled': disabled ? 'true' : undefined,
						'aria-readonly': readOnly ? 'true' : undefined,
						'aria-required': required ? 'true' : undefined,
					}),
					...(!nativeInput && { tabIndex: disabled ? -1 : 0 }),
					onFocus: () => setFocused(true),
					onBlur: () => setFocused(false),
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace FieldControl {
	export interface State {}
	export interface Props extends ModernComponentProps<'input', State> {
		/**
		 * input - [disabled, required, readOnly],
		 * otherElement - [aria-disabled, aria-required, aria-readonly]
		 * @default 'true'
		 */
		nativeInput?: boolean;
	}
}
