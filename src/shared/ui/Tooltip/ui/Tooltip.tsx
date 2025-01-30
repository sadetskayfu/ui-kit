import {
	cloneElement,
	ReactElement,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react'

import { classNames } from '@/shared/helpers/classNames'
import { Portal } from '@/shared/ui/Portal'
import { Z_INDEX } from '@/shared/constants/zIndex'
import {
	useDelayMouseHover,
	useLongTouch,
	useTouchDevice,
} from '@/shared/hooks'
import type {
	SetPositionPortalElementArgs,
	Position,
} from '@/shared/lib/setPosition'
import type { setPositionFollowCursorArgs } from '../lib'
import { CSSTransition } from 'react-transition-group'
import throttle from 'lodash/throttle'
import styles from './style.module.scss'

interface TooltipProps {
	className?: string
	position?: Position
	children: ReactElement
	Content: ReactElement
	disabledFocus?: boolean
	disabledHover?: boolean
	disabledTouch?: boolean
	disabledClick?: boolean
	zIndex?: number
	delay?: number
	isClickableTooltip?: boolean
	isFollowCursor?: boolean
	isLazy?: boolean
	isUnmount?: boolean
	parentRef?: React.RefObject<HTMLElement>
}

export const Tooltip = (props: TooltipProps) => {
	const {
		className,
		position = 'top',
		children,
		Content,
		disabledFocus,
		disabledHover,
		disabledTouch,
		disabledClick = true,
		zIndex = Z_INDEX.TOOLTIP,
		delay = 0,
		isClickableTooltip,
		isFollowCursor,
		isLazy,
		isUnmount,
		parentRef: externalParentRef,
	} = props

	const [isVisible, setIsVisible] = useState<boolean>(false)

	const localParentRef = useRef<HTMLElement>(null)
	const parentRef = externalParentRef ? externalParentRef : localParentRef
	const tooltipRef = useRef<HTMLDivElement>(null)
	const setPositionRef = useRef<
		((args: SetPositionPortalElementArgs) => void) | null
	>(null)
	const setPositionFollowCursorRef = useRef<
		((args: setPositionFollowCursorArgs) => void) | null
	>(null)

	const { isTouchDevice } = useTouchDevice()

	const tooltipId = useId()

	// eslint-disable-next-line
	const handleMouseMove = useCallback(
		throttle(
			(event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
				const tooltip = tooltipRef.current

				if (tooltip && setPositionFollowCursorRef.current) {
					setPositionFollowCursorRef.current({
						event,
						tooltip,
					})
				}
			},
			20
		),
		[]
	)

	const handleOpen = (event: React.MouseEvent | React.TouchEvent) => {
		setIsVisible(true)

		if (isFollowCursor) {
			handleMouseMove(event)
		}
	}

	const handleClose = useCallback(() => {
		setIsVisible(false)
	}, [])

	const handleToggle = () => {
		setIsVisible((prev) => !prev)
	}

	const { handleTouchStart, handleTouchEnd } = useLongTouch({
		onTouchStart: handleOpen,
		onTouchEnd: handleClose,
	})

	const handleMouseEnter = (event: React.MouseEvent) => {
		if (!isTouchDevice && !disabledHover) {
			handleOpen(event)

			if (isFollowCursor) {
				document.addEventListener('mousemove', handleMouseMove)
			}
		}
	}

	const handleMouseLeave = () => {
		if (!isTouchDevice && !disabledHover) {
			handleClose()

			if (isFollowCursor) {
				document.removeEventListener('mousemove', handleMouseMove)
			}
		}
	}

	const { handleMouseEnterDelay, handleMouseLeaveDelay } = useDelayMouseHover({
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
		delay,
	})

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			const tooltip = tooltipRef.current
			const parent = parentRef.current

			if (!tooltip || !parent) return

			if (
				isClickableTooltip &&
				!tooltip.contains(event.target as Node) &&
				!parent.contains(event.target as Node)
			) {
				handleClose()
			} else if (!isClickableTooltip && !parent.contains(event.target as Node)) {
				handleClose()
			}
		},
		[isClickableTooltip, handleClose, parentRef]
	)

	// Import change position function
	useEffect(() => {
		const loadPositioningFunction = async () => {
			if (isFollowCursor) {
				const { setPositionFollowCursor } = await import('../lib')
				setPositionFollowCursorRef.current = setPositionFollowCursor
			} else {
				const { setPositionPortalElement } = await import(
					'@/shared/lib/setPosition'
				)
				setPositionRef.current = setPositionPortalElement
			}
		}
		loadPositioningFunction()
	}, [isFollowCursor])

	useEffect(() => {
		if (isFollowCursor) return

		const parent = parentRef.current
		const tooltip = tooltipRef.current

		if (!isVisible || !parent || !tooltip) return

		const handleChangePosition = () => {
			setPositionRef.current!({
				element: tooltip,
				parent,
				position,
			})
		}

		const throttledHandleChanges = throttle(handleChangePosition, 20)

		const resizeObserver = new ResizeObserver(throttledHandleChanges)

		resizeObserver.observe(tooltip)
		resizeObserver.observe(parent)

		window.addEventListener('resize', throttledHandleChanges)

		return () => {
			resizeObserver.disconnect()
			window.removeEventListener('resize', throttledHandleChanges)
			throttledHandleChanges.cancel()
		}
	}, [isVisible, isFollowCursor, parentRef, position])

	useEffect(() => {
		if (isVisible && !disabledClick) {
			document.addEventListener('click', handleClickOutside)
		}
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [disabledClick, handleClickOutside, isVisible])

	useEffect(() => {
		return () => {
			handleMouseMove.cancel()
			document.removeEventListener('mousemove', handleMouseMove)
		}
	}, [handleMouseMove])

	const triggerElementProps = {
		ref: externalParentRef ? undefined : localParentRef,
		onFocus: isTouchDevice || disabledFocus ? undefined : handleOpen,
		onBlur: isTouchDevice || disabledFocus ? undefined : handleClose,
		onMouseEnter: handleMouseEnterDelay,
		onMouseLeave: isClickableTooltip ? undefined : handleMouseLeaveDelay,
		onTouchStart:
			isTouchDevice && !disabledTouch
				? isFollowCursor
					? handleOpen
					: handleTouchStart
				: undefined,
		onTouchEnd:
			isTouchDevice && !disabledTouch
				? isFollowCursor
					? handleClose
					: handleTouchEnd
				: undefined,
		onTouchMove: isTouchDevice && isFollowCursor ? handleMouseMove : undefined,
		onClick: disabledClick ? undefined : handleToggle,
		'aria-labelledby': isVisible ? tooltipId : undefined,
	}

	const isVertical = position.includes('top') || position.includes('bottom')

	const mods: Record<string, boolean | undefined> = {
		[styles['vertical']]: isVertical,
	}

	return (
		<div
			className={classNames(styles['container'], [className])}
			onMouseLeave={isClickableTooltip ? handleMouseLeaveDelay : undefined}
		>
			{cloneElement(children, { ...triggerElementProps })}
			<CSSTransition
				nodeRef={tooltipRef}
				in={isVisible}
				unmountOnExit={isUnmount}
				mountOnEnter={isLazy}
				timeout={200}
				classNames={{
					enter: styles['enter'],
					enterDone: styles['enter-done'],
					exit: styles['exit'],
				}}
			>
				<Portal>
					<div
						ref={tooltipRef}
						className={classNames(styles['tooltip'], [styles[position]], mods)}
						onMouseEnter={
							isClickableTooltip && isVisible ? handleMouseEnterDelay : undefined
						}
						style={{
							zIndex,
							pointerEvents: isFollowCursor ? 'none' : undefined,
						}}
					>
						<div role="tooltip" id={tooltipId} className={styles['content']}>
							{Content}
						</div>
					</div>
				</Portal>
			</CSSTransition>
		</div>
	)
}
