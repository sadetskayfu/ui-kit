import * as React from 'react';
import type { CompositeMetadata, CompositeCustomMetadata } from './composite-list';

export interface CompositeListContext<Metadata extends CompositeCustomMetadata> {
	register: (node: Element, metadata: Metadata) => void;
	unregister: (node: Element) => void;
	subscribeMapChange: (
		fn: (map: Map<Element, CompositeMetadata<Metadata> | null>) => void
	) => () => void;
	elementsRef: React.RefObject<Array<HTMLElement | null>>;
	labelsRef?: React.RefObject<Array<string | null>>;
	nextIndexRef: React.RefObject<number>;
}

export const CompositeListContext = React.createContext<CompositeListContext<any>>({
	register: () => {},
	unregister: () => {},
	subscribeMapChange: () => {
		return () => {};
	},
	elementsRef: { current: [] },
	nextIndexRef: { current: 0 },
});

export function useCompositeListContext() {
	return React.useContext(CompositeListContext);
}
