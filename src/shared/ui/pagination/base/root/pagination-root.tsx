import * as React from 'react';
import { ModernComponentProps } from '@/shared/helpers/types';
import { useEventCallback, useRenderElement } from '@/shared/hooks';
import { PaginationRootContext } from './pagination-root-context';

/**
 * Renders a `<nav>` element.
 */
export const PaginationRoot = React.forwardRef(
	(props: PaginationRoot.Props, forwardedRef: React.ForwardedRef<HTMLElement>) => {
		const {
			render,
			className,
			loop = false,
			totalItems,
			totalItemsOnPage,
			maxDisplayedPages = 5,
			page: currentPage,
			onChange,
			...otherProps
		} = props;

		const totalPages = React.useMemo(
			() => Math.ceil(totalItems / totalItemsOnPage),
			[totalItems, totalItemsOnPage]
		);

		const handleChangePage = useEventCallback((page: number) => {
			if (loop) {
				if (page > totalPages) {
					onChange(1);
				} else if (page < 1) {
					onChange(totalPages);
				} else {
					onChange(page);
				}
			} else {
				if (page > 0 && page !== totalPages + 1) {
					onChange(page);
				}
			}
		});

		React.useEffect(() => {
			if (totalPages > 0 && totalPages < currentPage) {
				onChange(totalPages);
			}
			// eslint-disable-next-line
		}, [totalPages]);

		const contextValue: PaginationRootContext = React.useMemo(
			() => ({ currentPage, maxDisplayedPages, totalPages, loop, onChange: handleChangePage }),
			[currentPage, maxDisplayedPages, totalPages, loop, handleChangePage]
		);

		const element = useRenderElement('nav', {
			render,
			className,
			ref: forwardedRef,
			props: [otherProps],
		});

		return (
			<PaginationRootContext.Provider value={contextValue}>
				{element}
			</PaginationRootContext.Provider>
		);
	}
);

export namespace PaginationRoot {
	export interface State {}
	export interface RenderButtonProps {
		onClick: () => void;
		key: number;
		page: number;
		'aria-label': string;
		'aria-current': 'true' | undefined;
	}
	export interface Props extends Omit<ModernComponentProps<'nav', State>, 'onChange'> {
		/**
		 * @default false
		 */
		loop?: boolean;
		totalItems: number;
		totalItemsOnPage: number;
		/**
		 * @default 5
		 */
		maxDisplayedPages?: number;
		page: number;
		onChange: (page: number) => void;
	}
}
