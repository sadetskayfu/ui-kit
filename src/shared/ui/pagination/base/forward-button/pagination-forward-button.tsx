import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useRenderElement } from '@/shared/hooks';
import { usePaginationRootContext } from '../root/pagination-root-context';

/**
 * Renders a `<button>` element.
 */
export const PaginationForwardButton = React.forwardRef(
	(props: PaginationForwardButton.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { render, className, disabled, ...otherProps } = props;

		const { currentPage, loop, totalPages, onChange } = usePaginationRootContext();

		const isDisabled = disabled || (!loop && currentPage === totalPages) || totalPages === 1;

		const state: PaginationForwardButton.State = React.useMemo(
			() => ({ disabled: isDisabled }),
			[isDisabled]
		);

		const element = useRenderElement('button', {
			render,
			className,
			state,
			ref: forwardedRef,
			props: [
				{
					onClick: () => onChange(currentPage + 1),
					disabled: isDisabled,
					'aria-label': 'Next page',
				},
				otherProps,
			],
		});

		return element;
	}
);

export namespace PaginationForwardButton {
	export interface State {
		disabled: boolean;
	}
	export interface Props extends ModernComponentProps<'button', State> {}
}
