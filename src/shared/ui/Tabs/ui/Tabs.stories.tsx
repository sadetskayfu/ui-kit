import { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'
import { useCallback, useState } from 'react'
import { Tab, TabVariant } from '@/shared/ui/Tab'
import { TabPanel } from '@/shared/ui/TabPanel'

const meta: Meta<typeof Tabs> = {
	title: 'shared/Tabs',
	component: Tabs,
	args: {
		orientation: 'horizontal',
		indicatorPosition: 'bottom',
		isScrollable: false,
		isIndicator: false,
	},
}

export default meta

type Story = StoryObj<typeof Tabs>

const TabsWrapper = (args: any, tabVariant: TabVariant) => {
	const [selectedTab, setSelectedTab] = useState<string>('1')

	const handleChange = useCallback((value: string) => {
		setSelectedTab(value)
	}, [])

	return (
		<Tabs
			selectedValue={selectedTab}
			onChange={handleChange}
			style={{ gap: tabVariant === 'filled' ? '10px' : '' }}
			{...args}
		>
			{Array.from({ length: 5 }, (_, index) => {
				const tabValue = index + 1 + ''
				const isDisabled = index === 3
				return (
					<Tab
						disabled={isDisabled}
						value={tabValue}
						label={`Tab ${tabValue} ${isDisabled ? 'disabled' : ''}`}
						variant={tabVariant}
						id=""
						panelId=""
					/>
				)
			})}
		</Tabs>
	)
}

const ScrollableTabsWrapper = (args: any, tabVariant: TabVariant) => {
	const [selectedTab, setSelectedTab] = useState<string>('1')

	const handleChange = useCallback((value: string) => {
		setSelectedTab(value)
	}, [])

	const isHorizontal = args.orientation === 'horizontal'
	const maxWidth = isHorizontal ? '500px' : ''
	const width = isHorizontal ? '100%' : ''
	const maxHeight = !isHorizontal ? '500px' : ''
	const height = !isHorizontal ? '100%' : ''

	return (
		<Tabs
			selectedValue={selectedTab}
			onChange={handleChange}
			style={{
				gap: tabVariant === 'filled' ? '10px' : '',
				maxWidth,
				width,
				maxHeight,
				height,
			}}
			{...args}
		>
			{Array.from({ length: 15 }, (_, index) => {
				const tabValue = index + 1 + ''
				const isDisabled = index === 3
				return (
					<Tab
						disabled={isDisabled}
						value={tabValue}
						label={`Tab ${tabValue} ${isDisabled ? 'disabled' : ''}`}
						variant={tabVariant}
						id=""
						panelId=""
					/>
				)
			})}
		</Tabs>
	)
}

const TabsWithPanelWrapper = (args: any, tabVariant: TabVariant = 'filled') => {
	const [selectedTab, setSelectedTab] = useState<string>('1')

	const handleChange = useCallback((value: string) => {
		setSelectedTab(value)
	}, [])

	const getTabId = (value: string) => {
		return `storybook-tab-${value}`
	}
	const getPanelId = (value: string) => {
		return `storybook-panel-${value}`
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: args.orientation === 'horizontal' ? 'column' : 'row',
			}}
		>
			<Tabs
				selectedValue={selectedTab}
				onChange={handleChange}
				aria-label="Tabs"
				{...args}
			>
				{Array.from({ length: 5 }, (_, index) => {
					const tabValue = index + 1 + ''
					return (
						<Tab
							value={tabValue}
							label={`Tab ${tabValue}`}
							variant={tabVariant}
							id={getTabId(tabValue)}
							panelId={getPanelId(tabValue)}
						/>
					)
				})}
			</Tabs>
			{Array.from({ length: 5 }, (_, index) => {
				const panelValue = index + 1 + ''
				return (
					<TabPanel
						id={getPanelId(panelValue)}
						labelId={getTabId(panelValue)}
						isActive={selectedTab === panelValue}
					>
						<div style={{ padding: '20px' }}>{`Panel ${panelValue}`}</div>
					</TabPanel>
				)
			})}
		</div>
	)
}

export const FilledTabs: Story = {
	render: (args) => TabsWrapper(args, 'filled'),
	args: {
		'aria-label': 'Filled tabs',
	},
}

export const ClearedTabsWithIndicator: Story = {
	render: (args) => TabsWrapper(args, 'clear'),
	args: {
		'aria-label': 'Clear tabs',
		isIndicator: true,
	},
}

export const ScrollableTabs: Story = {
	render: (args) => ScrollableTabsWrapper(args, 'clear'),
	args: {
		isScrollable: true,
		isIndicator: true,
		'aria-label': 'Scrollable tabs',
	},
}

export const TabsWithPanel: Story = {
	render: (args) => TabsWithPanelWrapper(args, 'clear'),
	args: {
		'aria-label': 'Tabs with panel',
		isIndicator: true,
	},
}
