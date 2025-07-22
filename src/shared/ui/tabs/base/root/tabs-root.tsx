import * as React from 'react';
import type { ModernComponentPropsWithClassName } from '@/shared/helpers/types';
import { TabsRootContext } from './tabs-root-context';
import { useRenderElement } from '@/shared/hooks';
import { CompositeList, type CompositeMetadata } from '@/shared/ui/composite';
import type { TabsPanel } from '../panel/tabs-panel';
import type { TabsTab } from '../tab/tabs-tab';

/**
 * Renders a `<div>` element.
 */
export const TabsRoot = React.forwardRef(
	(props: TabsRoot.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const {
			className,
			defaultValue = 0,
			value: controlledValue,
			onChange: controlledOnChange,
			orientation = 'horizontal',
			activateOnFocus = false,
			loop = true,
			...otherProps
		} = props;

		const [uncontrolledValue, setUncontrolledValue] = React.useState<TabsRoot.Value | null>(
			defaultValue
		);

		const value = controlledValue ?? uncontrolledValue;
		const onChange = controlledOnChange ?? setUncontrolledValue;

		const panelRefs = React.useRef<Array<HTMLElement | null>>([]);

		const [panelMap, setPanelMap] = React.useState(
			new Map<Element, CompositeMetadata<TabsPanel.Metadata> | null>()
		);
		const [tabMap, setTabMap] = React.useState(
			new Map<Element, CompositeMetadata<TabsTab.Metadata> | null>()
		);

		const state: TabsRoot.State = React.useMemo(() => ({ orientation }), [orientation]);

		// Panel id for aria-controls for tab
		const getPanelIdByTabValueOrIndex = React.useCallback(
			(tabValue: TabsRoot.Value | undefined, index: number) => {
				// Всегда проверяем index, т.к. при регистрации таба или панели, первичный index будет -1, и только на следущем ререндере мы получаем настоящий index (если мы не пытаемся его угадать на основе порядка монтирования в DOM)
				if (index < 0) {
					return undefined;
				}

				for (const panelMetadata of panelMap.values()) {
					if (panelMetadata) {
						// find by tabValue
						if (tabValue !== undefined && tabValue === panelMetadata.value) {
							return panelMetadata.id;
						}

						// find by index
						if (tabValue === undefined && index === panelMetadata.index) {
							return panelMetadata.id;
						}
					}
				}

				return undefined;
			},
			[panelMap]
		);

		// Tab id for aria-labelledby for panel
		const getTabIdByPanelValueOrIndex = React.useCallback(
			(panelValue: TabsRoot.Value | undefined, index: number) => {
				if (index < 0) {
					return undefined;
				}

				for (const tabMetadata of tabMap.values()) {
					if (tabMetadata) {
						// find by value
						if (panelValue !== undefined && panelValue === tabMetadata.value) {
							return tabMetadata.id;
						}

						// find by index
						if (panelValue === undefined && index === tabMetadata.index) {
							return tabMetadata.id;
						}
					}
				}

				return undefined;
			},
			[tabMap]
		);

		// Selected tab for indicator position
		const getTabElementBySelectedValue = React.useCallback(
			(selectedValue: TabsRoot.Value) => {
				for (const [tabElement, tabMetadata] of tabMap.entries()) {
					if (tabMetadata && selectedValue === (tabMetadata.value ?? tabMetadata.index)) {
						return tabElement as HTMLElement;
					}
				}

				return null;
			},
			[tabMap]
		);

		const contextValue: TabsRootContext = React.useMemo(
			() => ({
				selectedValue: value,
				onChange,
				setTabMap,
				getTabElementBySelectedValue,
				getTabIdByPanelValueOrIndex,
				getPanelIdByTabValueOrIndex,
				orientation,
				activateOnFocus,
				loop,
			}),
			[
				orientation,
				activateOnFocus,
				loop,
				value,
				onChange,
				setTabMap,
				getTabElementBySelectedValue,
				getTabIdByPanelValueOrIndex,
				getPanelIdByTabValueOrIndex,
			]
		);

		const element = useRenderElement('div', {
			className,
			state,
			ref: forwardedRef,
			props: otherProps,
		});

		return (
			<TabsRootContext.Provider value={contextValue}>
				<CompositeList<TabsPanel.Metadata> // Оборачиваем панели в лист, чтобы зарегистрировать и получить метаданные
					elementsRef={panelRefs}
					onMapChange={setPanelMap}
				>
					{element}
				</CompositeList>
			</TabsRootContext.Provider>
		);
	}
);

export namespace TabsRoot {
	export type Value = string | number | null;

	export type Orientation = 'vertical' | 'horizontal';

	export interface State {
		orientation: Orientation;
	}

	export interface Props
		extends Omit<
			ModernComponentPropsWithClassName<'div', State>,
			'onChange' | 'value' | 'defaultValue'
		> {
		/**
		 * Установите null, если не нужно дефолтное значение
		 * @default 0
		 */
		defaultValue?: Value;
		value?: Value;
		onChange?: (value: Value, event?: Event) => void;
		/**
		 * @default 'horizontal'
		 */
		orientation?: Orientation;
		/**
		 * @default false
		 */
		activateOnFocus?: boolean;
		/**
		 * @default true
		 */
		loop?: boolean;
	}
}
