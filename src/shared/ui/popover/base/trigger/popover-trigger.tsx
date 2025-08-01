import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { usePopoverRootContext } from '../root/popover-root-context';

/**
 * Renders a `<button>` element.
 */
export const PopoverTrigger = React.forwardRef(
	(props: PopoverTrigger.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { getReferenceProps, setReference, open } = usePopoverRootContext();

		const state: PopoverTrigger.State = React.useMemo(() => ({ open }), [open]);

		const element = useRenderElement('button', {
			render,
			className,
			state,
			ref: [forwardedRef, setReference],
			props: [{ ...getReferenceProps() }, otherProps],
		});

		return element;
	}
);

export namespace PopoverTrigger {
	export interface State {
		open: boolean;
	}
	export interface Props extends ModernComponentProps<'button', State> {}
}
