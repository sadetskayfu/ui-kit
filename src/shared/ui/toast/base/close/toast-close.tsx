import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useToastProviderContext } from '../provider/toast-provider-context';
import { useToastRootContext } from '../root/toast-root-context';

/**
 * Renders a `<button>` element.
 */
export const ToastClose = React.forwardRef(
	(props: ToastClose.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { close } = useToastProviderContext();
		const { toast } = useToastRootContext();

		const element = useRenderElement('button', {
			render,
			className,
			ref: forwardedRef,
			props: [
				{
					onClick() {
						close(toast.id);
					},
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace ToastClose {
	export interface State {}
	export interface Props extends ModernComponentProps<'button', State> {}
}
