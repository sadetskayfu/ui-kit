import {
	Children,
	cloneElement,
	ReactElement,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { TabProps } from '@/shared/ui/Tab'
import { findNextEnabledElement } from '@/shared/lib/findNextEnabledElement/findNextEnabledElement'
import { classNames } from '@/shared/lib/classNames/classNames'
import { setIndicatorPosition } from '@/shared/lib/setIndicatorPosition/setIndicatorPosition'
import throttle from 'lodash/throttle'
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
    indicator?: boolean,
}

export const Tabs = (props: TabsProps) => {
	const { className, children, selectedValue, onChange, orientation = 'horizontal', indicator: visibleIndicator, ...otherProps } = props

	const [activeTabIndex, setActiveTabIndex] = useState(-1)

	const tabListRef = useRef<HTMLDivElement | null>(null)
	const tabsRef = useRef<HTMLElement[]>([])
    const activeTabRef = useRef<HTMLElement | null>(null)
    const indicatorRef = useRef<HTMLSpanElement | null>(null)

	// Get items
	useEffect(() => {
		const tabList = tabListRef.current

		if (!tabList) return

		const updateTabs = () => {
			const tabs = Array.from(tabList.querySelectorAll<HTMLElement>('a, button'))
			tabsRef.current = tabs
		}

		const observer = new MutationObserver(updateTabs)

		observer.observe(tabList, {
			childList: true,
		})

		updateTabs()

		return () => {
			observer.disconnect()
		}
	}, [])

	const handleFocus = useCallback((index: number) => {
		if (index !== activeTabIndex) {
			setActiveTabIndex(index)
		}
	}, [activeTabIndex])

	const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
		let nextIndex: number = activeTabIndex
        const tabs = tabsRef.current

		if (orientation === 'horizontal') {
			switch (event.key) {
				case 'ArrowLeft':
					event.preventDefault()
					nextIndex = findNextEnabledElement(tabs, activeTabIndex, -1)
					break
				case 'ArrowRight':
					event.preventDefault()
					nextIndex = findNextEnabledElement(tabs, activeTabIndex, 1)
					break
				default:
					break
			}
		} else {
			switch (event.key) {
				case 'ArrowUp':
					event.preventDefault()
					nextIndex = findNextEnabledElement(tabs, activeTabIndex, -1)
					break
				case 'ArrowDown':
					event.preventDefault()
					nextIndex = findNextEnabledElement(tabs, activeTabIndex, 1)
					break
				default:
					break
			}
		}

		if (nextIndex !== activeTabIndex) {
			setActiveTabIndex(nextIndex)
		}
	}, [activeTabIndex, orientation])

    const handleChangeIndicatorPosition = useCallback(() => {
        const indicator = indicatorRef.current
        const activeTab = activeTabRef.current
        const tabList = tabListRef.current
        
        if(indicator && activeTab && tabList) {
            setIndicatorPosition(indicator, activeTab, tabList, orientation)
        }
    }, [])

    // Set focus
	useEffect(() => {
		if (activeTabIndex !== -1) {
			const tabs = tabsRef.current
			tabs[activeTabIndex].focus()
		}
	}, [activeTabIndex])

    // Set active tab ref
    useEffect(() => {
        if(!visibleIndicator) return

        const tabs = tabsRef.current

        if(tabs.length > 0) {
            tabs.forEach((tab) => {
                if(tab.getAttribute('data-value') === selectedValue) {
                    activeTabRef.current = tab
                    return
                }
            })
        }
 
    }, [selectedValue, visibleIndicator])

  useEffect(() => {
    if(!visibleIndicator) return

    const throttledHandleChangeIndicatorPosition = throttle(handleChangeIndicatorPosition, 100);

    window.addEventListener("resize", throttledHandleChangeIndicatorPosition);

    return () => {
      window.removeEventListener("resize", throttledHandleChangeIndicatorPosition);
      throttledHandleChangeIndicatorPosition.cancel();
    };

  }, [visibleIndicator]);

    // Set indicator styles
    useEffect(() => {
        if(!visibleIndicator) return

        handleChangeIndicatorPosition()
    }, [selectedValue, orientation, visibleIndicator, handleChangeIndicatorPosition])

	const renderTabs = useMemo(() => {
		return Children.map(children, (tab, index) => {
			return cloneElement(tab, {
				selectedValue,
				onClick: onChange,
				onKeyDown: handleKeyDown,
				onFocus: () => handleFocus(index),
			})
		})
	}, [handleKeyDown, handleFocus, selectedValue, onChange])

    const additionalClasses: Array<string | undefined> = [
        className,
        styles[orientation]
    ]

	return (
		<div className={classNames(styles['tabs'], additionalClasses)} ref={tabListRef} role="tablist" {...otherProps}>
			{renderTabs}
            {visibleIndicator && <span ref={indicatorRef} className={styles['indicator']}></span>}
		</div>
	)
}
