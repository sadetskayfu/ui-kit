import {
	type Placement,
	useFloating,
	flip,
	shift,
	autoUpdate,
	useClick,
	useDismiss,
	useRole,
	useInteractions,
	arrow,
	offset,
} from '@floating-ui/react';
import { useMemo, useRef, useState } from 'react';

export interface UsePopoverProps {
	placement?: Placement;
	offset?: number;
	flipPadding?: number;
	arrowPadding?: number;
	modal?: boolean;
	labelId?: string; // If we don't using PopoverHeading, we can provider labelId for aria-labelledby
	initialFocus?: number | React.RefObject<HTMLElement | null>; // By default on the content body
	returnFocus?: boolean | React.RefObject<HTMLElement | null>; // By default on reference element
	portalTargetRef?: React.RefObject<HTMLElement | null>;
	referenceRef?: React.RefObject<HTMLElement | null>; // If we don't using PopoverTrigger, we can use external component (referenceRef need for popover position)
	removeScroll?: boolean;
	arrow?: boolean;
	initialOpen?: boolean;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const usePopover = (props: UsePopoverProps) => {
	const {
		placement = 'bottom',
		offset: offsetValue = 5,
		flipPadding = 5,
		arrowPadding = 10,
		initialOpen = false,
		modal = false,
		labelId: externalLabelId,
		initialFocus,
		returnFocus = true,
		portalTargetRef,
		referenceRef,
		removeScroll = false,
		arrow: showArrow,
		open: controlledOpen,
		setOpen: setControlledOpen,
	} = props;

	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(initialOpen);
	const [labelId, setLabelId] = useState<string | undefined>(externalLabelId);
	const [descriptionId, setDescriptionId] = useState<string | undefined>();

	const open = controlledOpen ?? uncontrolledOpen;
	const setOpen = setControlledOpen ?? setUncontrolledOpen;

	const arrowRef = useRef<HTMLSpanElement>(null);

	const data = useFloating({
		placement,
		open,
		onOpenChange: setOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(offsetValue),
			flip({
				crossAxis: placement.includes('-'),
				fallbackAxisSideDirection: 'end',
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

	const context = data.context;

	const click = useClick(context, {
		enabled: controlledOpen == null,
	});
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: 'dialog' });

	const interactions = useInteractions([click, dismiss, role]);

	return useMemo(
		() => ({
			open,
			setOpen,
			...interactions,
			...data,
			referenceRef,
			modal,
			removeScroll,
			showArrow,
			arrowRef,
			initialFocus,
			returnFocus,
			portalTargetRef,
			labelId,
			descriptionId,
			setLabelId,
			setDescriptionId,
		}),
		[
			open,
			setOpen,
			showArrow,
			arrowRef,
			interactions,
			data,
			referenceRef,
			removeScroll,
			modal,
			initialFocus,
			returnFocus,
			portalTargetRef,
			labelId,
			descriptionId,
		]
	);
};
