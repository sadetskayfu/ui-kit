import * as React from 'react';
import {
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
	useTransitionStatus,
} from '@floating-ui/react';
import { DrawerRootContext } from './drawer-root-context';
import { EMPTY_ARRAY } from '@/shared/constants';

export const DrawerRoot = (props: DrawerRoot.Props) => {
	const {
		children,
		position = 'bottom',
		initialOpen = false,
		open: externalOpen,
		setOpen: externalSetOpen,
		modal = true,
		initialFocus,
		returnFocus = true,
		removeScroll = true,
		animationDuration = 200,
		closeOnFocusOut = true,
		closeOnOutsidePress = true,
		snapPoints = EMPTY_ARRAY,
		initialSnapPointIndex = 0
	} = props;

	const [internalOpen, internalSetOpen] = React.useState<boolean>(initialOpen);
	const [titleId, setTitleId] = React.useState<string | undefined>();
	const [descriptionId, setDescriptionId] = React.useState<string | undefined>();

	const closeElementRef = React.useRef<HTMLElement>(null);

	const open = externalOpen ?? internalOpen;
	const setOpen = externalSetOpen ?? internalSetOpen;

	const { context, refs } = useFloating({
		open,
		onOpenChange: setOpen,
	});

	const click = useClick(context);
	const dismiss = useDismiss(context, { outsidePress: closeOnOutsidePress });
	const role = useRole(context, { role: 'dialog' });

	const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role]);

	const { isMounted, status } = useTransitionStatus(context, {
		duration: animationDuration,
	});

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

	const contextValue: DrawerRootContext = React.useMemo(
		() => ({
			open,
			setOpen,
			mounted: isMounted,
			modal,
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
			closeOnFocusOut,
			position,
			snapPoints,
			initialSnapPointIndex
		}),
		[
			open,
			setOpen,
			isMounted,
			modal,
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
			closeOnFocusOut,
			position,
			snapPoints,
			initialSnapPointIndex
		]
	);

	return <DrawerRootContext.Provider value={contextValue}>{children}</DrawerRootContext.Provider>;
};

export namespace DrawerRoot {
	export type SnapPoint = { type: 'percent', value: number } | { type: 'pixel', value: number }

	export interface Props {
		children: React.ReactNode;
		initialOpen?: boolean;
		open?: boolean;
		setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
		/**
		 *	@example [150px, 300px, 1]
		 */
		snapPoints?: (string | number)[]
		initialSnapPointIndex?: number
		/**
		 * @default 'bottom'
		 */
		position?: 'top' | 'right' | 'bottom' | 'left'
		/**
		 * @description 'Елси не передан проп initalFocus, фокус устанавлвиается на DrawerClose, если нету DrawerClose, фокус устанавливается на DrawerPopup'
		 */
		initialFocus?: number | React.RefObject<HTMLElement | null>;
		/**
		 * @default true
		 * @description 'Return focus on trigger element'
		 */
		returnFocus?: boolean | React.RefObject<HTMLElement | null>;
		/**
		 * @default true
		 */
		removeScroll?: boolean;
		/**
		 * @default true
		 */
		modal?: boolean
		/**
		 * @default 200
		 */
		animationDuration?: number | { open: number; close: number };
		/**
		 * @default true
		 */
		closeOnFocusOut?: boolean
		/**
		 * @default true
		 */
		closeOnOutsidePress?: boolean
	}
}
