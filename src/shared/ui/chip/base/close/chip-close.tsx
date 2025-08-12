import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useChipRootContext } from '../root/chip-root-context';

/**
 * Renders a `<button>` element.
 */
export const ChipClose = React.forwardRef(
	(props: ChipClose.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, disabled: disabledProp, ...otherProps } = props;

		const { disabled, onClose } = useChipRootContext();

		const element = useRenderElement('button', {
			render,
			className,
			ref: forwardedRef,
			props: [
				{
                    tabIndex: -1,
					disabled: disabledProp || disabled,
					onClick: event => onClose?.(event.nativeEvent),
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace ChipClose {
	export interface State {}
	export interface Props extends ModernComponentProps<'button', State> {}
}
