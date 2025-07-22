import * as React from 'react';
import { useCompositeRoot, type UseCompositeRootParams } from './use-composite-root';
import {
	type CompositeMetadata,
	type CompositeCustomMetadata,
	CompositeList,
} from '../list/composite-list';
import type { ComponentClassName, ComponentRender, ComponentRenderProps, ComponentState } from '@/shared/helpers/types';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '@/shared/constants';
import { useDirection } from '@/app/providers/direction-provider';
import { useEventCallback, useRenderElement } from '@/shared/hooks';
import { CompositeRootContext } from './composite-root-context';

export const CompositeRoot = React.forwardRef(<
	Metadata extends CompositeCustomMetadata,
	State extends ComponentState,
>(
	componentProps: CompositeRoot.Props<Metadata, State>, forwardedRef: React.ForwardedRef<HTMLDivElement>
) => {
	const {
		render,
		className,
		state = EMPTY_OBJECT as State,
		refs = EMPTY_ARRAY,
		props = EMPTY_ARRAY,
		onMapChange: onMapChangeProp,
		focusItemOnHover = false,
		...useCompositeRootProps
	} = componentProps;

	const direction = useDirection();

	const {
		activeIndex,
		onActiveIndexChange,
		onMapChange: onMapChangeUnwrapped,
		elementsRef,
		props: unwrappedProps,
	} = useCompositeRoot({ ...useCompositeRootProps, direction, rootRef: forwardedRef });

	const onMapChange = useEventCallback(
		(newMap: Map<Element, CompositeMetadata<Metadata> | null>) => {
			onMapChangeProp?.(newMap);
			onMapChangeUnwrapped(newMap);
		}
	);

	const element = useRenderElement('div', {
		className,
		ref: refs,
		props: [unwrappedProps, ...props],
		state,
		render,
	});

	const contextValue: CompositeRootContext = React.useMemo(
		() => ({ focusItemOnHover, activeIndex, onActiveIndexChange }),
		[focusItemOnHover, activeIndex, onActiveIndexChange]
	);

	return (
		<CompositeList elementsRef={elementsRef} onMapChange={onMapChange}>
			<CompositeRootContext value={contextValue}>{element}</CompositeRootContext>
		</CompositeList>
	);
});

export namespace CompositeRoot {
	export interface Props<Metadata extends Record<string, any>, State extends Record<string, any>>
		extends Omit<UseCompositeRootParams, 'direction' | 'rootRef'> {
		children?: React.ReactNode;
		className?: ComponentClassName<State>;
		state?: State;
		style?: React.CSSProperties
		refs?: React.Ref<HTMLElement | null>[]
		props?: Array<Record<string, any>>
		focusItemOnHover?: boolean;
		onMapChange?: (newMap: Map<Element, CompositeMetadata<Metadata> | null>) => void;
		render?: ComponentRender<ComponentRenderProps, State>;
	}
}
