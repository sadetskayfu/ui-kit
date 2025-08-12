import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useCompositeListItem } from '@/shared/ui/composite';
import { useSelectRootContext } from '../root/select-root-context';
import { selectors } from '../store';
import { useStore } from '@/shared/lib/store';
import { SelectItemContext } from './select-item-context';

/**
 * Renders a `<div>` element.
 */
export const SelectItem = React.forwardRef(
	(props: SelectItem.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const {
			render,
			className,
			value,
			label: labelProp,
			id: idProp,
			disabled = false,
			...otherProps
		} = props;

		const id = useId(idProp);

		const label = disabled ? null : labelProp || value;

		const { index, ref } = useCompositeListItem({ label, guessIndex: false });

		const { store, valuesRef, setIsRegisteredItems, onSelect } = useSelectRootContext();

		const selected = useStore(store, selectors.isSelected, value);
		const active = useStore(store, selectors.isActive, index);
		const getItemProps = useStore(store, selectors.getItemProps)

		const state: SelectItem.State = React.useMemo(
			() => ({ active, selected, disabled }),
			[active, selected, disabled]
		);

		const hasRegistered = index !== -1;

		useModernLayoutEffect(() => {
			if (!hasRegistered) {
				return;
			}

			const values = valuesRef.current

			values[index] = value;
			setIsRegisteredItems(true)

			return () => {
				delete values[index];
			};
		}, [hasRegistered, index, value, id]);

		const contextValue: SelectItemContext = React.useMemo(() => ({ selected }), [selected]);

		const itemProps = getItemProps()

		if (itemProps) {
			delete itemProps['onClick']
			delete itemProps['onFocus']
		}

		const element = useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, ref],
			props: [
				{
					id,
					role: 'option',
					tabIndex: -1,
					'aria-disabled': disabled ? 'true' : undefined,
					'aria-selected': selected ? 'true' : 'false',

					onClick: () => {
						if (!disabled && hasRegistered) {
							onSelect(value);
						}
					},
					...itemProps
				},
				otherProps,
			],
		});

		return (
			<SelectItemContext.Provider value={contextValue}>{element}</SelectItemContext.Provider>
		);
	}
);

export namespace SelectItem {
	export interface State {
		selected: boolean;
		active: boolean;
		disabled: boolean
	}
	export interface Props extends ModernComponentProps<'div', State> {
		value: string;
		/**
		 * Label для typeahead, если не передан label, используется value
		 */
		label?: string;
		disabled?: boolean;
	}
}
