import * as React from 'react';
import type { UseCompositeListItemParams } from '../list/use-composite-list-item';
import { useCompositeItem } from './use-composite-item';
import { useRenderElement } from '@/shared/hooks';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '@/shared/constants';
import { ModernComponentProps } from '@/shared/helpers/types';

export const CompositeItem = React.forwardRef(
	<Metadata extends Record<string, any>, State extends Record<string, any>>(
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
	export interface Props<Metadata extends Record<string, any>, State extends Record<string, any>>
		extends UseCompositeListItemParams<Metadata>, Pick<ModernComponentProps<'div', State>, 'children' | 'render' | 'className'> {
		state?: State;
        style?: React.CSSProperties
		refs?: React.Ref<HTMLElement | null>[]
		props?: Array<Record<string, any>>
	}
}
