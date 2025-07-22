import * as React from 'react';
import type { ComponentClassName, ComponentRender, ComponentRenderProps, ComponentState } from '@/shared/helpers/types';
import type { CompositeCustomMetadata } from '../list/composite-list';
import type { UseCompositeListItemParams } from '../list/use-composite-list-item';
import { useCompositeItem } from './use-composite-item';
import { useRenderElement } from '@/shared/hooks';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '@/shared/constants';

export const CompositeItem = React.forwardRef(
	<Metadata extends CompositeCustomMetadata, State extends ComponentState>(
		componentProps: CompositeItem.Props<Metadata, State>,
		forwardedRef: React.ForwardedRef<HTMLDivElement>
	) => {
		const {
			render,
			className,
			state = EMPTY_OBJECT as State,
			props = EMPTY_ARRAY,
			refs = EMPTY_ARRAY,
			label,
			metadata,
			guessIndex,
            ...otherProps
		} = componentProps;

		const { compositeProps, compositeRef } = useCompositeItem({ metadata, label, guessIndex });

		return useRenderElement('div', {
			render,
			className,
			state,
			ref: [forwardedRef, ...refs, compositeRef],
			props: [compositeProps, ...props, otherProps],
		});
	}
);

export namespace CompositeItem {
	export interface Props<Metadata extends CompositeCustomMetadata, State extends ComponentState>
		extends UseCompositeListItemParams<Metadata> {
		children?: React.ReactNode;
		className?: ComponentClassName<State>;
		state?: State;
        style?: React.CSSProperties
		refs?: React.Ref<HTMLElement | null>[]
		props?: Array<Record<string, any>>
		render?: ComponentRender<ComponentRenderProps, State>;
	}
}
