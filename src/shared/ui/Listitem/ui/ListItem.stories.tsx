import { Meta, StoryObj } from '@storybook/react'
import { ListItem } from './ListItem/ListItem'
import { ListItemLink } from './ListItemLink/ListItemLink'
import { Arrow } from '@/shared/assets/icons'
import { useId, useState } from 'react'
import { Collapse } from '@/shared/ui/Collapse'
import { ListItemButton } from './ListItemButton/ListItemButton'
import { ListItemContent } from './ListItemContent/ListItemContent'

const meta: Meta<typeof ListItem> = {
	title: 'shared/ListItem',
	component: ListItem,
	args: {},
}

export default meta

type Story = StoryObj<typeof ListItem>

const ListWrapperWithCollapse = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const handleToggle = () => {
		setIsOpen((prev) => !prev)
	}

	const bodyId = useId()
	const headerId = useId()

	return (
		<div
			style={{ width: '300px', display: 'flex', flexDirection: 'column' }}
			role="list"
		>
			<ListItemLink to="/example1">
				<ListItemContent title="List item 1" />
			</ListItemLink>
			<ListItemLink to="/example2">
				<ListItemContent title="List item 2" />
			</ListItemLink>
			<ListItemButton
				id={headerId}
				onClick={handleToggle}
				isActive={isOpen}
				aria-controls={bodyId}
				aria-expanded={isOpen ? 'true' : 'false'}
			>
				<ListItemContent
					title="List item 3"
					description="Open collapse"
					EndSlot={
						<Arrow
							size="small-xx"
							direction={isOpen ? 'bottom' : 'right'}
						/>
					}
				/>
			</ListItemButton>
			<Collapse isOpen={isOpen} bodyId={bodyId} headerId={headerId} isUnmount>
				<ListItemLink style={{ paddingLeft: '15px' }} to="/example3.1">
					<ListItemContent title="List item 3.1" />
				</ListItemLink>
				<ListItemLink style={{ paddingLeft: '15px' }} to="/example3.2">
					<ListItemContent title="List item 3.2" />
				</ListItemLink>
			</Collapse>
			<ListItemLink to="/example4">
				<ListItemContent title="List item 4" />
			</ListItemLink>
		</div>
	)
}

export const ExampleItemListWithCollapse: Story = {
	render: () => ListWrapperWithCollapse(),
}
