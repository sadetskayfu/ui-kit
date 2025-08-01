import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { usePopoverRootContext } from '../root/popover-root-context';

/**
 * Renders a `<button>` element.
 */
export const PopoverClose = React.forwardRef(
	(props: PopoverClose.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { setOpen, closeElementRef } = usePopoverRootContext();

		const element = useRenderElement('button', {
			render,
			className,
			ref: [forwardedRef, closeElementRef],
			props: [{ onClick: () => setOpen(false) }, otherProps],
		});

		return element;
	}
);

export namespace PopoverClose {
	export interface State {}
	export interface Props extends ModernComponentProps<'button', State> {}
}
