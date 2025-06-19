import { useLongTouch, useTouchDevice } from '@/shared/hooks';
import {
	offset,
	type Placement,
	useFloating,
	shift,
	flip,
	arrow,
	autoUpdate,
	useHover,
	useFocus,
	useClick,
	useInteractions,
	useClientPoint,
	useDismiss,
	safePolygon,
	useDelayGroup,
} from '@floating-ui/react';
import { useId, useMemo, useRef, useState } from 'react';

export interface UseTooltipProps {
	id?: string // If we don't using TooltipTrigger, we can provider id for content body, for using aria-describedby
	describeChild?: boolean;
	interactive?: boolean;
	placement?: Placement;
	delay?: number | Partial<{ open: number; close: number }>;
	offset?: number;
	arrowPadding?: number;
	flipPadding?: number;
	disableHover?: boolean;
	disableFocus?: boolean;
	disableTouch?: boolean;
	disableClick?: boolean;
	followCursor?: boolean;
	portalTarget?: React.RefObject<HTMLElement | null>;
	referenceRef?: React.RefObject<HTMLElement | null>; // If we don't using TooltipTrigger, we can use external component (referenceRef need for tooltip position)
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useTooltip = (props: UseTooltipProps) => {
	const {
		id,
		describeChild,
		interactive: isInteractive = false,
		placement = 'top',
		delay,
		offset: offsetValue = 12,
		flipPadding = 5,
		arrowPadding = 10,
		disableHover = false,
		disableFocus = false,
		disableClick = true,
		disableTouch = false,
		followCursor: isFollowCursor = false,
		portalTarget,
		referenceRef,
		open: controlledOpen,
		setOpen: setControlledOpen,
	} = props;

	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(false);
	const localId = useId();
	const tooltipId = id ?? localId
	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = setControlledOpen ?? setUncontrolledOpen;
	const isUncontrolled = controlledOpen == null;

	const arrowRef = useRef<HTMLSpanElement>(null);

	const { isTouchDevice } = useTouchDevice();

	const data = useFloating({
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
			shift({ padding: flipPadding }),
			arrow({
				element: arrowRef,
				padding: arrowPadding,
			}),
		],
	});

	const context = data.context;

	const { delay: groupDelay } = useDelayGroup(context);

	const clientPoint = useClientPoint(context, {
		enabled: !isTouchDevice && isFollowCursor && isUncontrolled,
	});
	const hover = useHover(context, {
		delay: groupDelay === 0 ? delay : groupDelay,
		enabled: !disableHover && !isTouchDevice && isUncontrolled,
		move: isFollowCursor,
		handleClose: isInteractive ? safePolygon() : undefined,
	});
	const focus = useFocus(context, {
		enabled: !disableFocus && !isTouchDevice && isUncontrolled,
	});
	const click = useClick(context, {
		enabled: !disableClick && isUncontrolled,
	});
	const dismiss = useDismiss(context);

	const { handleTouchStart, handleTouchEnd } = useLongTouch({
		onTouchStart: () => setOpen(true),
		onTouchEnd: () => setOpen(false),
		enabled: isTouchDevice && !disableTouch && disableClick && isUncontrolled,
	});

	const interactions = useInteractions([hover, focus, click, dismiss, clientPoint]);

	return useMemo(
		() => ({
			open,
			setOpen,
			handleTouchStart,
			handleTouchEnd,
			arrowRef,
			tooltipId,
			portalTarget,
			describeChild,
			isInteractive,
			referenceRef,
			...data,
			...interactions,
		}),
		[
			open,
			setOpen,
			handleTouchStart,
			handleTouchEnd,
			tooltipId,
			portalTarget,
			data,
			interactions,
			describeChild,
			isInteractive,
			referenceRef,
		]
	);
};
