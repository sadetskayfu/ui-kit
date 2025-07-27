import * as React from 'react';
import type {
	HTMLProps,
	ModernComponentProps,
} from '@/shared/helpers/types';
import { useTabsRootContext } from '../root/tabs-root-context';
import { TabsListContext } from './tabs-list-context';
import { CompositeRoot } from '@/shared/ui/composite';

/**
 * Renders a `<div>` element.
 */
export const TabsList = React.forwardRef(
	(props: TabsList.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, ...otherProps } = props;

		const [activeIndex, setActiveIndex] = React.useState<number>(0);

		const tabListRef = React.useRef<HTMLElement>(null);

		const { orientation, loop, setTabMap } = useTabsRootContext();

		const contextValue: TabsListContext = React.useMemo(
			() => ({ tabListRef, activeIndex, setActiveIndex }),
			[tabListRef, activeIndex, setActiveIndex]
		);

		const localProps: HTMLProps = {
			role: 'tablist',
			"aria-orientation": orientation
		}

		return (
			<TabsListContext.Provider value={contextValue}>
				<CompositeRoot
					render={render}
					className={className}
					refs={[forwardedRef, tabListRef]}
					props={[localProps, otherProps]}
					orientation={orientation}
					loop={loop}
					enableHomeAndEndKeys
					onMapChange={setTabMap}
					activeIndex={activeIndex}
					onActiveIndexChange={setActiveIndex}
				/>
			</TabsListContext.Provider>
		);
	}
);

export namespace TabsList {
	export interface State {}

	export interface Props extends ModernComponentProps<'div', State> {}
}
