import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import throttle from 'lodash/throttle'
import { Z_INDEX } from '@/shared/constants/zIndex'
import { type Position, setPosition } from '@/shared/lib/setPosition'
import styles from './style.module.scss'

export type DropdownPosition = Position

interface DropdownProps {
	className?: string
	position?: DropdownPosition
	children: ReactNode
	isOpen: boolean
	parentRef: React.RefObject<HTMLElement>
	transition?: boolean
	width?: string
	height?: string
	zIndex?: number
	onClose: () => void
}

export const Dropdown = (props: DropdownProps) => {
	const {
		className,
		position = 'bottom',
		children,
		isOpen,
		parentRef,
		transition,
		width,
		height,
		zIndex = Z_INDEX.DROPDOWN,
		onClose,
	} = props

	const dropdownRef = useRef<HTMLDivElement | null>(null)

	const handleClose = useCallback(
		(event: MouseEvent) => {
			const dropdown = dropdownRef.current
			const parent = parentRef.current

			if (!dropdown || !parent) return

			if (
				!dropdown.contains(event.target as Node) &&
				!parent.contains(event.target as Node)
			) {
				onClose()
			}
		},
		[onClose, parentRef]
	)

	const handleMouseDown = (event: React.MouseEvent) => {
		event.preventDefault()
	}

	const handleChangePosition = useCallback(() => {
		const parent = parentRef.current
		const dropdown = dropdownRef.current

		if (parent && dropdown) {
			setPosition(dropdown, parent, position)
		}
	}, [parentRef, position])

	useEffect(() => {
		if (!isOpen) return

		const throttledHandleChanges = throttle(handleChangePosition, 100)

		window.addEventListener('resize', throttledHandleChanges)

		handleChangePosition()

		return () => {
			window.removeEventListener('resize', throttledHandleChanges)
			throttledHandleChanges.cancel()
		}
	}, [isOpen, handleChangePosition])

	useEffect(() => {
		if (isOpen) {
			window.addEventListener('click', handleClose)
		}
		return () => {
			window.removeEventListener('click', handleClose)
		}
	}, [isOpen, handleClose])

	const mods: Record<string, boolean | undefined> = {
		[styles['open']]: isOpen,
		[styles['transition']]: transition,
	}

	return (
		<div
			className={classNames(styles['dropdown'], [className], mods)}
			ref={dropdownRef}
			onMouseDown={handleMouseDown}
			role="presentation"
			style={{
				width: width,
				height: height,
				zIndex: isOpen ? zIndex : -1000,
			}}
		>
			{children}
		</div>
	)
}
