import * as React from 'react';
import { HTMLProps, ModernComponentProps } from '@/shared/helpers/types';
import { activeElement, contains, getTarget } from '@floating-ui/react/utils';
import { DATA_SWIPE_IGNORE } from '../constants';
import { getElementTransform } from '../helpers/get-element-transform';
import { getDisplacement } from '../helpers/get-displacement';
import { ToastRootCssVars } from './toast-root-css-vars';
import { ToastRootContext } from './toast-root-context';
import { useAnimationsFinished, useEventCallback, useRenderElement } from '@/shared/hooks';
import { useToastProviderContext } from '../provider/toast-provider-context';
import { ownerDocument } from '@/shared/helpers/owner';
import { useToast } from '../use-toast';

const SWIPE_THRESHOLD = 40;
const REVERSE_CANCEL_THRESHOLD = 10;
const OPPOSITE_DIRECTION_DAMPING_FACTOR = 0.5;
const MIN_DRAG_THRESHOLD = 1;

/**
 * Renders a `<div>` element.
 */
export const ToastRoot = React.forwardRef(
	(props: ToastRoot.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const {
			render,
			className,
			toast,
			swipeDirection = ['down', 'right'],
			...otherProps
		} = props;

		const swipeDirections = Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection];

		const [titleId, setTitleId] = React.useState<string | undefined>(undefined);
		const [descriptionId, setDescriptionId] = React.useState<string | undefined>(undefined);
		const [isSwiping, setIsSwiping] = React.useState(false);
		const [isRealSwipe, setIsRealSwipe] = React.useState(false);
		const [dragDismissed, setDragDismissed] = React.useState(false);
		const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
		const [initialTransform, setInitialTransform] = React.useState({ x: 0, y: 0, scale: 1 });
		const [lockedDirection, setLockedDirection] = React.useState<
			'horizontal' | 'vertical' | null
		>(null);
		const [currentSwipeDirection, setCurrentSwipeDirection] = React.useState<
			'up' | 'down' | 'left' | 'right' | undefined
		>(undefined);

		const rootRef = React.useRef<HTMLElement>(null);
		const dragStartPosRef = React.useRef({ x: 0, y: 0 });
		const initialTransformRef = React.useRef({ x: 0, y: 0, scale: 1 });
		const cancelledSwipeRef = React.useRef<boolean>(false);
		const swipeCancelBaselineRef = React.useRef({ x: 0, y: 0 });
		const intendedSwipeDirectionRef = React.useRef<
			'up' | 'down' | 'left' | 'right' | undefined
		>(undefined);
		const maxSwipeDisplacementRef = React.useRef<number>(0);
		const isFirstPointerMoveRef = React.useRef<boolean>(false);

		const {
			toasts,
			setToasts,
			pauseTimers,
			resumeTimers,
			remove,
			close,
			focused,
			hovering,
			hasDifferingHeights,
		} = useToastProviderContext();

		const domIndex = React.useMemo(() => toasts.indexOf(toast), [toast, toasts]);
		const visibleIndex = React.useMemo(
			() => toasts.filter(t => t.transitionStatus !== 'ending').indexOf(toast),
			[toast, toasts]
		);
		const offsetY = React.useMemo(() => {
			return toasts
				.slice(0, toasts.indexOf(toast))
				.reduce((acc, toast) => acc + (toast.height || 0), 0);
		}, [toasts, toast]);

		// // Спорно
		// const onAnimationsFinished = useAnimationsFinished(
		// 	rootRef,
		// 	toast.transitionStatus !== 'ending'
		// );

		// React.useEffect(() => {
		// 	onAnimationsFinished(() => {
		// 		if (toast.transitionStatus === 'ending') {
		// 			remove(toast.id);
		// 		}
		// 	});
		// }, [remove, onAnimationsFinished, toast.id, toast.transitionStatus]);

		// const onAnimationsFinished = useAnimationsFinished(rootRef, true)

		console.log(toasts)

		// const onComplete = useEventCallback(() => {
		// 	if (toast.transitionStatus === 'ending') {
		// 		remove(toast.id)
		// 	}
		// })

		// React.useEffect(() => {
		// 	onAnimationsFinished(onComplete)
		// }, [onAnimationsFinished, onComplete])

		React.useEffect(() => {
			if (!rootRef.current) {
				return undefined;
			}

			function setHeights() {
				const height = rootRef.current?.offsetHeight;

				setToasts(prev =>
					prev.map(t =>
						t.id === toast.id
							? {
									...t,
									ref: rootRef,
									height,
									transitionStatus: undefined,
								}
							: t
					)
				);
			}

			setHeights();

			if (typeof ResizeObserver === 'function') {
				const resizeObserver = new ResizeObserver(setHeights);
				resizeObserver.observe(rootRef.current);

				return () => {
					resizeObserver.disconnect();
				};
			}

			return undefined;
		}, [toast.id, setToasts]);

		const applyDirectionalDamping = (deltaX: number, deltaY: number) => {
			let newDeltaX = deltaX;
			let newDeltaY = deltaY;

			if (!swipeDirections.includes('left') && !swipeDirections.includes('right')) {
				newDeltaX =
					deltaX > 0
						? deltaX ** OPPOSITE_DIRECTION_DAMPING_FACTOR
						: -(Math.abs(deltaX) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
			} else {
				if (!swipeDirections.includes('right') && deltaX > 0) {
					newDeltaX = deltaX ** OPPOSITE_DIRECTION_DAMPING_FACTOR;
				}
				if (!swipeDirections.includes('left') && deltaX < 0) {
					newDeltaX = -(Math.abs(deltaX) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
				}
			}

			if (!swipeDirections.includes('up') && !swipeDirections.includes('down')) {
				newDeltaY =
					deltaY > 0
						? deltaY ** OPPOSITE_DIRECTION_DAMPING_FACTOR
						: -(Math.abs(deltaY) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
			} else {
				if (!swipeDirections.includes('down') && deltaY > 0) {
					newDeltaY = deltaY ** OPPOSITE_DIRECTION_DAMPING_FACTOR;
				}
				if (!swipeDirections.includes('up') && deltaY < 0) {
					newDeltaY = -(Math.abs(deltaY) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
				}
			}

			return { x: newDeltaX, y: newDeltaY };
		};

		const handlePointerDown = (event: React.PointerEvent) => {
			if (event.button !== 0) {
				return;
			}

			if (event.pointerType === 'touch') {
				pauseTimers();
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

			cancelledSwipeRef.current = false;
			intendedSwipeDirectionRef.current = undefined;
			maxSwipeDisplacementRef.current = 0;
			dragStartPosRef.current = { x: event.clientX, y: event.clientY };
			swipeCancelBaselineRef.current = dragStartPosRef.current;

			if (rootRef.current) {
				const transform = getElementTransform(rootRef.current);
				initialTransformRef.current = transform;
				setInitialTransform(transform);
				setDragOffset({ x: transform.x, y: transform.y });
			}

			setIsSwiping(true);
			setIsRealSwipe(false);
			setLockedDirection(null);
			isFirstPointerMoveRef.current = true;

			rootRef.current?.setPointerCapture(event.pointerId);
		};

		const handlePointerMove = (event: React.PointerEvent) => {
			if (!isSwiping) {
				return;
			}
			
			event.preventDefault();

			if (isFirstPointerMoveRef.current) {
				dragStartPosRef.current = { x: event.clientX, y: event.clientY };
				isFirstPointerMoveRef.current = false;
			}

			const { clientX, clientY, movementX, movementY } = event;

			// set vertical cancel baseline
			if (
				(movementY < 0 && clientY > swipeCancelBaselineRef.current.y) ||
				(movementY > 0 && clientY < swipeCancelBaselineRef.current.y)
			) {
				swipeCancelBaselineRef.current = {
					x: swipeCancelBaselineRef.current.x,
					y: clientY,
				};
			}

			// set horizontal cancel baseline
			if (
				(movementX < 0 && clientX > swipeCancelBaselineRef.current.x) ||
				(movementX > 0 && clientX < swipeCancelBaselineRef.current.x)
			) {
				swipeCancelBaselineRef.current = {
					x: clientX,
					y: swipeCancelBaselineRef.current.y,
				};
			}

			const deltaX = clientX - dragStartPosRef.current.x;
			const deltaY = clientY - dragStartPosRef.current.y;
			const cancelDeltaX = clientX - swipeCancelBaselineRef.current.x;
			const cancelDeltaY = clientY - swipeCancelBaselineRef.current.y;

			if (!isRealSwipe) {
				const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

				if (movementDistance >= MIN_DRAG_THRESHOLD) {
					setIsRealSwipe(true);

					if (lockedDirection === null) {
						const hasHorizontal =
							swipeDirections.includes('left') || swipeDirections.includes('right');
						const hasVertical =
							swipeDirections.includes('up') || swipeDirections.includes('down');

						if (hasHorizontal && hasVertical) {
							setLockedDirection(
								Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical'
							);
						}
					}
				}
			}

			let intendedSwipeDirection: 'up' | 'down' | 'left' | 'right' | undefined;

			if (!intendedSwipeDirectionRef.current) {
				if (lockedDirection === 'horizontal') {
					if (deltaX > 0) {
						intendedSwipeDirection = 'right';
					} else if (deltaX < 0) {
						intendedSwipeDirection = 'left';
					}
				} else if (lockedDirection === 'vertical') {
					if (deltaY > 0) {
						intendedSwipeDirection = 'down';
					} else if (deltaY < 0) {
						intendedSwipeDirection = 'up';
					}
				} else if (Math.abs(deltaX) >= Math.abs(deltaY)) {
					intendedSwipeDirection = deltaX > 0 ? 'right' : 'left';
				} else {
					intendedSwipeDirection = deltaY > 0 ? 'down' : 'up';
				}
			}

			if (intendedSwipeDirection && swipeDirections.includes(intendedSwipeDirection)) {
				intendedSwipeDirectionRef.current = intendedSwipeDirection;
				maxSwipeDisplacementRef.current = getDisplacement(
					intendedSwipeDirection,
					deltaX,
					deltaY
				);
				setCurrentSwipeDirection(intendedSwipeDirection);
			} else {
				const direction = intendedSwipeDirectionRef.current;
				const currentDisplacement = getDisplacement(direction, cancelDeltaX, cancelDeltaY);
				if (currentDisplacement > SWIPE_THRESHOLD) {
					cancelledSwipeRef.current = false;
					setCurrentSwipeDirection(direction);
				} else if (
					maxSwipeDisplacementRef.current - currentDisplacement >=
					REVERSE_CANCEL_THRESHOLD
				) {
					cancelledSwipeRef.current = true;
				}
			}

			const dampedDelta = applyDirectionalDamping(deltaX, deltaY);
			let newOffsetX = initialTransformRef.current.x;
			let newOffsetY = initialTransformRef.current.y;

			if (lockedDirection === 'horizontal') {
				if (swipeDirections.includes('left') || swipeDirections.includes('right')) {
					newOffsetX += dampedDelta.x;
				}
			} else if (lockedDirection === 'vertical') {
				if (swipeDirections.includes('up') || swipeDirections.includes('down')) {
					newOffsetY += dampedDelta.y;
				}
			} else {
				if (swipeDirections.includes('left') || swipeDirections.includes('right')) {
					newOffsetX += dampedDelta.x;
				}
				if (swipeDirections.includes('up') || swipeDirections.includes('down')) {
					newOffsetY += dampedDelta.y;
				}
			}

			setDragOffset({ x: newOffsetX, y: newOffsetY });
		};

		const handlePointerUp = (event: React.PointerEvent) => {
			if (!isSwiping) {
				return;
			}

			if (event.pointerType === 'touch' && !focused) {
				resumeTimers();
			}

			setIsSwiping(false);
			setIsRealSwipe(false);
			setLockedDirection(null);

			rootRef.current?.releasePointerCapture(event.pointerId);

			if (cancelledSwipeRef.current) {
				setDragOffset({ x: initialTransform.x, y: initialTransform.y });
				setCurrentSwipeDirection(undefined);
				return;
			}

			let shouldClose = false;
			const deltaX = dragOffset.x - initialTransform.x;
			const deltaY = dragOffset.y - initialTransform.y;
			let dismissDirection: 'up' | 'down' | 'left' | 'right' | undefined;

			for (const direction of swipeDirections) {
				switch (direction) {
					case 'right':
						if (deltaX > SWIPE_THRESHOLD) {
							shouldClose = true;
							dismissDirection = 'right';
						}
						break;
					case 'left':
						if (deltaX < -SWIPE_THRESHOLD) {
							shouldClose = true;
							dismissDirection = 'left';
						}
						break;
					case 'down':
						if (deltaY > SWIPE_THRESHOLD) {
							shouldClose = true;
							dismissDirection = 'down';
						}
						break;
					case 'up':
						if (deltaY < -SWIPE_THRESHOLD) {
							shouldClose = true;
							dismissDirection = 'up';
						}
						break;
					default:
						break;
				}
				if (shouldClose) {
					break;
				}
			}

			if (shouldClose) {
				setCurrentSwipeDirection(dismissDirection);
				setDragDismissed(true);
				close(toast.id)
			} else {
				setDragOffset({ x: initialTransform.x, y: initialTransform.y });
				setCurrentSwipeDirection(undefined);
			}
		};

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (event.key === 'Escape') {
				if (
					!rootRef.current ||
					!contains(rootRef.current, activeElement(ownerDocument(rootRef.current)))
				) {
					return;
				}
				close(toast.id);
			}
		};

		React.useEffect(() => {
			const element = rootRef.current;
			
			if (!element) {
			  return undefined;
			}
		
			function preventDefaultTouchStart(event: TouchEvent) {
			  if (contains(element, event.target as HTMLElement | null)) {
				event.preventDefault();
			  }
			}
		
			element.addEventListener('touchmove', preventDefaultTouchStart, { passive: false });
			return () => {
			  element.removeEventListener('touchmove', preventDefaultTouchStart);
			};
		  }, []);

		const getDragStyles = () => {
			if (
				!isSwiping &&
				dragOffset.x === initialTransform.x &&
				dragOffset.y === initialTransform.y &&
				!dragDismissed
			) {
				return {
					[ToastRootCssVars.swipeMovementX]: '0px',
					[ToastRootCssVars.swipeMovementY]: '0px',
				};
			}

			const deltaX = dragOffset.x - initialTransform.x;
			const deltaY = dragOffset.y - initialTransform.y;

			return {
				transition: isSwiping ? 'none' : undefined,
				[ToastRootCssVars.swipeMovementX]: `${deltaX}px`,
				[ToastRootCssVars.swipeMovementY]: `${deltaY}px`,
			};
		};

		const localProps: HTMLProps = {
			role: toast.priority === 'high' ? 'alertdialog' : 'dialog',
			tabIndex: 0,
			'aria-modal': 'false',
			'aria-labelledby': titleId,
			'aria-describedby': descriptionId,
			onPointerDown: handlePointerDown,
			onPointerMove: handlePointerMove,
			onPointerUp: handlePointerUp,
			onKeyDown: handleKeyDown,
			onTransitionEnd: (event) => {
				if(toast.transitionStatus === 'ending') {
					remove(toast.id)
				}
			},
			inert: toast.limited ? true : undefined,
			style: {
				...getDragStyles(),
				[ToastRootCssVars.index]:
					toast.transitionStatus === 'ending' ? domIndex : visibleIndex,
				[ToastRootCssVars.offsetY]: `${offsetY}px`,
			},
		};

		const contextValue: ToastRootContext = React.useMemo(
			() => ({
				rootRef,
				toast,
				titleId,
				setTitleId,
				descriptionId,
				setDescriptionId,
				swipeDirection: currentSwipeDirection,
			}),
			[titleId, descriptionId, currentSwipeDirection, toast]
		);

		const state: ToastRoot.State = React.useMemo(
			() => ({
				transitionStatus: toast.transitionStatus,
				expanded: hovering || focused || hasDifferingHeights,
				limited: toast.limited || false,
				swiping: isSwiping,
				swipeDirection: currentSwipeDirection
			}),
			[toast.limited, toast.transitionStatus, isSwiping, hovering, focused, hasDifferingHeights, currentSwipeDirection]
		);

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, rootRef],
			props: [localProps, otherProps],
		});

		return (
			<ToastRootContext.Provider value={contextValue}>{element}</ToastRootContext.Provider>
		);
	}
);

export namespace ToastRoot {
	export interface State {
		transitionStatus: 'starting' | 'ending' | undefined;
		/**
		 * Открыт ли сейчас тост
		 */
		expanded: boolean;
		/**
		 * Был ли удален тост, из за превышения лимита
		 */
		limited: boolean;
		/**
		 * Находится ли тост сейчас в свайпе
		 */
		swiping: boolean;
		/**
		 * Текущее направление свайпа
		 */
		swipeDirection: 'up' | 'down' | 'left' | 'right' | undefined;
	}

	export interface Props extends ModernComponentProps<'div', State> {
		toast: useToast.Toast;
		/**
		 * Направление(я) свайпа для закрытия тоста
		 * @default ['down', 'right']
		 */
		swipeDirection?: 'up' | 'down' | 'left' | 'right' | ('up' | 'down' | 'left' | 'right')[];
	}
}
