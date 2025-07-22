import * as React from 'react';
import type { HTMLProps, ModernComponentPropsWithClassName } from '@/shared/helpers/types';
import { useEventCallback, useRenderElement } from '@/shared/hooks';
import { TabsIndicatorCssVars } from './tabs-indicator-css-vars';
import { useTabsRootContext } from '../root/tabs-root-context';
import { useTabsListContext } from '../list/tabs-list-context';
import { useDirection } from '@/app/providers/direction-provider';
import { TabsRoot } from '../root/tabs-root';

type SelectedTabPosition = {
	left: number;
	right: number;
	top: number;
	bottom: number;
};

type SelectedTabSize = {
	width: number;
	height: number;
};

/**
 * Renders a `<span>` element.
 */
export const TabsIndicator = React.forwardRef(
	(props: TabsIndicator.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
		const { className, ...otherProps } = props;

		const [isMounted, setIsMounted] = React.useState(false);
		const [selectedTabPosition, setSelectedTabPosition] = React.useState<SelectedTabPosition>({
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		});
		const [selectedTabSize, setSelectedTabSize] = React.useState<SelectedTabSize>({
			width: 0,
			height: 0,
		});

		const { selectedValue, orientation, getTabElementBySelectedValue } = useTabsRootContext();
		const { tabListRef } = useTabsListContext();
		const direction = useDirection();

		const state: TabsIndicator.State = React.useMemo(() => ({ orientation }), [orientation]);

		const calculateSelectedTabParams = useEventCallback(() => {
			const selectedTab = getTabElementBySelectedValue(selectedValue);
			const tabList = tabListRef.current;

			if (selectedTab && tabList) {
				setSelectedTabPosition(prev => {
					const left = selectedTab.offsetLeft - tabList.clientLeft;
					const right =
						direction === 'ltr'
							? tabList.scrollWidth -
								selectedTab.offsetLeft -
								selectedTab.offsetWidth -
								tabList.clientLeft
							: selectedTab.offsetLeft - tabList.clientLeft;
					const top = selectedTab.offsetTop - tabList.clientTop;
					const bottom =
						tabList.scrollHeight -
						selectedTab.offsetTop -
						selectedTab.offsetHeight -
						tabList.clientTop;

					if (
						prev.bottom === bottom &&
						prev.top === top &&
						prev.left === left &&
						prev.right === right
					) {
						return prev;
					}

					return { left, right, top, bottom };
				});

				setSelectedTabSize(prev => {
					const width = selectedTab.offsetWidth;
					const height = selectedTab.offsetHeight;

					if (prev.width === width && prev.height === height) {
						return prev;
					}

					return { width, height };
				});
			}
		});

		React.useEffect(() => {
			setIsMounted(true);
		}, []);

		React.useEffect(() => {
			calculateSelectedTabParams();
		}, [calculateSelectedTabParams, selectedValue, orientation]);

		React.useEffect(() => {
			if (!tabListRef.current || typeof ResizeObserver === 'undefined') {
				return;
			}

			const ro = new ResizeObserver(calculateSelectedTabParams);

			ro.observe(tabListRef.current);

			return () => {
				ro.disconnect();
			};
		}, [calculateSelectedTabParams, tabListRef]);

		const localProps: HTMLProps = {
			role: 'presentation',
			style: {
				[TabsIndicatorCssVars.activeTabTop as string]: `${selectedTabPosition.top}px`,
				[TabsIndicatorCssVars.activeTabBottom as string]: `${selectedTabPosition.bottom}px`,
				[TabsIndicatorCssVars.activeTabLeft as string]: `${selectedTabPosition.left}px`,
				[TabsIndicatorCssVars.activeTabRight as string]: `${selectedTabPosition.right}px`,
				[TabsIndicatorCssVars.activeTabWidth as string]: `${selectedTabSize.width}px`,
				[TabsIndicatorCssVars.activeTabHeight as string]: `${selectedTabSize.height}px`,
			},
		};

		const element = useRenderElement('span', {
			className,
			ref: forwardedRef,
			state,
			props: [localProps, otherProps],
		});

		if (
			!isMounted ||
			selectedValue == null ||
			selectedTabSize.height === 0 ||
			selectedTabSize.width === 0
		) {
			return null;
		}

		return element;
	}
);

export namespace TabsIndicator {
	export interface State {
		orientation: TabsRoot.Orientation;
	}

	export interface Props extends ModernComponentPropsWithClassName<'span', State> {}
}
