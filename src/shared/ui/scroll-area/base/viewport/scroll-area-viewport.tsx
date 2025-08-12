import React from 'react';
import type { HTMLProps, ModernComponentProps } from '@/shared/helpers/types';
import {
	useEventCallback,
	useModernLayoutEffect,
	useRenderElement,
	useTimeout,
} from '@/shared/hooks';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import { useDirection } from '@/app/providers/direction-provider';
import { onVisible } from '../helpers/on-visible';
import styles from './scroll-area-viewport.module.scss';

/**
 * Renders a `<div>` element.
 */
export const ScrollAreaViewport = React.forwardRef(
	(props: ScrollAreaViewport.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const { viewportRef, hiddenState, handleScroll, setHovering, computeThumbPosition } =
			useScrollAreaRootContext();

		const direction = useDirection();

		const programmaticScrollRef = React.useRef(true);
		const scrollEndTimeout = useTimeout();

		useModernLayoutEffect(() => {
			if (!viewportRef.current) {
				return undefined;
			}

			const cleanup = onVisible(viewportRef.current, computeThumbPosition);

			return cleanup;
		}, [computeThumbPosition, viewportRef]);

		useModernLayoutEffect(() => {
			// Wait for scrollbar-related refs to be set
			queueMicrotask(computeThumbPosition);
		}, [computeThumbPosition, hiddenState, direction]);

		useModernLayoutEffect(() => {
			// `onMouseEnter` doesn't fire upon load, so we need to check if the viewport is already
			// being hovered.
			if (viewportRef.current?.matches(':hover')) {
				setHovering(true);
			}
		}, [viewportRef, setHovering]);

		React.useEffect(() => {
			if (typeof ResizeObserver === 'undefined') {
				return undefined;
			}

			const ro = new ResizeObserver(computeThumbPosition);

			if (viewportRef.current) {
				ro.observe(viewportRef.current);
			}

			return () => {
				ro.disconnect();
			};
		}, [computeThumbPosition, viewportRef]);

		const handleUserInteraction = useEventCallback(() => {
			programmaticScrollRef.current = false;
		});

		const localProps: HTMLProps = {
			className: styles['base-viewport'],
			role: 'presentation',
			...((!hiddenState.scrollbarXHidden || !hiddenState.scrollbarYHidden) && {
				tabIndex: 0,
			}),
			onScroll() {
				if (!viewportRef.current) {
					return;
				}

				computeThumbPosition();

				if (!programmaticScrollRef.current) {
					handleScroll({
						x: viewportRef.current.scrollLeft,
						y: viewportRef.current.scrollTop,
					});
				}

				// Debounce the restoration of the programmatic flag so that it only
				// flips back to `true` once scrolling has come to a rest. This ensures
				// that momentum scrolling (where no further user-interaction events fire)
				// is still treated as user-driven.
				// 100 ms without scroll events ≈ scroll end
				// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event
				scrollEndTimeout.start(100, () => {
					programmaticScrollRef.current = true;
				});
			},
			onWheel: handleUserInteraction,
			onTouchMove: handleUserInteraction,
			onPointerMove: handleUserInteraction,
			onPointerEnter: handleUserInteraction,
			onKeyDown: handleUserInteraction,
		};

		const element = useRenderElement('div', {
			render,
			className,
			ref: [forwardedRef, viewportRef],
			props: [localProps, otherProps],
		});

		return element;
	}
);

export namespace ScrollAreaViewport {
	export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
