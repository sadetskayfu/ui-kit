import * as React from 'react';
import type { ModernComponentProps } from '@/shared/helpers/types';
import { useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import styles from './scroll-area-content.module.scss';

/**
 * Renders a `<div>` element.
 */
export const ScrollAreaContent = React.forwardRef(
	(props: ScrollAreaContent.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const contentRef = React.useRef<HTMLDivElement>(null);

		const { computeThumbPosition, hiddenState } = useScrollAreaRootContext();

		const state: ScrollAreaContent.State = React.useMemo(
			() => ({
				hiddenScrollbarX: hiddenState.scrollbarXHidden,
				hiddenScrollbarY: hiddenState.scrollbarYHidden,
			}),
			[hiddenState.scrollbarXHidden, hiddenState.scrollbarYHidden]
		);

		useModernLayoutEffect(() => {
			if (typeof ResizeObserver === 'undefined') {
				return undefined;
			}

			const ro = new ResizeObserver(computeThumbPosition);

			if (contentRef.current) {
				ro.observe(contentRef.current);
			}

			return () => {
				ro.disconnect();
			};
		}, [computeThumbPosition]);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, contentRef],
			props: [
				{
					className: styles['base-content'],
					role: 'presentation',
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace ScrollAreaContent {
	export interface State {
		hiddenScrollbarX: boolean;
		hiddenScrollbarY: boolean;
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
