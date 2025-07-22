import * as React from 'react';
import type { ComponentRender, ModernComponentPropsWithClassName } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useTabsRootContext } from '../root/tabs-root-context';
import type { TabsRoot } from '../root/tabs-root';
import { useCompositeListItem } from '@/shared/ui/composite';

/**
 * Renders a `<div>` element.
 */
export const TabsPanel = React.forwardRef(
	(props: TabsPanel.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const {
			render,
			className,
			children,
			id: externalId,
			value,
			keepMounted,
			...otherProps
		} = props;

		const localId = React.useId();
		const id = externalId ?? localId;

		const { selectedValue, orientation, getTabIdByPanelValueOrIndex } = useTabsRootContext();

		const metadata: TabsPanel.Metadata = React.useMemo(() => ({ value, id }), [value, id]);

		const { ref, index } = useCompositeListItem({ metadata });

		const panelValue = value ?? index;

		const tabId = React.useMemo(
			() => getTabIdByPanelValueOrIndex(value, index),
			[getTabIdByPanelValueOrIndex, index, value]
		);

		const hidden = panelValue !== selectedValue;

		const state: TabsPanel.State = React.useMemo(
			() => ({ hidden, orientation }),
			[hidden, orientation]
		);

		const element = useRenderElement('div', {
			className,
			ref: [forwardedRef, ref],
			props: [
				{
					id,
					hidden,
					role: 'tabpanel',
					'aria-labelledby': tabId,
					children: hidden && !keepMounted ? undefined : children,
				},
				otherProps,
			],
			state,
			render,
		});

		return element;
	}
);

export namespace TabsPanel {
	export interface Metadata {
		id?: string;
		value?: TabsRoot.Value;
	}

	export interface State {
		hidden: boolean;
		orientation: TabsRoot.Orientation;
	}

	export interface Props extends ModernComponentPropsWithClassName<'div', State> {
		/**
		 * Если не передано value используется index элемента
		 */
		value?: TabsRoot.Value;
		render?: ComponentRender<React.ComponentProps<'div'>, State>;
		/**
		 * Нужно ли монтировать содержимое панели, когда она hidden
		 * @default false
		 */
		keepMounted?: boolean;
	}
}
