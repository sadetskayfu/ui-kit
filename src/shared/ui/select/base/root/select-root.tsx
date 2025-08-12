import * as React from 'react';
import { useEventCallback, useModernLayoutEffect, useOnFirstRender } from '@/shared/hooks';
import { CompositeList } from '@/shared/ui/composite';
import { Store, useStore } from '@/shared/lib/store';
import { selectors, State } from '../store';
import {
	flip,
	offset,
	size,
	Placement,
	useDismiss,
	useFloating,
	useInteractions,
	useTransitionStatus,
	useTypeahead,
	autoUpdate,
	useListNavigation,
} from '@floating-ui/react';
import { SelectRootContext } from './select-root-context';
import { NOOP } from '@/shared/helpers/noop';
import { EMPTY_OBJECT } from '@/shared/constants';
import { useDirection } from '@/app/providers/direction-provider';
import { applyStyles } from '@/shared/helpers/apply-styles';

export const SelectRoot = (props: SelectRoot.Props) => {
	const {
		children,
		labelId: labelIdProp,
		placement,
		defaultValue,
		value: externalValue,
		onChange: externalSetValue,
		defaultOpen = false,
		open: externalOpen,
		setOpen: externalSetOpen,
		multiple = false,
		minValueLength = 0,
		disabled = false,
		readOnly = false,
		required = false,
		animationDuration,
		offset: offsetValue = 5,
		paddingToFlip,
		loop,
		removeScroll = false,
		referenceWidth = true,
		setAvailableHeight,
	} = props;

	const [internalValue, internalSetValue] = React.useState<string | string[]>(
		defaultValue ?? (multiple ? [] : '')
	);
	const [internalOpen, internalSetOpen] = React.useState<boolean>(defaultOpen);
	const [labelId, setLabelId] = React.useState<string | undefined>(labelIdProp);
	const [isRegisteredItems, setIsRegisteredItems] = React.useState<boolean>(false)

	const selectedValue = externalValue ?? internalValue;
	const onChange = externalSetValue ?? internalSetValue;
	const open = externalOpen ?? internalOpen;
	const setOpen = externalSetOpen ?? internalSetOpen;

	const elementsRef = React.useRef<HTMLElement[]>([]);
	const labelsRef = React.useRef<(string | null)[]>([]);
	const valuesRef = React.useRef<string[]>([]);
	const isDeletedRef = React.useRef<boolean>(false)
	const isMultiple = multiple && Array.isArray(selectedValue);

	const store = React.useRef(
		new Store<State>({
			multiple: isMultiple,
			activeIndex: null,
			selectedValue,
			activeId: null,
			mounted: false,
			open,
			status: undefined,
			itemListId: undefined,
			setFloating: NOOP,
			setReference: NOOP,
			getReferenceProps: () => EMPTY_OBJECT,
			getItemProps: () => EMPTY_OBJECT,
			floatingStyles: EMPTY_OBJECT,
		})
	).current;

	const onOpen = useEventCallback(() => {
		setOpen(true);
		store.set('open', true);
	});

	const onClose = useEventCallback(() => {
		setOpen(false);
		store.set('open', false);
	});

	const onOpenChange = useEventCallback((open: boolean) => {
		if (open) {
			onOpen();
		} else {
			onClose();
		}
	});

	const { context, refs, floatingStyles } = useFloating({
		open,
		onOpenChange,
		placement,
		whileElementsMounted: placement ? autoUpdate : undefined,
		middleware: placement
			? [
					offset(offsetValue),
					flip({ padding: paddingToFlip }),
					referenceWidth || setAvailableHeight
						? size({
								apply({ rects, elements, availableHeight }) {
									if (referenceWidth) {
										applyStyles(elements.floating, {
											maxWidth: `${rects.reference.width}px`,
										});
									}
									setAvailableHeight?.(availableHeight);
								},
							})
						: undefined,
				]
			: undefined,
	});

	const activeIndex = useStore(store, selectors.activeIndex);

	const lastSelectedIndex = React.useMemo(() => {
		if (selectedValue.length === 0 || !isRegisteredItems || isDeletedRef.current) {
			return null;
		}
		
		const lastSelectedValue = isMultiple
			? selectedValue[selectedValue.length - 1]
			: selectedValue;

		return valuesRef.current.indexOf(lastSelectedValue as string);
	}, [isMultiple, selectedValue, isRegisteredItems]);

	const direction = useDirection();

	const listNavigation = useListNavigation(context, {
		enabled: !readOnly && !disabled && isRegisteredItems,
		listRef: elementsRef,
		selectedIndex: lastSelectedIndex,
		activeIndex,
		onNavigate: (index) => {
			store.set('activeIndex', index)
		},
		loop,
		virtual: true,
		rtl: direction === 'rtl',
	});

	const typeahead = useTypeahead(context, {
		enabled: open && !readOnly && !disabled,
		listRef: labelsRef,
		activeIndex,
		onMatch: index => store.set('activeIndex', index),
	});

	const dismiss = useDismiss(context);

	const { getReferenceProps, getItemProps } = useInteractions([
		typeahead,
		dismiss,
		listNavigation,
	]);

	const { isMounted, status } = useTransitionStatus(context, {
		duration: animationDuration,
	});

	useOnFirstRender(() => {
		store.apply({
			setFloating: refs.setFloating,
			setReference: refs.setReference,
		});
	});

	useModernLayoutEffect(() => {
		store.apply({
			mounted: isMounted,
			status: status === 'open' ? 'open' : status === 'close' ? 'close' : undefined,
			floatingStyles,
			getReferenceProps,
			getItemProps,
		});
	}, [isMounted, status, floatingStyles, getReferenceProps, getItemProps]);

	const onDelete = useEventCallback((value: string) => {
		if (disabled || readOnly) {
			return;
		}

		let newSelectedValue: string | string[] = '';
		let hasChanged = false;

		if (isMultiple) {
			if (selectedValue.length > minValueLength) {
				newSelectedValue = selectedValue.filter(v => v !== value);
				hasChanged = true;
			}
		} else {
			if (minValueLength > 0) {
				return
			} else {
				newSelectedValue = '';
				hasChanged = true;
			}
		}

		if (hasChanged) {
			onChange(newSelectedValue);
			store.set('selectedValue', newSelectedValue);
			isDeletedRef.current = true

			requestAnimationFrame(() => isDeletedRef.current = false)
		}
	});

	const onSelect = useEventCallback((value: string) => {
		if (disabled || readOnly) {
			return;
		}

		const isSelected = isMultiple ? selectedValue.includes(value) : selectedValue === value;

		if (isSelected) {
			onDelete(value);
			return;
		}

		let newSelectedValue: string | string[] = '';
		let hasChanged = false;

		if (isMultiple) {
			newSelectedValue = [...selectedValue, value];
			hasChanged = true;
		} else {
			newSelectedValue = value;
			hasChanged = true;
			onClose();
		}

		if (hasChanged) {
			onChange(newSelectedValue);
			store.set('selectedValue', newSelectedValue);
		}
	});

	const contextValue: SelectRootContext = React.useMemo(
		() => ({
			store,
			placement,
			multiple: isMultiple,
			minValueLength,
			valuesRef,
			labelsRef,
			disabled,
			readOnly,
			required,
			removeScroll,
			labelId,
			setLabelId,
			isRegisteredItems,
			setIsRegisteredItems,
			onChange,
			onSelect,
			onDelete,
			onOpen,
			onClose,
		}),
		[
			store,
			placement,
			disabled,
			readOnly,
			required,
			removeScroll,
			isMultiple,
			minValueLength,
			labelId,
			isRegisteredItems,
			onChange,
			onSelect,
			onDelete,
			onOpen,
			onClose,
		]
	);

	return (
		<CompositeList elementsRef={elementsRef} labelsRef={labelsRef}>
			<SelectRootContext.Provider value={contextValue}>{children}</SelectRootContext.Provider>
		</CompositeList>
	);
};

