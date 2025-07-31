import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useDrawerRootContext } from '../root/drawer-root-context';

/**
 * Renders a `<button>` element.
 */
export const DrawerClose = React.forwardRef(
	(props: DrawerClose.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { setOpen, closeElementRef } = useDrawerRootContext();

		const element = useRenderElement('button', {
			render,
			className,
			ref: [forwardedRef, closeElementRef],
			props: [{ onClick: () => setOpen(false) }, otherProps],
		});

		return element;
	}
);

export namespace DrawerClose {
	export interface State {}
	export interface Props extends ModernComponentProps<'button', State> {}
}
