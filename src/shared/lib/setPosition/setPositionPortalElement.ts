import { Position } from './Position'

export type SetPositionPortalElementArgs = {
	element: HTMLElement,
	parent: HTMLElement,
	position: Position,
	reserveSpace?: number
}

type Spaces = {
	bottom: number
	top: number
	right: number
	left: number
}

type Translates = {
	x: number
	y: number
}

export const setPositionPortalElement = (
	args: SetPositionPortalElementArgs
) => {
	const {element, parent, position, reserveSpace = 10} = args
	
	const elementHeight = element.offsetHeight
	const elementWidth = element.offsetWidth

	const parentRect = parent.getBoundingClientRect()
	const parentWidth = parentRect.width
	const parentHeight = parentRect.height

	const differenceWidth = Math.abs(parentWidth - elementWidth)
	const differenceHeight = Math.abs(parentHeight - elementHeight)

	const isFullScreenWidth = element.style.width === '100vw'
	const isFullScreenHeight = element.style.height === '100vh'
	const isParentWidth = element.style.width === '100%'
	const isParentHeight = element.style.height === '100%'

	const translates: Translates = {
		x: 0,
		y: 0,
	}

	const spaces: Spaces = {
		bottom: window.innerHeight - parentRect.bottom,
		top: parentRect.top,
		right: window.innerWidth - parentRect.right,
		left: parentRect.left,
	}

	const getPositionX = (
		position: 'left' | 'right' | 'start' | 'end' | 'center'
	) => {
		switch (position) {
			case 'left':
				return parentRect.left - elementWidth + window.scrollX
			case 'right':
				return parentRect.right + window.scrollX
			case 'start':
				return parentRect.left + window.scrollX
			case 'center':
				return parentRect.left + (parentWidth - elementWidth) / 2 + window.scrollX
			case 'end':
				return parentRect.right - elementWidth + window.scrollX
		}
	}
	const getPositionY = (
		position: 'top' | 'bottom' | 'start' | 'end' | 'center'
	) => {
		switch (position) {
			case 'top':
				return parentRect.top - elementHeight + window.scrollY
			case 'bottom':
				return parentRect.bottom + window.scrollY
			case 'start':
				return parentRect.top + window.scrollY
			case 'center':
				return parentRect.top + (parentHeight - elementHeight) / 2 + window.scrollY
			case 'end':
				return parentRect.bottom - elementHeight + window.scrollY
		}
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

	// Position X
	switch (position) {
		case 'top':
		case 'bottom':
			if (isFullScreenWidth) {
				translates.x = 0
				break
			}
			if (isParentWidth) {
				translates.x = getPositionX('center')
				break
			}
			if (checks.isLeft(differenceWidth / 2)) {
				translates.x = getPositionX('end')
				break
			}
			if (checks.isRight(differenceWidth / 2)) {
				translates.x = getPositionX('start')
				break
			}
			translates.x = getPositionX('center')
			break
		case 'top-start':
		case 'bottom-start':
			translates.x = checks.isLeft(differenceWidth)
				? getPositionX('end')
				: getPositionX('start')
			break
		case 'top-end':
		case 'bottom-end':
			translates.x = checks.isRight(differenceWidth)
				? getPositionX('start')
				: getPositionX('end')
			break
		case 'left':
		case 'left-start':
		case 'left-end':
			translates.x = checks.isRight(elementWidth)
				? getPositionX('right')
				: getPositionX('left')
			break
		case 'right':
		case 'right-start':
		case 'right-end':
			translates.x = checks.isLeft(elementWidth)
				? getPositionX('left')
				: getPositionX('right')
			break
	}

	// Position Y
	switch (position) {
		case 'left':
		case 'right':
			if (isFullScreenHeight) {
				translates.y = 0
				break
			}
			if (isParentHeight) {
				translates.y = getPositionY('center')
				break
			}
			if (checks.isTop(differenceHeight / 2)) {
				translates.y = getPositionY('end')
				break
			}
			if (checks.isBottom(differenceHeight / 2)) {
				translates.y = getPositionY('start')
				break
			}
			translates.y = getPositionY('center')
			break
		case 'left-start':
		case 'right-start':
			translates.y = checks.isTop(differenceHeight)
				? getPositionY('end')
				: getPositionY('start')
			break
		case 'left-end':
		case 'right-end':
			translates.y = checks.isBottom(differenceHeight)
				? getPositionY('start')
				: getPositionY('end')
			break
		case 'top':
		case 'top-start':
		case 'top-end':
			translates.y = checks.isBottom(elementHeight)
				? getPositionY('bottom')
				: getPositionY('top')
			break
		case 'bottom':
		case 'bottom-start':
		case 'bottom-end':
			translates.y = checks.isTop(elementHeight)
				? getPositionY('top')
				: getPositionY('bottom')
			break
	}

	element.style.translate = `${translates.x / 16}rem ${translates.y / 16}rem`
}