export namespace SelectRoot {
	export interface Props {
		children: React.ReactNode;
		labelId?: string;
		defaultValue?: string[] | string;
		value?: string[] | string;
		onChange?: (value: string | string[]) => void;
		defaultOpen?: boolean;
		open?: boolean;
		setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
		/**
		 * Позиционирование всплывающего окна. Если не передана позиция, всплывающее окно будет открывать по центру экрана как dialog.
		 */
		placement?: Placement;
		/**
		 * @default false
		 */
		multiple?: boolean;
		/**
		 * Минимальное кол-во выбранных опций, при котором нельзя будет удалить опцию.
		 *
		 * @default 0
		 */
		minValueLength?: number;
		disabled?: boolean;
		readOnly?: boolean;
		required?: boolean;
		/**
		 * @default 200
		 */
		animationDuration?: number | { open: number; close: number };
		/**
		 * Отступ всплывающего окна (Popup) от открывающего элемента (Trigger).
		 *
		 * @default 5
		 */
		offset?: number;
		/**
		 * Минимальное расстояние всплывающего окна от края экрана, при котором произойдет flip на более оптимальную сторону.
		 *
		 * @default 5
		 */
		paddingToFlip?: number;
		/**
		 * @default false
		 */
		removeScroll?: boolean
		/**
		 * @default false
		 */
		loop?: boolean;
		/**
		 * Устанавливает максимальную ширину всплывающему окну, равную ширине триггер элемента.
		 *
		 * @default true
		 */
		referenceWidth?: boolean;
		/**
		 * Функция для установки динамической выcоты элемента, которая будет подстраиваться в зависимости от доступного места на экране
		 *
		 * @example setAvailableHeight(height: number) => listRef.current.styles.maxHeight = `${height}px`
		 *
		 * @default true
		 */
		setAvailableHeight?: (height: number) => void;
	}
}
