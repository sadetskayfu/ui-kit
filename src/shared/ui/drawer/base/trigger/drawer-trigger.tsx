import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useDrawerRootContext } from '../root/drawer-root-context';

/**
 * Renders a `<button>` element.
 */
export const DrawerTrigger = React.forwardRef(
	(props: DrawerTrigger.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { getReferenceProps, setReference, open } = useDrawerRootContext();

		const state: DrawerTrigger.State = React.useMemo(() => ({ open }), [open]);

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

export namespace DrawerTrigger {
	export interface State {
		open: boolean;
	}
	export interface Props extends ModernComponentProps<'button', State> {}
}
