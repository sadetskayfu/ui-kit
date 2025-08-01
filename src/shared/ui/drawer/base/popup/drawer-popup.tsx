import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { FloatingFocusManager } from '@floating-ui/react';
import { useDrawerRootContext } from '../root/drawer-root-context';
import { RemoveScroll } from 'react-remove-scroll';
import { getTarget } from '@floating-ui/react/utils';
import { DATA_SWIPE_IGNORE } from '@/shared/constants';
import { getElementTransform } from '@/shared/helpers/get-element-transform';
import { DrawerPopupCssVars } from './drawer-popup-css-vars';
import { getDigits } from '@/shared/lib/strings';

const SWIPE_THRESHOLD = 0.35;
const OPPOSITE_DIRECTION_DAMPING_FACTOR = 0.5;
const MIN_SWIPE_DISTANCE = 20;
const MAX_FAST_SWIPE_TIME = 200;
const FOOTER_HEIGHT = 100

function findClosestNumber(arr: number[], targetValue: number) {
	if (arr.length === 0) return null;

	let closest = arr[0];
	let minDiff = Math.abs(targetValue - arr[0]);

	for (let i = 1; i < arr.length; i++) {
		const diff = Math.abs(targetValue - arr[i]);

		if (diff < minDiff) {
			minDiff = diff;
			closest = arr[i];
		}
	}
	return closest;
}

/**
 * Renders a `<div>` element.
 */
