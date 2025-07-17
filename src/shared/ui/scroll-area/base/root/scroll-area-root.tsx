import React from 'react';
import type { HTMLProps, ModernComponentProps } from '@/shared/helpers/types';
import { useEventCallback, useTimeout } from '@/shared/hooks';
import { MIN_THUMB_SIZE, SCROLL_TIMEOUT } from '../constants';
import { getOffset } from '../helpers/get-offset';
import { ScrollAreaRootContext } from './scroll-area-root-context';
import { useRenderElement } from '@/shared/hooks/use-render-element';
import { ScrollAreaRootCssVars } from './scroll-area-root-css-vars';
import { useDirection } from '@/app/providers/direction-provider';
import clamp from 'lodash/clamp';
import { ScrollAreaScrollbarDataAttributes } from '../scrollbar/scroll-area-scrollbar-data-attributes';
import type { Orientation } from '../scrollbar/scroll-area-scrollbar';
import styles from './scroll-area-root.module.scss'

export type ScrollPosition = {
	x: number;
	y: number;
};

export type HiddenState = {
	scrollbarYHidden: boolean;
	scrollbarXHidden: boolean;
	cornerHidden: boolean;
};

export type Size = {
	width: number;
	height: number;
};

export const ScrollAreaRoot = React.forwardRef(
	(props: ScrollAreaRoot.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { className, ...otherProps } = props;

		const [hovering, setHovering] = React.useState(false);
		const [scrollingX, setScrollingX] = React.useState(false);
		const [scrollingY, setScrollingY] = React.useState(false);
		const [cornerSize, setCornerSize] = React.useState<Size>({ width: 0, height: 0 });
		const [thumbSize, setThumbSize] = React.useState<Size>({ width: 0, height: 0 });
		const [touchModality, setTouchModality] = React.useState(false);

		const viewportRef = React.useRef<HTMLDivElement>(null);
		const scrollbarYRef = React.useRef<HTMLDivElement>(null);
		const scrollbarXRef = React.useRef<HTMLDivElement>(null);
		const thumbYRef = React.useRef<HTMLDivElement>(null);
		const thumbXRef = React.useRef<HTMLDivElement>(null);
		const cornerRef = React.useRef<HTMLDivElement>(null);

		const thumbDraggingRef = React.useRef(false);
		const startYRef = React.useRef(0);
		const startXRef = React.useRef(0);
		const startScrollTopRef = React.useRef(0);
		const startScrollLeftRef = React.useRef(0);
		const scrollYTimeout = useTimeout();
		const scrollXTimeout = useTimeout();
		const scrollPositionRef = React.useRef<ScrollPosition>({ x: 0, y: 0 });
		const currentOrientationRef = React.useRef<Orientation>('vertical');

		const [hiddenState, setHiddenState] = React.useState<HiddenState>({
			scrollbarYHidden: false,
			scrollbarXHidden: false,
			cornerHidden: false,
		});

		const direction = useDirection();

		const handleScroll = useEventCallback((scrollPosition: { x: number; y: number }) => {
			const offsetX = scrollPosition.x - scrollPositionRef.current.x;
			const offsetY = scrollPosition.y - scrollPositionRef.current.y;
			scrollPositionRef.current = scrollPosition;

			if (offsetY !== 0) {
				setScrollingY(true);

				scrollYTimeout.start(SCROLL_TIMEOUT, () => {
					setScrollingY(false);
				});
			}

			if (offsetX !== 0) {
				setScrollingX(true);

				scrollXTimeout.start(SCROLL_TIMEOUT, () => {
					setScrollingX(false);
				});
			}
		});

		const handlePointerDown = useEventCallback((event: React.PointerEvent) => {
			thumbDraggingRef.current = true;

			startYRef.current = event.clientY;
			startXRef.current = event.clientX;
			currentOrientationRef.current = event.currentTarget.getAttribute(ScrollAreaScrollbarDataAttributes.orientation) as Orientation

			if (viewportRef.current) {
				startScrollTopRef.current = viewportRef.current.scrollTop;
				startScrollLeftRef.current = viewportRef.current.scrollLeft;
			}
			if (thumbYRef.current && currentOrientationRef.current === 'vertical') {
				thumbYRef.current.setPointerCapture(event.pointerId);
			}
			if (thumbXRef.current && currentOrientationRef.current === 'horizontal') {
				thumbXRef.current.setPointerCapture(event.pointerId);
			}
		});

		const handlePointerUp = useEventCallback((event: React.PointerEvent) => {
			thumbDraggingRef.current = false;

			if (thumbYRef.current && currentOrientationRef.current === 'vertical') {
				thumbYRef.current.releasePointerCapture(event.pointerId);
			}
			if (thumbXRef.current && currentOrientationRef.current === 'horizontal') {
				thumbXRef.current.releasePointerCapture(event.pointerId);
			}
		});

		const handlePointerMove = useEventCallback((event: React.PointerEvent) => {
			if (!thumbDraggingRef.current || !viewportRef.current) {
				return;
			}

			const deltaY = event.clientY - startYRef.current;
			const deltaX = event.clientX - startXRef.current;

			const scrollableContentHeight = viewportRef.current.scrollHeight;
			const scrollableContentWidth = viewportRef.current.scrollWidth;
			const viewportHeight = viewportRef.current.clientHeight;
			const viewportWidth = viewportRef.current.clientWidth;

			if (thumbYRef.current && scrollbarYRef.current && currentOrientationRef.current === 'vertical') {
				const scrollbarYOffset = getOffset(scrollbarYRef.current, 'padding', 'y');
				const thumbYOffset = getOffset(thumbYRef.current, 'margin', 'y');
				const thumbHeight = thumbYRef.current.offsetHeight;
				const maxThumbOffsetY =
					scrollbarYRef.current.offsetHeight -
					thumbHeight -
					scrollbarYOffset -
					thumbYOffset;
				const scrollRatioY = deltaY / maxThumbOffsetY;
				viewportRef.current.scrollTop =
					startScrollTopRef.current +
					scrollRatioY * (scrollableContentHeight - viewportHeight);
				event.preventDefault();

				setScrollingY(true);

				scrollYTimeout.start(SCROLL_TIMEOUT, () => {
					setScrollingY(false);
				});
			}

			if (thumbXRef.current && scrollbarXRef.current && currentOrientationRef.current === 'horizontal') {
				const scrollbarXOffset = getOffset(scrollbarXRef.current, 'padding', 'x');
				const thumbXOffset = getOffset(thumbXRef.current, 'margin', 'x');
				const thumbWidth = thumbXRef.current.offsetWidth;
				const maxThumbOffsetX =
					scrollbarXRef.current.offsetWidth -
					thumbWidth -
					scrollbarXOffset -
					thumbXOffset;
				const scrollRatioX = deltaX / maxThumbOffsetX;
				viewportRef.current.scrollLeft =
					startScrollLeftRef.current +
					scrollRatioX * (scrollableContentWidth - viewportWidth);
				event.preventDefault();

				setScrollingX(true);

				scrollXTimeout.start(SCROLL_TIMEOUT, () => {
					setScrollingX(false);
				});
			}
		});

		function handlePointerEnterOrMove(event: React.PointerEvent) {
			const isTouch = event.pointerType === 'touch';

			setTouchModality(isTouch);

			if (!isTouch) {
				setHovering(true);
			}
		}

		const computeThumbPosition = useEventCallback(() => {
			const viewport = viewportRef.current;
			const scrollbarY = scrollbarYRef.current;
			const scrollbarX = scrollbarXRef.current;
			const thumbY = thumbYRef.current;
			const thumbX = thumbXRef.current;
			const corner = cornerRef.current;

			if (!viewport) {
				return;
			}

			const scrollableContentHeight = viewport.scrollHeight;
			const scrollableContentWidth = viewport.scrollWidth;
			const viewportHeight = viewport.clientHeight;
			const viewportWidth = viewport.clientWidth;
			const scrollTop = viewport.scrollTop;
			const scrollLeft = viewport.scrollLeft;

			if (scrollableContentHeight === 0 || scrollableContentWidth === 0) {
				return;
			}

			const scrollbarYHidden = viewportHeight >= scrollableContentHeight;
			const scrollbarXHidden = viewportWidth >= scrollableContentWidth;
			const ratioX = viewportWidth / scrollableContentWidth;
			const ratioY = viewportHeight / scrollableContentHeight;
			const nextWidth = scrollbarXHidden ? 0 : viewportWidth;
			const nextHeight = scrollbarYHidden ? 0 : viewportHeight;

			const scrollbarXOffset = getOffset(scrollbarX, 'padding', 'x');
			const scrollbarYOffset = getOffset(scrollbarY, 'padding', 'y');
			const thumbXOffset = getOffset(thumbX, 'margin', 'x');
			const thumbYOffset = getOffset(thumbY, 'margin', 'y');

			const idealNextWidth = nextWidth - scrollbarXOffset - thumbXOffset;
			const idealNextHeight = nextHeight - scrollbarYOffset - thumbYOffset;

			const maxNextWidth = scrollbarX
				? Math.min(scrollbarX.offsetWidth, idealNextWidth)
				: idealNextWidth;
			const maxNextHeight = scrollbarY
				? Math.min(scrollbarY.offsetHeight, idealNextHeight)
				: idealNextHeight;

			const clampedNextWidth = Math.max(MIN_THUMB_SIZE, maxNextWidth * ratioX);
			const clampedNextHeight = Math.max(MIN_THUMB_SIZE, maxNextHeight * ratioY);

			setThumbSize(prevSize => {
				if (prevSize.height === clampedNextHeight && prevSize.width === clampedNextWidth) {
					return prevSize;
				}

				return {
					width: clampedNextWidth,
					height: clampedNextHeight,
				};
			});

			// Handle Y (vertical) scroll
			if (scrollbarY && thumbY) {
				const maxThumbOffsetY =
					scrollbarY.offsetHeight - clampedNextHeight - scrollbarYOffset - thumbYOffset;
				const scrollRatioY = scrollTop / (scrollableContentHeight - viewportHeight);

				// In Safari, don't allow it to go negative or too far as `scrollTop` considers the rubber
				// band effect.
				const thumbOffsetY = Math.min(
					maxThumbOffsetY,
					Math.max(0, scrollRatioY * maxThumbOffsetY)
				);

				thumbY.style.transform = `translate3d(0,${thumbOffsetY}px,0)`;
			}

			// Handle X (horizontal) scroll
			if (scrollbarX && thumbX) {
				const maxThumbOffsetX =
					scrollbarX.offsetWidth - clampedNextWidth - scrollbarXOffset - thumbXOffset;
				const scrollRatioX = scrollLeft / (scrollableContentWidth - viewportWidth);

				// In Safari, don't allow it to go negative or too far as `scrollLeft` considers the rubber
				// band effect.
				const thumbOffsetX =
					direction === 'rtl'
						? clamp(scrollRatioX * maxThumbOffsetX, -maxThumbOffsetX, 0)
						: clamp(scrollRatioX * maxThumbOffsetX, 0, maxThumbOffsetX);

				thumbX.style.transform = `translate3d(${thumbOffsetX}px,0,0)`;
			}

			if (corner) {
				if (scrollbarXHidden || scrollbarYHidden) {
					setCornerSize({ width: 0, height: 0 });
				} else if (!scrollbarXHidden && !scrollbarYHidden) {
					const width = scrollbarY?.offsetWidth || 0;
					const height = scrollbarX?.offsetHeight || 0;
					setCornerSize((prevSize) => {
						if(prevSize.width === width && prevSize.height === height) {
							return prevSize
						}
						return { width, height }
					} );
				}
			}

			setHiddenState(prevState => {
				const cornerHidden = scrollbarYHidden || scrollbarXHidden;

				if (
					prevState.scrollbarYHidden === scrollbarYHidden &&
					prevState.scrollbarXHidden === scrollbarXHidden &&
					prevState.cornerHidden === cornerHidden
				) {
					return prevState;
				}

				return {
					scrollbarYHidden,
					scrollbarXHidden,
					cornerHidden,
				};
			});
		});

		const localProps: HTMLProps = {
			className: styles['base-scroll-area'],
			role: 'presentation',
			onPointerEnter: handlePointerEnterOrMove,
			onPointerMove: handlePointerEnterOrMove,
			onPointerDown(event) {
				setTouchModality(event.pointerType === 'touch');
			},
			onPointerLeave() {
				setHovering(false);
			},
			style: {
				[ScrollAreaRootCssVars.scrollAreaCornerHeight as string]: `${cornerSize.height}px`,
				[ScrollAreaRootCssVars.scrollAreaCornerWidth as string]: `${cornerSize.width}px`,
			},
		};

		const element = useRenderElement('div', {
			className,
			ref: forwardedRef,
			props: [localProps, otherProps],
		});

		const contextValue = React.useMemo(
			() => ({
				handlePointerDown,
				handlePointerMove,
				handlePointerUp,
				handleScroll,
				computeThumbPosition,
				thumbSize,
				touchModality,
				cornerRef,
				scrollingX,
				setScrollingX,
				scrollingY,
				setScrollingY,
				hovering,
				setHovering,
				viewportRef,
				scrollbarYRef,
				scrollbarXRef,
				thumbYRef,
				thumbXRef,
				hiddenState,
			}),
			[
				handlePointerDown,
				handlePointerMove,
				handlePointerUp,
				handleScroll,
				computeThumbPosition,
				thumbSize,
				touchModality,
				cornerRef,
				scrollingX,
				setScrollingX,
				scrollingY,
				setScrollingY,
				hovering,
				setHovering,
				viewportRef,
				scrollbarYRef,
				scrollbarXRef,
				thumbYRef,
				thumbXRef,
				hiddenState,
			]
		);

		return (
			<ScrollAreaRootContext.Provider value={contextValue}>
				{element}
			</ScrollAreaRootContext.Provider>
		);
	}
);

export namespace ScrollAreaRoot {
	export interface Props extends ModernComponentProps<'div'> {}
}
