import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useTooltipRootContext } from '../root/tooltip-root-context';

/**
 * Renders a `<button>` element.
 */
export const TooltipTrigger = React.forwardRef(
	(props: TooltipTrigger.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { getReferenceProps, setReference, open, popupId, onTouchEnd, onTouchStart } = useTooltipRootContext();

		const state: TooltipTrigger.State = React.useMemo(() => ({ open }), [open]);

		const element = useRenderElement('button', {
			render,
			className,
			state,
			ref: [forwardedRef, setReference],
			props: [{ ...getReferenceProps(), 'aria-describedby': popupId, onTouchStart, onTouchEnd }, otherProps],
		});

		return element;
	}
);

export namespace TooltipTrigger {
	export interface State {
		open: boolean;
	}
	export interface Props extends ModernComponentProps<'button', State> {}
}
