import React from 'react';
import type { HTMLProps, ModernComponentPropsWithClassName } from '@/shared/helpers/types';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import { useRenderElement } from '@/shared/hooks';
import { getOffset } from '../helpers/get-offset';
import { useDirection } from '@/app/providers/direction-provider';
import { ScrollAreaScrollbarCssVars } from './scroll-area-scrollbar-css-vars';
import { ScrollAreaScrollbarContext } from './scroll-area-scrollbar-context';
import { ScrollAreaScrollbarDataAttributes } from './scroll-area-scrollbar-data-attributes';
import { classNames } from '@/shared/helpers/class-names';
import styles from './scroll-area-scrollbar.module.scss'

export type Orientation = 'vertical' | 'horizontal';

export const ScrollAreaScrollbar = React.forwardRef(
	(props: ScrollAreaScrollbar.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { className, orientation = 'vertical', ...otherProps } = props;

		const {
			hovering,
			scrollingX,
			scrollingY,
			thumbSize,
			hiddenState,
			scrollbarYRef,
			scrollbarXRef,
			viewportRef,
			thumbYRef,
			thumbXRef,
			handlePointerDown,
			handlePointerUp,
		} = useScrollAreaRootContext();

		const direction = useDirection();

		const state: ScrollAreaScrollbar.State = React.useMemo(
			() => ({
				hovering,
				scrolling: { horizontal: scrollingX, vertical: scrollingY }[orientation],
				orientation,
			}),
			[hovering, scrollingX, scrollingY, orientation]
		);

		React.useEffect(() => {
			const viewport = viewportRef.current;
			const scrollbar =
				orientation === 'vertical' ? scrollbarYRef.current : scrollbarXRef.current;

			if (!scrollbar) {
				return undefined;
			}

			function handleWheel(event: WheelEvent) {
				if (!viewport || !scrollbar || event.ctrlKey) {
					return;
				}

				event.preventDefault();

				if (orientation === 'vertical') {
					if (viewport.scrollTop === 0 && event.deltaY < 0) {
						return;
					}
				} else if (viewport.scrollLeft === 0 && event.deltaX < 0) {
					return;
				}

				if (orientation === 'vertical') {
					if (
						viewport.scrollTop === viewport.scrollHeight - viewport.clientHeight &&
						event.deltaX > 0
					) {
						return;
					}
				} else if (
					viewport.scrollLeft === viewport.scrollWidth - viewport.clientWidth &&
					event.deltaX > 0
				) {
					return;
				}

				if (orientation === 'vertical') {
					viewport.scrollTop += event.deltaY;
				} else {
					viewport.scrollLeft += event.deltaX;
				}
			}

			scrollbar.addEventListener('wheel', handleWheel, { passive: false });

			return () => {
				scrollbar.removeEventListener('wheel', handleWheel);
			};
		}, [orientation, scrollbarXRef, scrollbarYRef, viewportRef]);

		const localProps: HTMLProps = {
			className: classNames(styles['base-scrollbar'], [styles[`orientation-${orientation}`]]),
			style: {
				...(orientation === 'vertical' && {
					[ScrollAreaScrollbarCssVars.scrollAreaThumbHeight as string]: `${thumbSize.height}px`,
				}),
				...(orientation === 'horizontal' && {
					[ScrollAreaScrollbarCssVars.scrollAreaThumbWidth as string]: `${thumbSize.width}px`,
				}),
			},
			[ScrollAreaScrollbarDataAttributes.orientation as string]: `${orientation}`,
			onPointerDown(event) {                     
				// Ignore clicks on thumb
				if (event.currentTarget !== event.target) {
					return;
				}

				if (!viewportRef.current) {
					return;
				}

				// Y
				if (thumbYRef.current && scrollbarYRef.current && orientation === 'vertical') {
					const thumbYOffset = getOffset(thumbYRef.current, 'margin', 'y');
					const scrollbarYOffset = getOffset(scrollbarYRef.current, 'padding', 'y');
					const thumbHeight = thumbYRef.current.offsetHeight;
					const trackRectY = scrollbarYRef.current.getBoundingClientRect();
					const clickY =
						event.clientY -
						trackRectY.top -
						thumbHeight / 2 -
						scrollbarYOffset +
						thumbYOffset / 2;

					const scrollableContentHeight = viewportRef.current.scrollHeight;
					const viewportHeight = viewportRef.current.clientHeight;

					const maxThumbOffsetY =
						scrollbarYRef.current.offsetHeight -
						thumbHeight -
						scrollbarYOffset -
						thumbYOffset;
					const scrollRatioY = clickY / maxThumbOffsetY;
					const newScrollTop = scrollRatioY * (scrollableContentHeight - viewportHeight);

					viewportRef.current.scrollTop = newScrollTop;
				}

				// X
				if (thumbXRef.current && scrollbarXRef.current && orientation === 'horizontal') {
					const thumbXOffset = getOffset(thumbXRef.current, 'margin', 'x');
					const scrollbarXOffset = getOffset(scrollbarXRef.current, 'padding', 'x');
					const thumbWidth = thumbXRef.current.offsetWidth;
					const trackRectX = scrollbarXRef.current.getBoundingClientRect();
					const clickX =
						event.clientX -
						trackRectX.left -
						thumbWidth / 2 -
						scrollbarXOffset +
						thumbXOffset / 2;

					const scrollableContentWidth = viewportRef.current.scrollWidth;
					const viewportWidth = viewportRef.current.clientWidth;

					const maxThumbOffsetX =
						scrollbarXRef.current.offsetWidth -
						thumbWidth -
						scrollbarXOffset -
						thumbXOffset;
					const scrollRatioX = clickX / maxThumbOffsetX;

					let newScrollLeft: number;
					if (direction === 'rtl') {
						// In RTL, invert the scroll direction
						newScrollLeft =
							(1 - scrollRatioX) * (scrollableContentWidth - viewportWidth);

						// Adjust for browsers that use negative scrollLeft in RTL
						if (viewportRef.current.scrollLeft <= 0) {
							newScrollLeft = -newScrollLeft;
						}
					} else {
						newScrollLeft = scrollRatioX * (scrollableContentWidth - viewportWidth);
					}

					viewportRef.current.scrollLeft = newScrollLeft;
				}

				handlePointerDown(event);
			},
			onPointerUp: handlePointerUp,
		};

		const element = useRenderElement('div', {
			className,
			ref: [forwardedRef, orientation === 'vertical' ? scrollbarYRef : scrollbarXRef],
			state,
			props: [localProps, otherProps],
		});

		const contextValue = React.useMemo(() => ({ orientation }), [orientation]);

		const isHidden =
			orientation === 'vertical'
				? hiddenState.scrollbarYHidden
				: hiddenState.scrollbarXHidden;

		if (isHidden) {
			return null;
		}

		return (
			<ScrollAreaScrollbarContext.Provider value={contextValue}>
				{element}
			</ScrollAreaScrollbarContext.Provider>
		);
	}
);

export namespace ScrollAreaScrollbar {
	export interface Props extends ModernComponentPropsWithClassName<'div', State> {
		/**
		 * @default 'vertical'
		 */
		orientation?: Orientation;
	}

	export interface State {
		hovering: boolean;
		scrolling: boolean;
		orientation: Orientation;
	}
}
