import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useId, useModernLayoutEffect, useRenderElement } from '@/shared/hooks';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';

/**
 * Renders a `<div>` element.
 */
export const SelectList = React.forwardRef(
	(props: SelectList.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, id: idProp, ...otherProps } = props;

		const id = useId(idProp);

		const { store, labelId } = useSelectRootContext();

		const multiple = useStore(store, selectors.multiple);

		useModernLayoutEffect(() => {
			store.set('itemListId', id);

			return () => {
				store.set('itemListId', undefined);
			};
		}, [id, store]);

		const element = useRenderElement('div', {
			render,
			className,
			ref: forwardedRef,
			props: [
				{
					id,
					role: 'listbox',
					'aria-multiselectable': multiple ? 'true' : 'false',
					'aria-labelledby': labelId,
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace SelectList {
	export interface State {}
	export interface Props extends ModernComponentProps<'div', State> {}
}
