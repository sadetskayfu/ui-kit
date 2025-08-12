import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';
import { selectors } from '../store';
import { useStore } from '@/shared/lib/store';

/**
 * Renders a `<div>` element.
 */
export const SelectControl = React.forwardRef(
	(props: SelectControl.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const {
			store,
			disabled,
			readOnly,
			required,
			multiple,
			minValueLength,
			labelId,
			onOpen,
			onClose,
			onDelete,
			onSelect,
			valuesRef,
		} = useSelectRootContext();

		const activeIndex = useStore(store, selectors.activeIndex);
		const selectedValue = useStore(store, selectors.selectedValue);
		const open = useStore(store, selectors.open);
		const itemListId = useStore(store, selectors.itemListId);
		const getReferenceProps = useStore(store, selectors.getReferenceProps);

		const handleKeyUp = (event: React.KeyboardEvent) => {
			if (disabled || readOnly) {
				return;
			}

			if (event.key === ' ') {
				event.preventDefault();
				event.stopPropagation();

				if (open) {
					if (typeof activeIndex === 'number' && activeIndex > -1) {
						const itemValue = valuesRef.current[activeIndex];

						if (itemValue) {
							onSelect(itemValue);
						}
					} else {
						onClose();
					}
				} else {
					onOpen();
				}
			}
		};

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (disabled || readOnly) {
				return;
			}

			if (
				event.key === 'Escape' ||
				event.key === 'Enter' ||
				event.key === 'Backspace' ||
				event.key === 'ArrowUp' ||
				event.key === 'ArrowDown'
			) {
				event.preventDefault();
				event.stopPropagation();
			}

			switch (event.key) {
				case 'ArrowUp':
				case 'ArrowDown':
					if (!open) {
						onOpen();
					}
					break;
				case 'Escape':
					onClose();
					break;
				case 'Enter':
					if (open) {
						if (typeof activeIndex === 'number' && activeIndex > -1) {
							const itemValue = valuesRef.current[activeIndex];

							if (itemValue) {
								onSelect(itemValue);
							}
						} else {
							onClose();
						}
					} else {
						onOpen();
					}
					break;
				case 'Backspace':
					if (
						multiple &&
						Array.isArray(selectedValue) &&
						selectedValue.length > minValueLength
					) {
						onDelete(selectedValue[selectedValue.length - 1]);
					}
					break;
				default:
					break;
			}
		};

		const element = useRenderElement('div', {
			render,
			className,
			ref: forwardedRef,
			props: [
				{
					role: 'combobox',
					tabIndex: disabled ? -1 : 0,
					'aria-haspopup': 'listbox',
					'aria-expanded': open ? 'true' : 'false',
					'aria-controls': open ? itemListId : undefined,
					...(disabled && { 'aria-disabled': 'true' }),
					...(readOnly && { 'aria-readonly': 'true' }),
					...(required && { 'aria-required': 'true' }),
					...(labelId && { 'aria-labelledby': labelId }),
					onBlur: () => {
						onClose();
					},
					...getReferenceProps?.({ onKeyDown: handleKeyDown, onKeyUp: handleKeyUp }),
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace SelectControl {
	export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
