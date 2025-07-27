import * as React from 'react';
import { useEventCallback, useLazyRef, useModernLayoutEffect } from '@/shared/hooks';
import { CompositeListContext } from './composite-list-context';

export type CompositeMetadata<CustomMetadata extends Record<string, any>> = { index?: number | null } & CustomMetadata;

export function CompositeList<Metadata extends Record<string, any>>(props: CompositeList.Props<Metadata>) {
	const { children, elementsRef, labelsRef, onMapChange } = props;

	const nextIndexRef = React.useRef<number>(0);

	const listeners = useLazyRef(createListeners).current;

	const map = useLazyRef(createMap<Metadata>).current;
	// re-render trigger mechanism
	const [mapTick, setMapTick] = React.useState<number>(0);
	const lastTickRef = React.useRef(mapTick);

	const register = useEventCallback((node: Element, metadata: Metadata) => {
		map.set(node, metadata ?? null);
		lastTickRef.current += 1;
		setMapTick(lastTickRef.current);
	});

	const unregister = useEventCallback((node: Element) => {
		map.delete(node);
		lastTickRef.current += 1;
		setMapTick(lastTickRef.current);
	});

	const sortedMap = React.useMemo(() => {
		disableEslintWarning(mapTick);

		const newMap = new Map<Element, CompositeMetadata<Metadata>>();
		const sortedNodes = Array.from(map.keys()).sort(sortByDocumentPosition);

		sortedNodes.forEach((node, index) => {
			const metadata = map.get(node) ?? ({} as CompositeMetadata<Metadata>);
			newMap.set(node, { ...metadata, index });
		});

		return newMap;
	}, [map, mapTick]);

	useModernLayoutEffect(() => {
		if (lastTickRef.current === mapTick) {
			if (elementsRef.current.length !== sortedMap.size) {
				elementsRef.current.length = sortedMap.size;
			}
			if (labelsRef && labelsRef.current.length !== sortedMap.size) {
				labelsRef.current.length = sortedMap.size;
			}
		}

		onMapChange?.(sortedMap);
	}, [onMapChange, sortedMap, elementsRef, labelsRef, mapTick, lastTickRef]);

	const subscribeMapChange = useEventCallback(fn => {
		listeners.add(fn);

		return () => {
			listeners.delete(fn);
		};
	});

	useModernLayoutEffect(() => {
		listeners.forEach(l => l(sortedMap));
	}, [listeners, sortedMap]);

	const contextValue: CompositeListContext<Metadata> = React.useMemo(
		() => ({ register, unregister, subscribeMapChange, elementsRef, labelsRef, nextIndexRef }),
		[register, unregister, subscribeMapChange, elementsRef, labelsRef, nextIndexRef]
	);

	return (
		<CompositeListContext.Provider value={contextValue}>
			{children}
		</CompositeListContext.Provider>
	);
}

function createListeners() {
	return new Set<Function>();
}

function createMap<Metadata extends Record<string, any>>() {
	return new Map<Element, CompositeMetadata<Metadata> | null>();
}

function disableEslintWarning(_: any) {}

function sortByDocumentPosition(a: Element, b: Element) {
	const position = a.compareDocumentPosition(b);

	if (
		position & Node.DOCUMENT_POSITION_FOLLOWING ||
		position & Node.DOCUMENT_POSITION_CONTAINED_BY
	) {
		return -1;
	}

	if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
		return 1;
	}

	return 0;
}

export namespace CompositeList {
	export interface Props<Metadata extends Record<string, any>> {
		children: React.ReactNode;
		elementsRef: React.RefObject<Array<HTMLElement | null>>;
		/**
		 * For useTypeahead
		 */
		labelsRef?: React.RefObject<Array<string | null>>;
		onMapChange?: (newMap: Map<Element, CompositeMetadata<Metadata> | null>) => void;
	}
}
