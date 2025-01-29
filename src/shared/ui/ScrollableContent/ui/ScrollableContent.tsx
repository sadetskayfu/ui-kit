import {
	useRef,
	ReactElement,
	Children,
	cloneElement,
	useCallback,
	useEffect,
} from 'react'
import { useScroll } from '../hooks'
import { classNames } from '@/shared/helpers/classNames'
import { Arrow } from '@/shared/assets/icons'
import throttle from 'lodash/throttle'
import styles from './style.module.scss'

export type ScrollableContentOrientation = 'horizontal' | 'vertical'

interface ScrollableContentProps {
	className?: string
	itemsGap?: number
	children: ReactElement[]
	orientation?: ScrollableContentOrientation
	style?: React.CSSProperties
	onFocus?: (index: number) => void
	onScroll?: () => void
}

const ScrollableContent = (props: ScrollableContentProps) => {
	const {
		className,
		itemsGap,
		children,
		orientation = 'horizontal',
		style,
		onFocus,
		onScroll,
	} = props

	const containerRef = useRef<HTMLDivElement>(null)

	const { checkScroll, scroll, scrollToItem, showEndArrow, showStartArrow } =
		useScroll({ containerRef, orientation })

	const handleScroll = useCallback(
		throttle(() => {
			checkScroll()
			onScroll?.()
		}, 200),
		[onScroll, checkScroll]
	)

	useEffect(() => {
		return () => handleScroll.cancel()
	}, [handleScroll])

	const renderChildren = () =>
		Children.map(children, (child, index) => {
			const handleFocus = () => {
				scrollToItem(index)
				onFocus?.(index)
			}

			return cloneElement(child as ReactElement, {
				onFocus: handleFocus,
			})
		})

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[orientation],
	]

	const isHorizontal = orientation === 'horizontal'
	const gap = itemsGap && itemsGap / 16 + 'rem'

	return (
		<div
			className={classNames(styles['container'], additionalClasses)}
			role="presentation"
			style={{ ...style }}
		>
				<button
					className={styles['scroll-button']}
					style={{
						opacity: showStartArrow ? 1 : 0,
						pointerEvents: showStartArrow ? 'all' : 'none',
					}}
					onClick={() => scroll('start')}
					tabIndex={-1}
					aria-hidden="true"
				>
					<Arrow direction={isHorizontal ? 'left' : 'top'} size="small-xx" />
				</button>
			<div
				className={styles['items-container']}
				ref={containerRef}
				onScroll={handleScroll}
				role="presentation"
				style={{
					gap,
				}}
			>
				{renderChildren()}
			</div>
				<button
					className={styles['scroll-button']}
					style={{
						opacity: showEndArrow ? 1 : 0,
						pointerEvents: showEndArrow ? 'all' : 'none',
					}}
					onClick={() => scroll('end')}
					tabIndex={-1}
					aria-hidden="true"
				>
					<Arrow direction={isHorizontal ? 'right' : 'bottom'} size="small-xx" />
				</button>
		</div>
	)
}

export default ScrollableContent
