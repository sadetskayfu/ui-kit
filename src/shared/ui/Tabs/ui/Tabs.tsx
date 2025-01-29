import { Children, cloneElement, ReactElement, Suspense, useRef } from 'react'
import { TabProps } from '@/shared/ui/Tab'
import { classNames } from '@/shared/helpers/classNames'
import {
	useElements,
	useKeyboardNavigation,
} from '@/shared/lib/KeyboardNavigation/floatingIndex'
import { ScrollableContentLazy } from '@/shared/ui/ScrollableContent'
import { IndicatorPosition } from '@/shared/ui/Indicator'
import styles from './style.module.scss'

interface AriaAttributes {
	'aria-label'?: string
	'aria-labelledby'?: string
}

export type TabsOrientation = 'horizontal' | 'vertical'

export interface TabsProps extends AriaAttributes {
	className?: string
	children: ReactElement<TabProps>[]
	selectedValue: string
	orientation?: TabsOrientation
	isScrollable?: boolean
	isIndicator?: boolean
	indicatorPosition?: IndicatorPosition
	gap?: number
	style?: React.CSSProperties
	onChange: (value: string) => void
}

export const Tabs = (props: TabsProps) => {
	const {
		className,
		children,
		selectedValue,
		orientation = 'horizontal',
		isScrollable,
		isIndicator,
		indicatorPosition,
		gap,
		style,
		onChange,
		...otherProps
	} = props

	const tabListRef = useRef<HTMLDivElement>(null)

	const tabsRef = useElements(tabListRef, true, 'tab')

	const { handleKeyDown, updateActiveIndex } = useKeyboardNavigation(tabsRef)

	const renderTabs = () => {
		return Children.map(children, (tab, index) => {
			const tabValue = tab.props.value
			const isSelected = tabValue === selectedValue

			return cloneElement(tab, {
				isSelected,
				isIndicator,
				indicatorPosition,
				onClick: onChange,
				onFocus: isScrollable ? undefined : () => updateActiveIndex(index),
				key: tabValue,
			})
		})
	}

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[orientation],
	]

	const isHorizontal = orientation === 'horizontal'

	const remGap = gap && (gap / 16 + 'rem')

	return (
		<div
			className={classNames(styles['tabs'], additionalClasses)}
			ref={tabListRef}
			onKeyDown={handleKeyDown}
			role="tablist"
			style={{ gap: isScrollable ? '' : remGap, ...style }}
			{...otherProps}
		>
			{isScrollable ? (
				<Suspense>
					<ScrollableContentLazy
						style={{
							width: isHorizontal ? '100%' : '',
							height: !isHorizontal ? '100%' : '',
						}}
						onFocus={updateActiveIndex}
						orientation={orientation}
						itemsGap={gap}
					>
						{renderTabs()}
					</ScrollableContentLazy>
				</Suspense>
			) : (
				renderTabs()
			)}
		</div>
	)
}
