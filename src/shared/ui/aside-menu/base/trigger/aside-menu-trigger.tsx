import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useAsideMenuRootContext } from '../root/aside-menu-root-context';

/**
 * Renders a `<button>` element.
 */
export const AsideMenuTrigger = React.forwardRef(
	(props: AsideMenuTrigger.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, ...otherProps } = props;

		const { getReferenceProps, setReference, open } = useAsideMenuRootContext();

		const state: AsideMenuTrigger.State = React.useMemo(() => ({ open }), [open]);

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

export namespace AsideMenuTrigger {
	export interface State {
		open: boolean;
	}
	export interface Props extends ModernComponentProps<'button', State> {}
}
