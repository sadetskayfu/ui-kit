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
		indicator: false,
		indicatorPosition: 'bottom'
	},
}

export default meta

type Story = StoryObj<typeof Tabs>

const TabsWrapper = (args: any, tabVariant: TabVariant = 'filled') => {
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
				width: '600px',
			}}
		>
			<Tabs
				selectedValue={selectedTab}
				onChange={handleChange}
				aria-label="Storybook tabs"
				{...args}
			>
				<Tab
					id={getTabId('1')}
					panelId={getPanelId('1')}
					variant={tabVariant}
					label="First tab"
					value="1"
                    fullWidth
				/>
				<Tab
					id={getTabId('2')}
					panelId={getPanelId('1')}
					variant={tabVariant}
					label="Second tab"
					value="2"
                    fullWidth
				/>
				<Tab
					id={getTabId('3')}
					panelId={getPanelId('1')}
					variant={tabVariant}
					disabled
					label="Third disabled tab"
					value="3"
                    fullWidth
				/>
				<Tab
					id={getTabId('4')}
					panelId={getPanelId('1')}
					variant={tabVariant}
					label="Fourth tab"
					value="4"
                    fullWidth
				/>
			</Tabs>
			<TabPanel
				id={getPanelId('1')}
				labelId={getTabId('1')}
				isActive={selectedTab === '1'}
			>
				<div style={{ padding: '20px' }}>First panel</div>
			</TabPanel>
			<TabPanel
				id={getPanelId('2')}
				labelId={getTabId('2')}
				isActive={selectedTab === '2'}
			>
				<div style={{ padding: '20px' }}>Second panel</div>
			</TabPanel>
			<TabPanel
				id={getPanelId('4')}
				labelId={getTabId('4')}
				isActive={selectedTab === '4'}
			>
				<div style={{ padding: '20px' }}>Fourth panel</div>
			</TabPanel>
		</div>
	)
}

export const FilledTabs: Story = {
	render: (args) => TabsWrapper(args),
}

export const ClearTabsWithIndicator: Story = {
	render: (args) => TabsWrapper(args, 'clear'),
	args: {
		indicator: true,
	},
}
