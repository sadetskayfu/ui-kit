import * as React from 'react';
import type { ModernComponentProps } from '@/shared/helpers/types';
import type { TabsRoot } from '../root/tabs-root';
import { useEventCallback, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useTabsRootContext } from '../root/tabs-root-context';
import { ACTIVE_COMPOSITE_ITEM, useCompositeItem } from '@/shared/ui/composite';
import { useTabsListContext } from '../list/tabs-list-context';

/**
 * Renders a `<button>` element.
 */
export const TabsTab = React.forwardRef(
	(props: TabsTab.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const { render, className, id: externalId, value, disabled = false, ...otherProps } = props;

		const localId = React.useId();
		const id = externalId ?? localId;

		const isNavigationRef = React.useRef<boolean>(false);

		const metadata: TabsTab.Metadata = React.useMemo(() => ({ id, value }), [id, value]);

		const {
			selectedValue,
			onChange,
			activateOnFocus,
			orientation,
			getPanelIdByTabValueOrIndex,
		} = useTabsRootContext();
		
		const { activeIndex, setActiveIndex } = useTabsListContext();

		const { index, compositeProps, compositeRef } = useCompositeItem({ metadata });

		const tabValue = value ?? index;

		const selected = tabValue === selectedValue;

		const state: TabsTab.State = React.useMemo(
			() => ({ selected, disabled, orientation }),
			[selected, disabled, orientation] 
		);

		const panelId = React.useMemo(
			() => getPanelIdByTabValueOrIndex(value, index),
			[getPanelIdByTabValueOrIndex, value, index]
		);

		const onClick = useEventCallback((event: React.MouseEvent<HTMLButtonElement>) => {
			if (!selected && !disabled) {
				onChange(tabValue, event.nativeEvent);
			}
		});

		const onFocus = useEventCallback((event: React.FocusEvent<HTMLButtonElement>) => {
			if (activateOnFocus && !selected && !disabled) {
				onChange(tabValue, event.nativeEvent);
			}
		});

		// Синхронизируем выбранный таб с индексом, если value изменилось извне, чтобы при возврате сфокусироваться на выбранном табе
		useModernLayoutEffect(() => {
			if (isNavigationRef.current) {
				isNavigationRef.current = false;
				return;
			}

			if (selected && index > -1 && activeIndex !== index) {
				setActiveIndex(index);
			}
		}, [selected, index, activeIndex, setActiveIndex]);

		const element = useRenderElement('button', {
			render,
			className,
			ref: [forwardedRef, compositeRef],
			props: [
				compositeProps,
				{
					id,
					role: 'tab',
					disabled,
					'aria-controls': panelId,
					'aria-selected': selected,
					[ACTIVE_COMPOSITE_ITEM as string]: selected ? '' : undefined,
					onClick,
					onFocus,
					onKeyDownCapture() {
						isNavigationRef.current = true;
					},
				},
				otherProps,
			],
			state,
		});

		return element;
	}
);

export namespace TabsTab {
	export interface Metadata {
		id?: string;
		value?: TabsRoot.Value;
	}

	export interface State {
		orientation: TabsRoot.Orientation;
		disabled: boolean;
		selected: boolean;
	}

	export interface Props
		extends Omit<ModernComponentProps<'button', State>, 'value'> {
		/**
		 * Если не передано value используется index элемента
		 */
		value?: TabsRoot.Value;
	}
}
