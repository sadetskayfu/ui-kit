import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { usePopoverRootContext } from '../root/popover-root-context';

/**
 * Renders a `<span>` element.
 */
export const PopoverArrow = React.forwardRef(
	(props: PopoverArrow.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
		const { render, className, padding = 10, ...otherProps } = props;

		const { arrowRef, floatingContext, setArrowPadding, setShowArrow } = usePopoverRootContext();

		const arrowX = floatingContext.middlewareData.arrow?.x;
		const arrowY = floatingContext.middlewareData.arrow?.y;
		const side = floatingContext.placement.split('-')[0] as PopoverArrow.Side;

        const state: PopoverArrow.State = React.useMemo(
            () => ({
                side,
            }),
            [side]
        );

        useModernLayoutEffect(() => {
            setShowArrow(true)
            setArrowPadding(padding)

            return () => {
                setShowArrow(false)
                setArrowPadding(0)
            }
        }, [setArrowPadding, setArrowPadding, padding])

		const element = useRenderElement('span', {
			render,
			className,
			state,
			ref: [forwardedRef, arrowRef],
			props: [
				{
					style: {
						left: arrowX != null ? `${arrowX}px` : '',
						top: arrowY != null ? `${arrowY}px` : '',
					},
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace PopoverArrow {
	export type Side = 'top' | 'bottom' | 'left' | 'right';

	export interface State {
		side: Side;
	}

	export interface Props extends ModernComponentProps<'span', State> {
        /**
         * @default 10
         * @description 'Отступ от краев элемента, чтобы стрелка не оказывалась в углу'
         */
        padding?: number
    }
}
