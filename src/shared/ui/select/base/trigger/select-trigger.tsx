import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';
import { getInteractiveElement } from '@/shared/helpers/get-interactive-element';

/**
 * Renders a `<div>` element.
 */
export const SelectTrigger = React.forwardRef(
	(props: SelectTrigger.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const triggerRef = React.useRef<HTMLDivElement>(null)

		const { store, disabled, readOnly, onClose, onOpen } = useSelectRootContext();

		const setReference = useStore(store, selectors.setReference);
		const open = useStore(store, selectors.open);

		const state: SelectTrigger.State = React.useMemo(() => ({ open }), [open]);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, triggerRef, setReference],
			props: [
				{
					onClick: (event) => {
						if (disabled || readOnly) {
							return
						}

						const interactiveEl = getInteractiveElement(event.nativeEvent)

						if (interactiveEl && interactiveEl !== triggerRef.current) {
							return
						}

						if (open) {
							onClose();
						} else {
							onOpen();
						}
					},
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace SelectTrigger {
	export interface State {
		open: boolean;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
