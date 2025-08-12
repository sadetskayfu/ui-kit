import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { useSelectItemContext } from '../item/select-item-context';

/**
 * Renders a `<span>` element.
 */
export const SelectItemIndicator = React.forwardRef(
	(props: SelectItemIndicator.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
		const { render, className, keepMounted, ...otherProps } = props;

		const { selected } = useSelectItemContext();

		const state: SelectItemIndicator.State = React.useMemo(() => ({ selected }), [selected]);

		const element = useRenderElement('span', {
			render,
			className,
			state,
			ref: forwardedRef,
			props: [otherProps],
			enabled: keepMounted || selected,
		});

		return element;
	}
);

export namespace SelectItemIndicator {
	export interface State {
		selected: boolean;
	}
	export interface Props extends ModernComponentProps<'span', State> {
		keepMounted?: boolean;
	}
}
