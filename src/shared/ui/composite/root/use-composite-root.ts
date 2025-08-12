import * as React from 'react';
import {
	getMinListIndex,
	getMaxListIndex,
	createGridCellMap,
	isListIndexDisabled,
	getGridNavigatedIndex,
	getGridCellIndices,
	getGridCellIndexOfCorner,
	findNonDisabledListIndex,
	isIndexOutOfListBounds,
	activeElement,
} from '@floating-ui/react/utils';
import type { TextDirection } from '@/app/providers/direction-provider';
import { isNativeInput, scrollIntoViewIfNeeded } from '../composite';
import { useMergeRefs } from '@floating-ui/react';
import { useEventCallback, useModernLayoutEffect } from '@/shared/hooks';
import type { CompositeMetadata } from '../list/composite-list';
import {
	ALL_KEYS,
	ARROW_DOWN,
	ARROW_KEYS,
	ARROW_LEFT,
	ARROW_RIGHT,
	ARROW_UP,
	END,
	HOME,
	HORIZONTAL_KEYS,
	HORIZONTAL_KEYS_WITH_EXTRA_KEYS,
	isModifierKeySet,
	VERTICAL_KEYS,
	VERTICAL_KEYS_WITH_EXTRA_KEYS,
	type ModifierKey,
} from '../keys';
import { ownerDocument } from '@/shared/helpers/owner';
import { ACTIVE_COMPOSITE_ITEM } from '../constants';
import { isElementDisabled } from '@/shared/helpers/is-element-disabled';
import type { HTMLProps } from '@/shared/helpers/types';

export interface Dimensions {
	width: number;
	height: number;
}

export interface UseCompositeRootParams {
	orientation?: 'horizontal' | 'vertical' | 'both';
	cols?: number;
	loop?: boolean;
	activeIndex?: number;
	onActiveIndexChange?: (index: number) => void;
	dense?: boolean;
	direction: TextDirection;
	itemSizes?: Array<Dimensions>;
	rootRef?: React.Ref<Element>;
	enableHomeAndEndKeys?: boolean;
	stopEventPropagation?: boolean;
	disabledIndices?: number[];
	modifierKeys?: ModifierKey[];
}

const EMPTY_ARRAY: [] = [];

