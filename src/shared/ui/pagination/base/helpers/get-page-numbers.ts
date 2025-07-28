export function getPageNumbers(currentPage: number, totalPages: number, maxDisplayedPages: number) {
	const halfDisplayed = Math.floor(maxDisplayedPages / 2);
	let startPage: number;
	let endPage: number;

	// Range visible page
	if (currentPage < halfDisplayed + 3) {
		startPage = 1;
		endPage = Math.min(maxDisplayedPages, totalPages);
	} else if (currentPage > totalPages - halfDisplayed - 2) {
		startPage = Math.max(totalPages - maxDisplayedPages + 1, 1);
		endPage = totalPages;
	} else {
		startPage = currentPage - halfDisplayed + 1;
		endPage = currentPage + halfDisplayed - 1;
	}

	let pageNumbers: Array<string | number> = Array.from(
		{ length: endPage - startPage + 1 },
		(_, i) => startPage + i
	);

	if (startPage > 1) {
		pageNumbers = [1, '...'].concat(pageNumbers);
	}
	if (endPage < totalPages) {
		pageNumbers = pageNumbers.concat(['...', totalPages]);
	}

	return pageNumbers;
}
