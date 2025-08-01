import * as React from 'react';
import {
	arrow,
	autoUpdate,
	flip,
	offset,
	Placement,
	safePolygon,
	shift,
	useClick,
	useClientPoint,
	useDelayGroup,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useTransitionStatus,
} from '@floating-ui/react';
import { TooltipRootContext } from './tooltip-root-context';
import { useEventCallback, useLongTouch, useTimeout, useTouchDevice } from '@/shared/hooks';

export const TooltipRoot = (props: TooltipRoot.Props) => {
	const {
		children,
		placement = 'top',
		initialOpen = false,
		open: externalOpen,
		setOpen: externalSetOpen,
		animationDuration = 200,
		referenceRef,
		offset: offsetValueProp,
		flipPadding = 5,
		interactive = true,
		followCursor,
		describeChild = false,
		disableClick = true,
		disableFocus,
		disableHover,
		disableLongTouch,
		openTimeAfterLongTouch = 5000,
		closeOnOutsidePress = true,
		delay,
	} = props;

	const [popupId, setPopupId] = React.useState<string | undefined>(undefined)
	const [internalOpen, internalSetOpen] = React.useState<boolean>(initialOpen);
	const [showArrow, setShowArrow] = React.useState<boolean>(false);
	const [arrowPadding, setArrowPadding] = React.useState<number>(0);

	const arrowRef = React.useRef<HTMLSpanElement>(null);

	const timeoutAfterOpenWithLongTouch = useTimeout()

	const open = externalOpen ?? internalOpen;
	const setOpen = externalSetOpen ?? internalSetOpen;

	const offsetValue = offsetValueProp ?? (showArrow ? 12 : 5)
	const isUncontrolled = externalSetOpen == null

	const { context, refs } = useFloating({
		placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(offsetValue),
			flip({
				crossAxis: placement.includes('-'),
				fallbackAxisSideDirection: 'start',
				padding: flipPadding,
			}),
			shift({ padding: offsetValue }),
			showArrow
				? arrow({
						element: arrowRef,
						padding: arrowPadding,
					})
				: null,
		],
	});

	const { delay: groupDelay, currentId, isInstantPhase } = useDelayGroup(context, { id: context.floatingId });
	const { isTouchDevice } = useTouchDevice();

	const clientPoint = useClientPoint(context, {
		enabled: !isTouchDevice && followCursor,
	});
	const hover = useHover(context, {
		delay: groupDelay === 0 ? delay : groupDelay,
		enabled: !disableHover && !isTouchDevice && isUncontrolled,
		move: followCursor,
		handleClose: interactive ? safePolygon() : undefined,
	});
	const focus = useFocus(context, {
		enabled: !disableFocus && !isTouchDevice && isUncontrolled,
	});
	const click = useClick(context, {
		enabled: !disableClick && isUncontrolled,
	});
	const dismiss = useDismiss(context, { enabled: closeOnOutsidePress });

	const { getFloatingProps, getReferenceProps } = useInteractions([
		hover,
		focus,
		click,
		dismiss,
		clientPoint,
	]);

	const enabledLongTouch = isTouchDevice && !disableLongTouch && disableClick

	const { onTouchStart, onTouchEnd } = useLongTouch({
		callback: () => setOpen(true),
		enabled: enabledLongTouch,
	});

	const handleTouchStart = useEventCallback(() => {
		if(enabledLongTouch) {
			onTouchStart()
			timeoutAfterOpenWithLongTouch.clear()
		}
	})
	
	const handleTouchEnd = useEventCallback(() => {
		onTouchEnd()

		if (enabledLongTouch && open) {
			timeoutAfterOpenWithLongTouch.start(openTimeAfterLongTouch, () => setOpen(false))
		}
	})

	const instantDuration = 0;

	const { isMounted, status } = useTransitionStatus(context, {
		duration: isInstantPhase
			? {
					open: instantDuration,
					close:
						currentId === context.floatingId
							? typeof animationDuration === 'number'
								? animationDuration
								: animationDuration.close
							: instantDuration,
				}
			: animationDuration,
	});

	React.useEffect(() => {
		if (referenceRef) {
			refs.setReference(referenceRef.current);
		}
	}, [referenceRef, refs]);

	const contextValue: TooltipRootContext = React.useMemo(
		() => ({
			mounted: isMounted,
			open,
			setOpen,
			floatingContext: context,
			getFloatingProps,
			getReferenceProps,
			setFloating: refs.setFloating,
			setReference: refs.setReference,
			arrowRef,
			setArrowPadding,
			setShowArrow,
			onTouchEnd: handleTouchEnd,
			onTouchStart: handleTouchStart,
			interactive,
			describeChild,
			popupId,
			setPopupId,
			instantPhase: isInstantPhase,
			status: status === 'open' ? 'open' : status === 'close' ? 'close' : undefined,
		}),
		[
			open,
			setOpen,
			context,
			getFloatingProps,
			getReferenceProps,
			refs.setFloating,
			refs.setReference,
			handleTouchEnd,
			handleTouchStart,
			interactive,
			describeChild,
			popupId,
			setPopupId,
			isInstantPhase,
			isMounted,
			status,
		]
	);

	return (
		<TooltipRootContext.Provider value={contextValue}>{children}</TooltipRootContext.Provider>
	);
};

export namespace TooltipRoot {
	export interface Props {
		children: React.ReactNode;
		initialOpen?: boolean;
		open?: boolean;
		setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
		/**
		 * @default 'bottom-start'
		 */
		placement?: Placement;
		/**
		 * @default false
		 */
		delay?: number | { open: number; close: number };
		/**
		 * Добавляет aria-describedby на trigger
		 * @default false
		 */
		describeChild?: boolean;
		/**
		 * @default false
		 */
		/**
		 * @default true
		 */
		interactive?: boolean;
		followCursor?: boolean;
		/**
		 * @default 200
		 */
		animationDuration?: number | { open: number; close: number };
		/**
		 * @description 'Если не используем TooltipTrigger, то нужно передать referenceRef для позиционирования'
		 */
		referenceRef?: React.RefObject<HTMLElement | null>;
		/**
		 * 'Расстояние от trigger до popup'
		 * @default 'withArrow : 12, withoutArrow: 5'
		 */
		offset?: number;
		/**
		 * @default 5
		 * @description 'Расстояние от края экрана, при котором происходит переворачивание'
		 */
		flipPadding?: number;
		disableHover?: boolean;
		disableFocus?: boolean;
		/**
		 * @default true
		 * @description Чтобы открывать tooltip по клику, передайте disabledClick = false, disabledHover = true, disabledFocus = true
		 */
		disableClick?: boolean;
		/**
		 * @description LongTouch включен на сенсорных устройствах, когда disableClick = true
		 */
		disableLongTouch?: boolean
		/**
		 * ms
		 * @default 5000
		 */
		openTimeAfterLongTouch?: number
		/**
		 * @default true
		 */
		closeOnOutsidePress?: boolean
	}
}
