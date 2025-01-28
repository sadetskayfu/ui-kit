import { Meta, StoryObj } from '@storybook/react'
import ScrollableContent from './ScrollableContent'
import { Button } from '@/shared/ui/Button'

const meta: Meta<typeof ScrollableContent> = {
	title: 'shared/ScrollableContent',
	component: ScrollableContent,
	args: {
		children: [
			<Button variant="clear">Button 1</Button>,
			<Button variant="clear">Button 2</Button>,
			<Button variant="clear">Button 3</Button>,
			<Button variant="clear">Button 4</Button>,
			<Button variant="clear">Button 5</Button>,
			<Button variant="clear">Button 6</Button>,
		],
	},
}

export default meta

type Story = StoryObj<typeof ScrollableContent>

export const HorizontalScrollableContent: Story = {
	args: {
		orientation: 'horizontal',
		itemsGap: 5,
		style: {
			maxWidth: '300px',
			width: '100%',
			backgroundColor: 'black',
			borderRadius: 6 / 16 + 'rem',
			padding: 5 / 16 + 'rem',
		},
	},
}

export const VerticalScrollableContent: Story = {
	args: {
		orientation: 'vertical',
		itemsGap: 5,
		style: {
			maxHeight: '300px',
			height: '100%',
			backgroundColor: 'black',
			borderRadius: 6 / 16 + 'rem',
			padding: 5 / 16 + 'rem',
		},
	},
}
