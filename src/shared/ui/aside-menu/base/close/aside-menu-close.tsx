import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useAsideMenuRootContext } from '../root/aside-menu-root-context';

/**
 * Renders a `<button>` element.
 */
export const AsideMenuClose = React.forwardRef(
	(props: AsideMenuClose.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { setOpen, closeElementRef } = useAsideMenuRootContext();

		const element = useRenderElement('button', {
			render,
			className,
			ref: [forwardedRef, closeElementRef],
			props: [{ onClick: () => setOpen(false) }, otherProps],
		});

		return element;
	}
);

export namespace AsideMenuClose {
	export interface State {}
	export interface Props extends ModernComponentProps<'button', State> {}
}