export const DrawerPopup = React.forwardRef(
	(props: DrawerPopup.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const {
			position,
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
			snapPoints: snapPointsProp,
			initialSnapPointIndex,
			setOpen,
			setFloating,
			getFloatingProps,
		} = useDrawerRootContext();

		const [isSwiping, setIsSwiping] = React.useState(false);
		const [dragDismissed, setDragDismissed] = React.useState(false);
		const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
		const [initialTransform, setInitialTransform] = React.useState({ x: 0, y: 0, scale: 1 });

		const [snapPoints, setSnapPoints] = React.useState<number[]>([]);
		const [activeSnapPointIndex, setActiveSnapPointIndex] = React.useState<number>(initialSnapPointIndex)

		const popupRef = React.useRef<HTMLDivElement | null>(null);
		const dragStartPosRef = React.useRef({ x: 0, y: 0 });
		const dragStartTimeRef = React.useRef<number | undefined>(undefined);
		const initialTransformRef = React.useRef({ x: 0, y: 0, scale: 1 });
		const popupVisibleSizeRef = React.useRef<{ width: number; height: number }>({
			width: 0,
			height: 0,
		});
		const isFirstPointerMoveRef = React.useRef<boolean>(false);

		const isVertical = position === 'bottom' || position === 'top';
		const initialFocus = initialFocusProp ?? closeElementRef ?? popupRef;

		const state: DrawerPopup.State = React.useMemo(
			() => ({
				status,
				position,
			}),
			[status, position]
		);

		useModernLayoutEffect(() => {
			if (
				typeof ResizeObserver === 'undefined' ||
				!popupRef.current ||
				snapPointsProp.length === 0
			) {
				return;
			}

			const popup = popupRef.current;
			

			function updateSnapPoints() {
				const popupHeight = popup.scrollHeight - (position === 'bottom' ? FOOTER_HEIGHT : 0);
				const popupWidth = popup.scrollWidth - (position === 'right' ? FOOTER_HEIGHT : 0)
				 
				const updatedSnapPoints = new Set<number>()

				snapPointsProp.forEach((snapPoint) => {
					if (typeof snapPoint === 'string') {
						const snapNumberValue = getDigits(snapPoint)?.[0] || 0;

						updatedSnapPoints.add(Math.min(snapNumberValue, isVertical ? popupHeight : popupWidth)) 
					} else {
						updatedSnapPoints.add((isVertical ? popupHeight : popupWidth) * snapPoint);
					}
				})

				const snapPointArray: number[] = []
			
				updatedSnapPoints.forEach((snapPoint) => {
					snapPointArray.push(snapPoint)
				})

				setActiveSnapPointIndex(prev => {
					if (snapPointArray.length - 1 < prev) {
						return snapPointArray.length - 1
					}

					return prev
				})

				setSnapPoints(snapPointArray);
			}

			const rs = new ResizeObserver(updateSnapPoints);

			rs.observe(popup);
			window.addEventListener('resize', updateSnapPoints);

			return () => {
				rs.disconnect();
				window.removeEventListener('resize', updateSnapPoints);
			};
		}, [snapPointsProp, isVertical, position]);

		const isFirstSnapPoint = () => {
			return activeSnapPointIndex === 0
		};
		const isLastSnapPoint = () => {
			return activeSnapPointIndex === snapPoints.length - 1
		};

		const getVisibleSize = () => {
			if (!popupRef.current) {
				return { width: 0, height: 0 };
			}

			const { left, right, bottom, top } = popupRef.current.getBoundingClientRect();

			const visibleLeft = Math.max(left, 0);
			const visibleRight = Math.min(right, window.innerWidth);
			const visibleTop = Math.max(top, 0);
			const visibleBottom = Math.min(bottom, window.innerHeight);

			return {
				width: Math.round(visibleRight - visibleLeft),
				height: Math.round(visibleBottom - visibleTop),
			};
		};

		const applyDirectionalDamping = (deltaX: number, deltaY: number) => {
			let newDeltaX = deltaX;
			let newDeltaY = deltaY;

			if (snapPoints.length > 0) {
				return { x: newDeltaX, y: newDeltaY };
			}

			if (position === 'bottom' && deltaY < 0) {
				newDeltaY = -(Math.abs(deltaY) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
			} else if (position === 'top' && deltaY > 0) {
				newDeltaY = deltaY ** OPPOSITE_DIRECTION_DAMPING_FACTOR;
			} else if (position === 'left' && deltaX > 0) {
				newDeltaX = deltaX ** OPPOSITE_DIRECTION_DAMPING_FACTOR;
			} else if (position === 'right' && deltaX < 0) {
				newDeltaX = -(Math.abs(deltaX) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
			}

			return { x: newDeltaX, y: newDeltaY };
		};

		const handlePointerDown = (event: React.PointerEvent) => {
			if (event.button !== 0) {
				return;
			}

			const target = getTarget(event.nativeEvent);

			const isInteractiveElement =
				target instanceof Element
					? target.closest(
							`button,a,input,textarea,[role="button"],[${DATA_SWIPE_IGNORE}]`
						)
					: false;

			if (isInteractiveElement) {
				return;
			}

			dragStartPosRef.current = { x: event.clientX, y: event.clientY };

			if (popupRef.current) {
				const transform = getElementTransform(popupRef.current);
				initialTransformRef.current = transform;

				popupVisibleSizeRef.current = getVisibleSize();

				setInitialTransform(transform);
				setDragOffset({ x: transform.x, y: transform.y });
			}

			setIsSwiping(true);
			dragStartTimeRef.current = performance.now();
			isFirstPointerMoveRef.current = true;

			popupRef.current?.setPointerCapture(event.pointerId);
		};

		const handlePointerMove = (event: React.PointerEvent) => {
			if (!isSwiping || !popupRef.current) {
				return;
			}

			event.preventDefault();

			if (isFirstPointerMoveRef.current) {
				dragStartPosRef.current = { x: event.clientX, y: event.clientY };
				dragStartTimeRef.current = performance.now();
				isFirstPointerMoveRef.current = false;
			}

			const { clientX, clientY } = event;

			const deltaX = clientX - dragStartPosRef.current.x;
			const deltaY = clientY - dragStartPosRef.current.y;

			if (snapPoints.length > 0) {
				const popupRect = popupRef.current.getBoundingClientRect();

				if (position === 'bottom' && deltaY < 0 && Math.round(popupRect.bottom) <= window.innerHeight) {
					return;
				}
				if (position === 'top' && deltaY > 0 && Math.round(popupRect.top) >= 0) {
					return;
				}
				if (position === 'right' && deltaX < 0 && Math.round(popupRect.right) <= window.innerWidth) {
					return;
				}
				if (position === 'left' && deltaX > 0 && Math.round(popupRect.left) >= 0) {
					return;
				}
			}

			const dampedDelta = applyDirectionalDamping(deltaX, deltaY);
			let newOffsetX = initialTransformRef.current.x;
			let newOffsetY = initialTransformRef.current.y;

			if (isVertical) {
				newOffsetY += dampedDelta.y;
			} else {
				newOffsetX += dampedDelta.x;
			}

			setDragOffset({ x: newOffsetX, y: newOffsetY });
		};

		const handlePointerUp = (event: React.PointerEvent) => {
			if (!isSwiping || !popupRef.current) {
				return;
			}

			setIsSwiping(false);

			popupRef.current.releasePointerCapture(event.pointerId);

			const deltaX = dragOffset.x - initialTransform.x;
			const deltaY = dragOffset.y - initialTransform.y;

			const isFastSwipe =
				dragStartTimeRef.current !== undefined
					? performance.now() - dragStartTimeRef.current < MAX_FAST_SWIPE_TIME
					: false;

			let shouldClose = false;

			if (snapPoints.length > 0) {
				let currentSwipeDirection: 'up' | 'down' | 'right' | 'left' | undefined = undefined;

				if (isVertical) {
					if (deltaY >= 0) {
						currentSwipeDirection = 'down';
					} else {
						currentSwipeDirection = 'up';
					}
				} else {
					if (deltaX >= 0) {
						currentSwipeDirection = 'right';
					} else {
						currentSwipeDirection = 'left';
					}
				}

				let direction: -1 | 1;
				let shouldUpdateActiveSnapPoint = false;

				if (isVertical && Math.abs(deltaY) > MIN_SWIPE_DISTANCE) {
					if (isFastSwipe) {
						if (currentSwipeDirection === (position === 'bottom' ? 'up' : 'down')) {
							if (!isLastSnapPoint()) {
								direction = 1;
								shouldUpdateActiveSnapPoint = true;
							}
						} else {
							if (!isFirstSnapPoint()) {
								direction = -1;
								shouldUpdateActiveSnapPoint = true;
							} else {
								shouldClose = true;
							}
						}
					} else {
						const { top, bottom } = popupRef.current.getBoundingClientRect();

						const closestSnap = findClosestNumber(
							snapPoints,
							position === 'bottom' ? window.innerHeight - top : bottom
						);

						if (typeof closestSnap === 'number') {
							setActiveSnapPointIndex(snapPoints.indexOf(closestSnap))
						}
					}
				}

				if (!isVertical && Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
					if (isFastSwipe) {
						if (currentSwipeDirection === (position === 'left' ? 'right' : 'left')) {
							if (!isLastSnapPoint()) {
								direction = 1;
								shouldUpdateActiveSnapPoint = true;
							}
						} else {
							if (!isFirstSnapPoint()) {
								direction = -1;
								shouldUpdateActiveSnapPoint = true;
							} else {
								shouldClose = true;
							}
						}
					} else {
						const { left, right } = popupRef.current.getBoundingClientRect();

						const closestSnap = findClosestNumber(
							snapPoints,
							position === 'left' ? right : window.innerWidth - left
						);

						if (typeof closestSnap === 'number') {
							setActiveSnapPointIndex(snapPoints.indexOf(closestSnap))
						}
					}
				}

				if (shouldUpdateActiveSnapPoint) {
					setActiveSnapPointIndex(prev => prev + direction)
				}
			}

			if (snapPoints.length === 0) {
				const visibleHeight = popupVisibleSizeRef.current.height;
				const visibleWidth = popupVisibleSizeRef.current.width;
				const longSwipeThreshold =
					SWIPE_THRESHOLD * (isVertical ? visibleHeight : visibleWidth);
				const swipeThreshold = isFastSwipe ? MIN_SWIPE_DISTANCE : longSwipeThreshold;

				if (position === 'bottom') {
					if (deltaY > swipeThreshold) {
						shouldClose = true;
					}
				} else if (position === 'top') {
					if (deltaY < -swipeThreshold) {
						shouldClose = true;
					}
				} else if (position === 'right') {
					if (deltaX > swipeThreshold) {
						shouldClose = true;
					}
				} else if (position === 'left') {
					if (deltaX < -swipeThreshold) {
						shouldClose = true;
					}
				}
			}

			dragStartTimeRef.current = undefined;
			popupVisibleSizeRef.current = { width: 0, height: 0 };

			if (shouldClose) {
				setDragDismissed(true);
				setOpen(false);
			} else {
				setDragOffset({ x: initialTransform.x, y: initialTransform.y });
			}
		};

		const getDragStyles = () => {
			if ( 
				!isSwiping &&
				dragOffset.x === initialTransform.x &&
				dragOffset.y === initialTransform.y &&
				!dragDismissed
			) {
				const activeSnapPoint = snapPoints[activeSnapPointIndex]

				return {
					[DrawerPopupCssVars.swipeMovementX]:
						position === 'right'
							? `calc(100% - ${activeSnapPoint}px)`
							: position === 'left'
								? `calc(-100% + ${activeSnapPoint}px)`
								: '0px',
					[DrawerPopupCssVars.swipeMovementY]:
						position === 'bottom'
							? `calc(100% - ${activeSnapPoint}px)`
							: position === 'top'
								? `calc(-100% + ${activeSnapPoint}px)`
								: '0px',
				};
			}

			const deltaX = dragOffset.x;
			const deltaY = dragOffset.y;

			return {
				transition: isSwiping ? 'none' : undefined,
				[DrawerPopupCssVars.swipeMovementX]: `${deltaX}px`,
				[DrawerPopupCssVars.swipeMovementY]: `${deltaY}px`,
			};
		};

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
					onPointerDown: handlePointerDown,
					onPointerMove: handlePointerMove,
					onPointerUp: handlePointerUp,
					style: {
						...getDragStyles(),
						[DrawerPopupCssVars.footerHeight as string]: `${FOOTER_HEIGHT}px`
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

export namespace DrawerPopup {
	export interface State {
		status: 'open' | 'close' | undefined;
		position: 'top' | 'right' | 'bottom' | 'left';
	}
	export interface Props extends ModernComponentProps<'div', State> {}
}
