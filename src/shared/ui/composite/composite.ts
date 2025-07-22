import type { TextDirection } from '@/app/providers/direction-provider';

export function isNativeInput(element: EventTarget): element is (HTMLInputElement | HTMLTextAreaElement) {
    if (element instanceof HTMLInputElement && element.selectionStart != null) {
        return true
    }
    if (element instanceof HTMLTextAreaElement) {
        return true
    }

    return false
}

export function scrollIntoViewIfNeeded(
	scrollContainer: HTMLElement | null,
	element: HTMLElement | null,
	direction: TextDirection,
	orientation: 'horizontal' | 'vertical' | 'both'
) {
	if (!scrollContainer || !element || !element.scrollTo) {
		return;
	}

	let targetX = scrollContainer.scrollLeft;
	let targetY = scrollContainer.scrollTop;

	const isOverflowingX = scrollContainer.clientWidth < scrollContainer.scrollWidth;
	const isOverflowingY = scrollContainer.clientHeight < scrollContainer.scrollHeight;

	if (isOverflowingX && orientation !== 'vertical') {
		const elementOffsetLeft = getOffset(scrollContainer, element, 'left');
		const containerStyles = getStyles(scrollContainer);
		const elementStyles = getStyles(element);

		if (direction === 'ltr') {
			if (
				elementOffsetLeft + element.offsetWidth + elementStyles.scrollMarginRight >
				scrollContainer.scrollLeft +
					scrollContainer.clientWidth -
					containerStyles.scrollPaddingRight
			) {
				// overflow to the right, scroll to align right edges
				targetX =
					elementOffsetLeft +
					element.offsetWidth +
					elementStyles.scrollMarginRight -
					scrollContainer.clientWidth +
					containerStyles.scrollPaddingRight;
			} else if (
				elementOffsetLeft - elementStyles.scrollMarginLeft <
				scrollContainer.scrollLeft + containerStyles.scrollPaddingLeft
			) {
				// overflow to the left, scroll to align left edges
				targetX =
					elementOffsetLeft -
					elementStyles.scrollMarginLeft -
					containerStyles.scrollPaddingLeft;
			}
		}

		if (direction === 'rtl') {
			if (
				elementOffsetLeft - elementStyles.scrollMarginRight <
				scrollContainer.scrollLeft + containerStyles.scrollPaddingLeft
			) {
				// overflow to the left, scroll to align left edges
				targetX =
					elementOffsetLeft -
					elementStyles.scrollMarginLeft -
					containerStyles.scrollPaddingLeft;
			} else if (
				elementOffsetLeft + element.offsetWidth + elementStyles.scrollMarginRight >
				scrollContainer.scrollLeft +
					scrollContainer.clientWidth -
					containerStyles.scrollPaddingRight
			) {
				// overflow to the right, scroll to align right edges
				targetX =
					elementOffsetLeft +
					element.offsetWidth +
					elementStyles.scrollMarginRight -
					scrollContainer.clientWidth +
					containerStyles.scrollPaddingRight;
			}
		}
	}

	if (isOverflowingY && orientation !== 'horizontal') {
		const elementOffsetTop = getOffset(scrollContainer, element, 'top');
		const containerStyles = getStyles(scrollContainer);
		const elementStyles = getStyles(element);

		if (
			elementOffsetTop - elementStyles.scrollMarginTop <
			scrollContainer.scrollTop + containerStyles.scrollPaddingTop
		) {
			// overflow upwards, align top edges
			targetY =
				elementOffsetTop - elementStyles.scrollMarginTop - containerStyles.scrollPaddingTop;
		} else if (
			elementOffsetTop + element.offsetHeight + elementStyles.scrollMarginBottom >
			scrollContainer.scrollTop +
				scrollContainer.clientHeight -
				containerStyles.scrollPaddingBottom
		) {
			// overflow downwards, align bottom edges
			targetY =
				elementOffsetTop +
				element.offsetHeight +
				elementStyles.scrollMarginBottom -
				scrollContainer.clientHeight +
				containerStyles.scrollPaddingBottom;
		}
	}

	scrollContainer.scrollTo({
		left: targetX,
		top: targetY,
		behavior: 'auto',
	});
}

function getOffset(ancestor: HTMLElement, element: HTMLElement, side: 'left' | 'top') {
	const propName = side === 'left' ? 'offsetLeft' : 'offsetTop';

	let result = 0;

	while (element.offsetParent) {
		result += element[propName];

		if (element.offsetParent === ancestor) {
			break;
		}
		element = element.offsetParent as HTMLElement;
	}

	return result;
}

function getStyles(element: HTMLElement) {
	const styles = getComputedStyle(element);

	return {
		scrollMarginTop: parseFloat(styles.scrollMarginTop) || 0,
		scrollMarginRight: parseFloat(styles.scrollMarginRight) || 0,
		scrollMarginBottom: parseFloat(styles.scrollMarginBottom) || 0,
		scrollMarginLeft: parseFloat(styles.scrollMarginLeft) || 0,
		scrollPaddingTop: parseFloat(styles.scrollPaddingTop) || 0,
		scrollPaddingRight: parseFloat(styles.scrollPaddingRight) || 0,
		scrollPaddingBottom: parseFloat(styles.scrollPaddingBottom) || 0,
		scrollPaddingLeft: parseFloat(styles.scrollPaddingLeft) || 0,
	};
}

