import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { FloatingFocusManager } from '@floating-ui/react';
import { useAsideMenuRootContext } from '../root/aside-menu-root-context';
import { RemoveScroll } from 'react-remove-scroll';

/**
 * Renders a `<div>` element.
 */
export const AsideMenuPopup = React.forwardRef(
	(props: AsideMenuPopup.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const {
			mounted,
			modal,
			status,
			floatingContext,
			titleId,
			descriptionId,
			initialFocus: initialFocusProp,
			removeScroll,
			closeElementRef,
			closeOnFocusOut,
			setFloating,
			getFloatingProps,
		} = useAsideMenuRootContext();

		const popupRef = React.useRef<HTMLDivElement | null>(null);

		const initialFocus = initialFocusProp ?? closeElementRef ?? popupRef;

		const state: AsideMenuPopup.State = React.useMemo(
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

export namespace AsideMenuPopup {
	export interface State {
		status: 'open' | 'close' | undefined;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
