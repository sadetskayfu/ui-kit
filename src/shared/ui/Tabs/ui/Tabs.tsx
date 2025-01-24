import {
	Children,
	cloneElement,
	ReactElement,
	Suspense,
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react'
import { TabProps } from '@/shared/ui/Tab'
import { classNames } from '@/shared/helpers/classNames'
import {
	useElements,
	useKeyboardNavigation,
} from '@/shared/lib/KeyboardNavigation/floatingIndex'
import {
	FloatingIndicatorLazy,
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
	orientation?: TabsOrientation
	isIndicator?: boolean
	indicatorPosition?: FloatingIndicatorPosition
	onChange: (value: string) => void
}

export const Tabs = (props: TabsProps) => {
	const {
		className,
		children,
		selectedValue,
		orientation = 'horizontal',
		isIndicator,
		indicatorPosition = 'bottom',
		onChange,
		...otherProps
	} = props

	const tabListRef = useRef<HTMLDivElement | null>(null)
	const activeTabRef = useRef<HTMLElement | null>(null)

	const tabsRef = useElements(tabListRef)

	const { handleKeyDown, handleFocus } = useKeyboardNavigation(tabsRef)

	// Set ref active tab
	useEffect(() => {
		if (!isIndicator) return

		const tabs = tabsRef.current

		if (tabs.length > 0) {
			const selectedTab = tabs.find((tab) => {
				if (tab.getAttribute('data-value') === selectedValue) {
					return tab
				}
			})
			if (selectedTab) {
				activeTabRef.current = selectedTab
			}
		}
	}, [selectedValue, isIndicator])

	const renderTabs = useMemo(() => {
		return Children.map(children, (tab, index) => {
			const tabValue = tab.props.value
			const isSelected = tabValue === selectedValue

			const callbackHandleFocus = useCallback(() => {
				handleFocus(index)
			}, [handleFocus])

			return cloneElement(tab, {
				isSelected,
				onClick: onChange,
				onKeyDown: handleKeyDown,
				onFocus: callbackHandleFocus,
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
			{isIndicator && (
				<Suspense>
					<FloatingIndicatorLazy
						selectedValue={selectedValue}
						activeElementRef={activeTabRef}
						elementListRef={tabListRef}
						orientation={orientation}
						position={indicatorPosition}
					/>
				</Suspense>
			)}
		</div>
	)
}
