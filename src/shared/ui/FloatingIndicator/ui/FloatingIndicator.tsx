import { useCallback, useEffect, useRef } from 'react'
import { classNames } from '@/shared/helpers/classNames'
import throttle from 'lodash/throttle'
import styles from './style.module.scss'

export type FloatingIndicatorPosition = 'top' | 'right' | 'bottom' | 'left'
type FloatingIndicatorOrientation = 'horizontal' | 'vertical'

interface FloatingIndicatorProps {
	position?: FloatingIndicatorPosition
	orientation: FloatingIndicatorOrientation
	elementListRef: React.RefObject<HTMLElement>
	activeElementRef: React.RefObject<HTMLElement>
	selectedValue: string
	updateTriggers?: any[]
}

const FloatingIndicator = (props: FloatingIndicatorProps) => {
	const {
		position = 'bottom',
		orientation,
		elementListRef,
		activeElementRef,
		selectedValue,
		updateTriggers = [],
	} = props

	const indicatorRef = useRef<HTMLSpanElement | null>(null)

	const handleChangePosition = useCallback(() => {
		const indicator = indicatorRef.current
		const activeElement = activeElementRef.current
		const elementList = elementListRef.current
	
		if (!indicator || !activeElement || !elementList) return
		console.log('change position')
		const activeElementRect = activeElement.getBoundingClientRect()
		const elementListRect = elementList.getBoundingClientRect()
		
		if (orientation === 'horizontal') {
			const left = activeElementRect.left - elementListRect.left

			Object.assign(indicator.style, {
				width: `${activeElementRect.width / 16}rem`,
				left: `${left / 16}rem`,
				height: '1px',
				top: '',
			})
		} else {
			const top = activeElementRect.top - elementListRect.top

			Object.assign(indicator.style, {
				height: `${activeElementRect.height / 16}rem`,
				top: `${top / 16}rem`,
				width: '',
				left: '',
			})
		}
	}, [orientation])

	useEffect(() => {
		const throttledHandleChangePosition = throttle(
			handleChangePosition,
			100
		)
		const resizeObserver = new ResizeObserver(throttledHandleChangePosition)

		const elementList = elementListRef.current

		if(elementList) {
			resizeObserver.observe(elementList)
		}

		return () => {
			throttledHandleChangePosition.cancel()
			resizeObserver.disconnect()
		}
	}, [handleChangePosition])

	useEffect(() => {
		setTimeout(() => {
			handleChangePosition()
		}, 0)
	}, [selectedValue, orientation, [...updateTriggers]])

	const additionalClasses: Array<string | undefined> = [styles[position]]

	return (
		<span
			ref={indicatorRef}
			className={classNames(styles['indicator'], additionalClasses)}
			aria-hidden='true'
		></span>
	)
}

export default FloatingIndicator