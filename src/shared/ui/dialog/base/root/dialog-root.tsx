import * as React from 'react';
import {
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
	useTransitionStatus,
} from '@floating-ui/react';
import { DialogRootContext } from './dialog-root-context';

export const DialogRoot = (props: DialogRoot.Props) => {
	const {
		children,
		initialOpen = false,
		open: externalOpen,
		setOpen: externalSetOpen,
		role: roleProp = 'dialog',
		initialFocus,
		returnFocus = true,
		removeScroll = true,
		animationDuration = 200,
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
	const dismiss = useDismiss(context, { outsidePress: roleProp === 'dialog' });
	const role = useRole(context, { role: roleProp });

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

	const contextValue: DialogRootContext = React.useMemo(
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
		]
	);

	return <DialogRootContext.Provider value={contextValue}>{children}</DialogRootContext.Provider>;
};

export namespace DialogRoot {
	export interface Props {
		children: React.ReactNode;
		initialOpen?: boolean;
		open?: boolean;
		setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
		/**
		 * @description 'Елси не передан проп initalFocus, фокус устанавлвиается на DialogClose, если нету DialogClose, фокус устанавливается на DialogPopup'
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
		 * @default 'dialog'
		 */
		role?: 'dialog' | 'alertdialog';
		/**
		 * @default 200
		 */
		animationDuration?: number | { open: number; close: number };
	}
}
