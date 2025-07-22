import * as React from 'react';
import { useCompositeRootContext } from '../root/composite-root-context';
import { useCompositeListItem, type UseCompositeListItemParams } from '../list/use-composite-list-item';
import type { CompositeCustomMetadata } from '../list/composite-list';
import { EMPTY_OBJECT } from '@/shared/constants';
import { useMergeRefs } from '@floating-ui/react';
import type { HTMLProps } from '@/shared/helpers/types';
import { isElementDisabled } from '@/shared/helpers/is-element-disabled';

export function useCompositeItem<Metadata extends CompositeCustomMetadata>(
	params: UseCompositeListItemParams<Metadata> = EMPTY_OBJECT
) {
	const { focusItemOnHover, activeIndex, onActiveIndexChange } = useCompositeRootContext();
	const { ref, index } = useCompositeListItem(params);

	const isActive = activeIndex === index;

	const itemRef = React.useRef<HTMLElement>(null);
	const mergedRef = useMergeRefs([ref, itemRef]);

	const compositeProps = React.useMemo<HTMLProps>(
		() => ({
			tabIndex: isActive ? 0 : -1,
			onFocus() {
				if(index > -1) {
					onActiveIndexChange(index);
				}
			},
			onMouseMove() {
				const item = itemRef.current;
				if (!focusItemOnHover || !item) {
					return;
				}

				const disabled = isElementDisabled(item);

				if (!isActive && !disabled) {
					item.focus();
				}
			},
		}),
		[index, focusItemOnHover, isActive, onActiveIndexChange]
	);

	return {
		compositeProps,
		compositeRef: mergedRef as React.RefCallback<HTMLElement | null>,
		index,
	};
}
