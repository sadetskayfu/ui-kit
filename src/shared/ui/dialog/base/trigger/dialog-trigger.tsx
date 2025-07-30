import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useDialogRootContext } from '../root/dialog-root-context';

/**
 * Renders a `<button>` element.
 */
export const DialogTrigger = React.forwardRef(
	(props: DialogTrigger.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { getReferenceProps, setReference, open } = useDialogRootContext();

		const state: DialogTrigger.State = React.useMemo(() => ({ open }), [open]);

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

export namespace DialogTrigger {
	export interface State {
		open: boolean;
	}
	export interface Props extends ModernComponentProps<'button', State> {}
}