export function useCompositeRoot(params: UseCompositeRootParams) {
	const {
		orientation = 'both',
		cols = 1,
		loop = true,
		dense = false,
		direction,
		activeIndex: externalActiveIndex,
		onActiveIndexChange: externalSetActiveIndex,
		rootRef: externalRef,
		enableHomeAndEndKeys = false,
		stopEventPropagation = false,
		itemSizes,
		disabledIndices,
		modifierKeys = EMPTY_ARRAY,
	} = params;

	const [internalActiveIndex, internalSetActiveIndex] = React.useState(0);

	const isGrid = cols > 1;

	const rootRef = React.useRef<HTMLElement>(null);
	const mergedRef = useMergeRefs([rootRef, externalRef]);

	const elementsRef = React.useRef<Array<HTMLElement | null>>([]);
	const hasSetDefaultIndexRef = React.useRef(false);

	const activeIndex = externalActiveIndex ?? internalActiveIndex;
	const onActiveIndexChange = externalSetActiveIndex ?? internalSetActiveIndex;

	const handleActiveIndexChange = useEventCallback((index: number, needScroll = false) => {
		onActiveIndexChange(index);

		if (needScroll) {
			const newActiveItem = elementsRef.current[index];
			scrollIntoViewIfNeeded(rootRef.current, newActiveItem, direction, orientation);
		}
	});

	useModernLayoutEffect(() => {
		const activeEl = activeElement(ownerDocument(rootRef.current)) as HTMLElement | null;

		if (elementsRef.current.includes(activeEl)) {
			const focusedItem = elementsRef.current[activeIndex];

			if (focusedItem && focusedItem !== activeEl) {
				focusedItem.focus();
			}
		}
	}, [activeIndex]);

	const onMapChange = useEventCallback((map: Map<Element, CompositeMetadata<any>>) => {
		if (map.size === 0 || hasSetDefaultIndexRef.current) {
			return;
		}

		hasSetDefaultIndexRef.current = true;
		const sortedElements = Array.from(map.keys());
		const activeItem = (sortedElements.find(item => item.hasAttribute(ACTIVE_COMPOSITE_ITEM)) ??
			null) as HTMLElement | null;
		const activeIndex = activeItem ? sortedElements.indexOf(activeItem) : -1;

		if (activeIndex !== -1) {
			handleActiveIndexChange(activeIndex);
		}

		scrollIntoViewIfNeeded(rootRef.current, activeItem, direction, orientation);
	});

	const onFocus = React.useCallback((event: React.FocusEvent) => {
		if (rootRef.current && isNativeInput(event.target)) {
			event.target.setSelectionRange(0, event.target.value.length ?? 0);
		}
	}, []);

	const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
		if (!rootRef.current) return;

		const RELEVANT_KEYS = enableHomeAndEndKeys ? ALL_KEYS : ARROW_KEYS;

		if (!RELEVANT_KEYS.has(event.key)) {
			return;
		}

		if (isModifierKeySet(event, modifierKeys)) {
			return;
		}

		const isRtl = direction === 'rtl';

		const horizontalForwardKey = isRtl ? ARROW_LEFT : ARROW_RIGHT;
		const horizontalBackwardKey = isRtl ? ARROW_RIGHT : ARROW_LEFT;

		const forwardKey = {
			horizontal: horizontalForwardKey,
			both: horizontalForwardKey,
			vertical: ARROW_DOWN,
		}[orientation];

		const backwardKey = {
			horizontal: horizontalBackwardKey,
			vertical: ARROW_UP,
			both: horizontalBackwardKey,
		}[orientation];

		if (isNativeInput(event.target) && !isElementDisabled(event.target)) {
			const selectionStart = event.target.selectionStart;
			const selectionEnd = event.target.selectionEnd;
			const value = event.target.value ?? '';

			if (selectionStart == null || event.shiftKey || selectionStart !== selectionEnd) {
				return;
			}
			if (event.key !== backwardKey && selectionStart < value.length) {
				return;
			}
			if (event.key !== forwardKey && selectionStart > 0) {
				return;
			}
		}

		let nextIndex = activeIndex;
		const minIndex = getMinListIndex(elementsRef, disabledIndices);
		const maxIndex = getMaxListIndex(elementsRef, disabledIndices);

		if (isGrid) {
			const sizes =
				itemSizes ||
				Array.from({ length: elementsRef.current.length }, () => ({
					width: 1,
					height: 1,
				}));
			const cellMap = createGridCellMap(sizes, cols, dense);

			// first enabled index
			const minGridIndex = cellMap.findIndex(
				index => index != null && !isListIndexDisabled(elementsRef, index, disabledIndices)
			);
			// last enabled index
			const maxGridIndex = cellMap.reduce(
				(foundIndex: number, index, cellIndex) =>
					index != null && !isListIndexDisabled(elementsRef, index, disabledIndices)
						? cellIndex
						: foundIndex,
				-1
			);

			nextIndex = cellMap[
				getGridNavigatedIndex(
					{
						current: cellMap.map(itemIndex =>
							itemIndex ? elementsRef.current[itemIndex] : null
						),
					},
					{
						event,
						orientation,
						loop,
						cols,
						// treat undefined (empty grid spaces) as disabled indices so we
						// don't end up in them
						disabledIndices: getGridCellIndices(
							[
								...(disabledIndices ||
									elementsRef.current.map((_, index) =>
										isListIndexDisabled(elementsRef, index) ? index : undefined
									)),
								undefined,
							],
							cellMap
						),
						minIndex: minGridIndex,
						maxIndex: maxGridIndex,
						prevIndex: getGridCellIndexOfCorner(
							activeIndex > maxIndex ? minIndex : activeIndex,
							sizes,
							cellMap,
							cols,
							// use a corner matching the edge closest to the direction we're
							// moving in so we don't end up in the same item. Prefer
							// top/left over bottom/right.
							event.key === ARROW_DOWN
								? 'bl'
								: event.key === ARROW_RIGHT
									? 'tr'
									: 'tl'
						),
						rtl: isRtl,
					}
				)
			] as number; // navigated cell will never be nullish
		}

		const forwardKeys = {
			horizontal: [horizontalForwardKey],
			vertical: [ARROW_DOWN],
			both: [horizontalForwardKey, ARROW_DOWN],
		}[orientation];

		const backwardKeys = {
			horizontal: [horizontalBackwardKey],
			vertical: [ARROW_UP],
			both: [horizontalBackwardKey, ARROW_UP],
		}[orientation];

		const preventedKeys = isGrid
			? RELEVANT_KEYS
			: {
					horizontal: enableHomeAndEndKeys
						? HORIZONTAL_KEYS_WITH_EXTRA_KEYS
						: HORIZONTAL_KEYS,
					vertical: enableHomeAndEndKeys ? VERTICAL_KEYS_WITH_EXTRA_KEYS : VERTICAL_KEYS,
					both: RELEVANT_KEYS,
				}[orientation];

		if (enableHomeAndEndKeys) {
			if (event.key === HOME) {
				nextIndex = minIndex;
			} else if (event.key === END) {
				nextIndex = maxIndex;
			}
		}

		if (
			nextIndex === activeIndex &&
			(forwardKeys.includes(event.key) || backwardKeys.includes(event.key))
		) {
			if (loop && nextIndex === maxIndex && forwardKeys.includes(event.key)) {
				nextIndex = minIndex;
			} else if (loop && nextIndex === minIndex && backwardKeys.includes(event.key)) {
				nextIndex = maxIndex;
			} else {
				nextIndex = findNonDisabledListIndex(elementsRef, {
					startingIndex: nextIndex,
					decrement: backwardKeys.includes(event.key),
					disabledIndices,
				});
			}
		}

		if (nextIndex !== activeIndex && !isIndexOutOfListBounds(elementsRef, nextIndex)) {
			if (stopEventPropagation) {
				event.stopPropagation();
			}

			if (preventedKeys.has(event.key)) {
				event.preventDefault();
			}
			handleActiveIndexChange(nextIndex, true);

			// Wait for FocusManager `returnFocus` to execute.
			queueMicrotask(() => {
				elementsRef.current[nextIndex]?.focus();
			});
		}
	});

	const props = React.useMemo<HTMLProps>(
		() => ({
			'aria-orientation': orientation === 'both' ? undefined : orientation,
			ref: mergedRef,
			onFocus,
			onKeyDown,
		}),
		[orientation, mergedRef, onFocus, onKeyDown]
	);

	return React.useMemo(
		() => ({
			props,
			activeIndex,
			onActiveIndexChange: handleActiveIndexChange,
			elementsRef,
			disabledIndices,
			onMapChange,
		}),
		[props, activeIndex, handleActiveIndexChange, elementsRef, disabledIndices, onMapChange]
	);
}
