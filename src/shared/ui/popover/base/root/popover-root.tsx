import * as React from 'react';
import {
	arrow,
	autoUpdate,
	flip,
	offset,
	Placement,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
	useTransitionStatus,
} from '@floating-ui/react';
import { PopoverRootContext } from './popover-root-context';

export const PopoverRoot = (props: PopoverRoot.Props) => {
	const {
		children,
		placement = 'bottom-start',
		initialOpen = false,
		open: externalOpen,
		setOpen: externalSetOpen,
		initialFocus,
		returnFocus = true,
		removeScroll = false,
		animationDuration = 200,
		modal = true,
		closeOnFocusOut = true,
		closeOnOutsidePress = true,
		referenceRef,
		offset: offsetValue = 5,
		flipPadding = 5,
	} = props;

	const [internalOpen, internalSetOpen] = React.useState<boolean>(initialOpen);
	const [titleId, setTitleId] = React.useState<string | undefined>();
	const [descriptionId, setDescriptionId] = React.useState<string | undefined>();
	const [showArrow, setShowArrow] = React.useState<boolean>(false);
	const [arrowPadding, setArrowPadding] = React.useState<number>(0);

	const closeElementRef = React.useRef<HTMLElement>(null);
	const arrowRef = React.useRef<HTMLSpanElement>(null);

	const open = externalOpen ?? internalOpen;
	const setOpen = externalSetOpen ?? internalSetOpen;

	const { context, refs } = useFloating({
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

	const click = useClick(context);
	const dismiss = useDismiss(context, { outsidePress: closeOnOutsidePress });
	const role = useRole(context, { role: 'dialog' });

	const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role]);

	const { isMounted, status } = useTransitionStatus(context, {
		duration: animationDuration,
	});

	React.useEffect(() => {
		if (referenceRef) {
			refs.setReference(referenceRef.current)
		}
	}, [referenceRef, refs])

	// FocusManager из floating-ui возвращает фокус после завершения анимации удаления, мы хотим вернуть фокус не дожидаясь завершения анимации
	React.useEffect(() => {
		if (status === 'close') {
			if (typeof returnFocus === 'boolean') {
				if (returnFocus) {
					const referenceEl = refs.reference.current as HTMLElement | null;
					referenceEl?.focus();
				}
			} else {
				returnFocus.current?.focus();
			}
		}
	}, [status, returnFocus, refs.reference]);

	const contextValue: PopoverRootContext = React.useMemo(
		() => ({
			open,
			setOpen,
			mounted: isMounted,
			status: status === 'open' ? 'open' : status === 'close' ? 'close' : undefined,
			titleId,
			setTitleId,
			descriptionId,
			setDescriptionId,
			floatingContext: context,
			getFloatingProps,
			getReferenceProps,
			setFloating: refs.setFloating,
			setReference: refs.setReference,
			initialFocus,
			returnFocus,
			removeScroll,
			closeElementRef,
			arrowRef,
			modal,
			closeOnFocusOut,
			setArrowPadding,
			setShowArrow
		}),
		[
			open,
			setOpen,
			isMounted,
			status,
			titleId,
			descriptionId,
			context,
			getFloatingProps,
			getReferenceProps,
			refs.setFloating,
			refs.setReference,
			initialFocus,
			returnFocus,
			removeScroll,
			modal,
			closeOnFocusOut,
		]
	);

	return (
		<PopoverRootContext.Provider value={contextValue}>{children}</PopoverRootContext.Provider>
	);
};

export namespace PopoverRoot {
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
		 * @description 'Елси не передан проп initalFocus, фокус устанавлвиается на PopoverClose, если нету PopoverClose, фокус устанавливается на PopoverPopup'
		 */
		initialFocus?: number | React.RefObject<HTMLElement | null>;
		/**
		 * @default true
		 * @description 'Return focus on trigger element'
		 */
		returnFocus?: boolean | React.RefObject<HTMLElement | null>;
		/**
		 * @default false
		 */
		removeScroll?: boolean;
		/**
		 * @default 200
		 */
		animationDuration?: number | { open: number; close: number };
		/**
		 * @default true
		 * @description 'При модальном режиме, фокус зациклен внутри popup'
		 */
		modal?: boolean;
		/**
		 * @default true
		 * @description 'Нужно ли закрыть dialog, если фокус выходит за его пределы, если dialog без modal'
		 */
		closeOnFocusOut?: boolean;
		/**
		 * @default true
		 */
		closeOnOutsidePress?: boolean;
		/**
		 * @description 'Если не используем PopoverTrigger, то нужно передать referenceRef для позиционирования'
		 */
		referenceRef?: React.RefObject<HTMLElement | null>;
		/**
		 * @default 5
		 * @description 'Расстояние от trigger до popup'
		 */
		offset?: number;
		/**
		 * @default 5
		 * @description 'Расстояние от края экрана, при котором происходит переворачивание'
		 */
		flipPadding?: number;
	} 
}
