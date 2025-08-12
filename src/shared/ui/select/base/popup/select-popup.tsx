import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';
import { RemoveScroll } from 'react-remove-scroll';

/**
 * Renders a `<div>` element.
 */
export const SelectPopup = React.forwardRef(
	(props: SelectPopup.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const { store, placement, removeScroll, setIsRegisteredItems } = useSelectRootContext();

		const mounted = useStore(store, selectors.mounted);
		const status = useStore(store, selectors.status);
		const floatingStyles = useStore(store, selectors.floatingStyles);
		const setFloating = useStore(store, selectors.setFloating);

		const state: SelectPopup.State = React.useMemo(
			() => ({ status, withPlacement: Boolean(placement) }),
			[status, placement]
		);

		useModernLayoutEffect(() => {
			return () => {
				setIsRegisteredItems(false)
			}
		}, [setIsRegisteredItems])

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, setFloating],
			props: [
				{
					role: 'presentation',
					onPointerDown: event => event.preventDefault(),
					style: placement ? floatingStyles : undefined,
				},
				otherProps,
			],
			enabled: mounted,
		});

		return <RemoveScroll enabled={removeScroll}>{element}</RemoveScroll>;
	}
);

export namespace SelectPopup {
	export interface State {
		status: 'open' | 'close' | undefined;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
