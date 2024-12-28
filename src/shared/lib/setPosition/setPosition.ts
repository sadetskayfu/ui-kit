import { Position } from './Position'

interface Spaces {
	bottom: number
	top: number
	right: number
	left: number
}

interface Styles {
	top: string
	bottom: string
	left: string
	right: string
    translate: string
}

export const setPosition = (
	element: HTMLElement,
	parent: HTMLElement,
	position: Position,
	reserveSpace: number = 10
) => {
	const elementHeight = element.offsetHeight
	const elementWidth = element.offsetWidth
	const parentRect = parent.getBoundingClientRect()
	const parentWidth = parentRect.width
	const parentHeight = parentRect.height

	const differenceWidth = Math.abs(parentWidth - elementWidth)
	const differenceHeight = Math.abs(parentHeight - elementHeight)

	let styles: Styles = {
		top: '',
		bottom: '',
		left: '',
		right: '',
        translate: '',
	}

	const spaces: Spaces = {
		bottom: window.innerHeight - parentRect.bottom,
		top: parentRect.top,
		right: window.innerWidth - parentRect.right,
		left: parentRect.left,
	}

	const checks = {
		isTop: (elementHeight: number): boolean =>
			elementHeight + reserveSpace > spaces.bottom && spaces.bottom < spaces.top,
		isBottom: (elementHeight: number): boolean =>
			elementHeight + reserveSpace > spaces.top && spaces.top < spaces.bottom,
		isLeft: (elementWidth: number): boolean =>
			elementWidth + reserveSpace > spaces.right && spaces.right < spaces.left,
		isRight: (elementWidth: number): boolean =>
			elementWidth + reserveSpace > spaces.left && spaces.left < spaces.right,
	}

	// Vertical position
	switch (position) {
		case 'left':
		case 'right':
			if (checks.isTop(differenceHeight / 2)) {
				styles.bottom = '0'
				break
			}
			if (checks.isBottom(differenceHeight / 2)) {
				styles.top = '0'
				break
			}
			styles.top = '50%'
            styles.translate = '0 -50%'
			break
		case 'left-start':
		case 'right-start':
			checks.isTop(differenceHeight)
				? styles.bottom = '0'
				: styles.top = '0'
			break
		case 'left-end':
		case 'right-end':
			checks.isBottom(differenceHeight)
				? styles.top = '0'
				: styles.bottom = '0'
			break
		case 'top':
		case 'top-start':
		case 'top-end':
			checks.isBottom(elementHeight)
				? styles.top = '100%'
				: styles.bottom = '100%'
			break
		case 'bottom':
		case 'bottom-start':
		case 'bottom-end':
			checks.isTop(elementHeight)
				? styles.bottom = '100%'
				: styles.top = '100%'
			break
	}
	// Horizontal position
	switch (position) {
		case 'top':
		case 'bottom':
			if (checks.isLeft(differenceWidth / 2)) {
				styles.right = '0'
				break
			}
			if (checks.isRight(differenceWidth / 2)) {
				styles.left = '0'
				break
			}
			styles.left = '50%'
            styles.translate = '-50%'
			break
		case 'top-start':
		case 'bottom-start':
			checks.isLeft(differenceWidth)
				? styles.right = '0'
				: styles.left = '0'
			break
		case 'top-end':
		case 'bottom-end':
			checks.isRight(differenceWidth)
				? styles.left = '0'
				: styles.right = '0'
			break
		case 'left':
		case 'left-start':
		case 'left-end':
			checks.isRight(elementWidth)
				? styles.left = '100%'
				: styles.right = '100%'
			break
		case 'right':
		case 'right-start':
		case 'right-end':
			checks.isLeft(elementWidth)
				? styles.right = '100%'
				: styles.left = '100%'
			break
	}

	element.style.top = styles.top
	element.style.bottom = styles.bottom
	element.style.left = styles.left
	element.style.right = styles.right
    element.style.translate = styles.translate
}
