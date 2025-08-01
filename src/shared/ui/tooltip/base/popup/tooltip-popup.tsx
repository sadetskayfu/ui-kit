import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useTooltipRootContext } from '../root/tooltip-root-context';

/**
 * Renders a `<div>` element.
 */
export const TooltipPopup = React.forwardRef(
	(props: TooltipPopup.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, id: idProp, ...otherProps } = props;

		const id = useId(idProp);

		const { floatingContext, interactive, describeChild, instantPhase, status, mounted, setPopupId, setFloating, getFloatingProps } =
			useTooltipRootContext();

		useModernLayoutEffect(() => {
			if (describeChild) {
				setPopupId(id)
			}

			return () => {
				setPopupId(undefined)
			}
		}, [describeChild, id, setPopupId])

		const state: TooltipPopup.State = React.useMemo(
			() => ({
				status,
				instantPhase,
			}),
			[status, instantPhase]
		);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, setFloating],
			props: [
				{
					id,
					role: 'tooltip',
					style: {
						...floatingContext.floatingStyles,
						pointerEvents: interactive ? 'all' : 'none',
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

		return element;
	}
);

export namespace TooltipPopup {
	export interface State {
		status: 'open' | 'close' | undefined;
		instantPhase: boolean;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
