import * as React from 'react';
import { usePaginationRootContext } from '../root/pagination-root-context';
import { getPageNumbers } from '../helpers/get-page-numbers';

export const PaginationButtons = (props: PaginationButtons.Props) => {
	const { renderButton, renderSpace } = props;

	const { currentPage, maxDisplayedPages, totalPages, onChange } = usePaginationRootContext();

	const renderedButtons = React.useMemo(() => {
		return getPageNumbers(currentPage, totalPages, maxDisplayedPages).map((page, index) => {
			if (typeof page === 'string') {
				return <React.Fragment key={index}>{renderSpace()}</React.Fragment>
			}

			const isCurrentPage = currentPage === page;

			return (
				<React.Fragment key={index}>
					{renderButton({
						onClick: () => (isCurrentPage ? undefined : onChange(page)),
						page,
						current: isCurrentPage,
						'aria-current': isCurrentPage ? 'true' : undefined,
						'aria-label': isCurrentPage ? `Page ${page}` : `Go to page ${page}`,
					})}
				</React.Fragment>
			);
		});
	}, [renderButton, renderSpace, onChange, currentPage, maxDisplayedPages, totalPages]);

	return renderedButtons;
};

export namespace PaginationButtons {
	export interface RenderButtonProps {
		onClick: () => void;
		page: number;
		current: boolean;
		'aria-label': string;
		'aria-current': 'true' | undefined;
	}
	export interface Props {
		renderButton: (props: RenderButtonProps) => React.ReactElement;
		renderSpace: () => React.ReactElement;
	}
}
