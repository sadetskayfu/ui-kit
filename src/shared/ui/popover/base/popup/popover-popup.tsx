import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { FloatingFocusManager } from '@floating-ui/react';
import { usePopoverRootContext } from '../root/popover-root-context';
import { RemoveScroll } from 'react-remove-scroll';

/**
 * Renders a `<div>` element.
 */
export const PopoverPopup = React.forwardRef(
	(props: PopoverPopup.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const {
			modal,
			closeOnFocusOut,
			mounted,
			status,
			floatingContext,
			titleId,
			descriptionId,
			initialFocus: initialFocusProp,
			removeScroll,
			closeElementRef,
			setFloating,
			getFloatingProps,
		} = usePopoverRootContext();

		const popupRef = React.useRef<HTMLDivElement | null>(null);

		const initialFocus = initialFocusProp ?? closeElementRef ?? popupRef;

		const state: PopoverPopup.State = React.useMemo(
			() => ({
				status,
			}),
			[status]
		);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, popupRef, setFloating],
			props: [
				{
					'aria-labelledby': titleId,
					'aria-describedby': descriptionId,
					'aria-modal': modal ? 'true' : undefined,
					style: {
						...floatingContext.floatingStyles
					},
					...getFloatingProps(),
				},
				otherProps,
			],
			enabled: mounted,
		});

		if (!mounted) {
			return null;
		}

		return (
			<FloatingFocusManager
				initialFocus={initialFocus}
				returnFocus={false}
				context={floatingContext}
				modal={modal}
				closeOnFocusOut={closeOnFocusOut}
			>
				<RemoveScroll enabled={removeScroll}>{element}</RemoveScroll>
			</FloatingFocusManager>
		);
	}
);

export namespace PopoverPopup {
	export interface State {
		status: 'open' | 'close' | undefined;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
