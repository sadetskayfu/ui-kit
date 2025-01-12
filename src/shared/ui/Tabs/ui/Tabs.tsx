import {
	Children,
	cloneElement,
	ReactElement,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { TabProps } from '@/shared/ui/Tab'
import { classNames } from '@/shared/lib/classNames/classNames'
import {
	getElements,
	useKeyboardNavigation,
} from '@/shared/lib/KeyboardNavigation/floatingIndex'
import { useFloatingIndicator } from '@/shared/hooks'
import {
	FloatingIndicator,
	FloatingIndicatorPosition,
} from '@/shared/ui/FloatingIndicator'
import styles from './style.module.scss'

interface AriaAttributes {
	'aria-label': string
}

export type TabsOrientation = 'horizontal' | 'vertical'

export interface TabsProps extends AriaAttributes {
	className?: string
	children: ReactElement<TabProps>[]
	selectedValue: string
	onChange: (value: string) => void
	orientation?: TabsOrientation
	indicator?: boolean
	indicatorPosition?: FloatingIndicatorPosition
}

export const Tabs = (props: TabsProps) => {
	const {
		className,
		children,
		selectedValue,
		onChange,
		orientation = 'horizontal',
		indicator: visibleIndicator,
		indicatorPosition = 'bottom',
		...otherProps
	} = props

	const tabListRef = useRef<HTMLDivElement | null>(null)
	const activeTabRef = useRef<HTMLElement | null>(null)
	const indicatorRef = useRef<HTMLSpanElement | null>(null)

	const tabsRef = getElements(tabListRef)

	const { handleKeyDown, handleFocus } = useKeyboardNavigation(tabsRef)

	const handleChangeIndicatorPosition = useFloatingIndicator({
		indicatorRef,
		activeElementRef: activeTabRef,
		elementListRef: tabListRef,
		orientation,
		isVisible: visibleIndicator,
	})

	// Set ref active tab
	useEffect(() => {
		if (!visibleIndicator) return

		const tabs = tabsRef.current

		if (tabs.length > 0) {
			tabs.forEach((tab) => {
				if (tab.getAttribute('data-value') === selectedValue) {
					activeTabRef.current = tab
					return
				}
			})
		}
	}, [selectedValue, visibleIndicator])

	// Change indicator position
	useEffect(() => {
		if (visibleIndicator) {
			handleChangeIndicatorPosition()
		}
	}, [selectedValue, orientation, visibleIndicator])

	const renderTabs = useMemo(() => {
		return Children.map(children, (tab, index) => {
			const tabValue = tab.props.value
			const isSelected = tabValue === selectedValue

			return cloneElement(tab, {
				selected: isSelected,
				onClick: onChange,
				onKeyDown: handleKeyDown,
				onFocus: () => handleFocus(index),
			})
		})
	}, [handleKeyDown, handleFocus, selectedValue, onChange, children])

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[orientation],
	]

	return (
		<div
			className={classNames(styles['tabs'], additionalClasses)}
			ref={tabListRef}
			role="tablist"
			{...otherProps}
		>
			{renderTabs}
			{visibleIndicator && (
				<FloatingIndicator ref={indicatorRef} position={indicatorPosition} />
			)}
		</div>
	)
}
