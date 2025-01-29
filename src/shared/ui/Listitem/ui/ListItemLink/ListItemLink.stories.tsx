import { Meta, StoryObj } from '@storybook/react'
import { ListItemLink } from './ListItemLink'
import { ListItemContent } from '../ListItemContent/ListItemContent'

const meta: Meta<typeof ListItemLink> = {
	title: 'shared/ListItem/ListItemLink',
	component: ListItemLink,
	args: {
		indicatorPosition: 'left',
    },
}

export default meta

type Story = StoryObj<typeof ListItemLink>

const ListItemLinkWrapper = (args: any) => {
	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<ListItemLink to='/example1' {...args} >
				<ListItemContent title='List item link 1'/>
			</ListItemLink>
			<ListItemLink to='/example2' {...args} >
				<ListItemContent title='List item link 2'/>
			</ListItemLink>
			<ListItemLink to='/example3' {...args} >
				<ListItemContent title='List item link 3' description='Description'/>
			</ListItemLink>
		</div>
	)
}

export const DefaultListItemLink: Story = {
	render: (args) => ListItemLinkWrapper(args)
}

export const ExternalListItemLink: Story = {
	args: {
		children: <ListItemContent title='External link'/>,
		isExternalLink: true,
		to: 'https://example.com'
	}
}