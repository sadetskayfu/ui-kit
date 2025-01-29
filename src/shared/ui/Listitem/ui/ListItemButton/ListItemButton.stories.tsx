import { Meta, StoryObj } from '@storybook/react'
import { Gear } from '@/shared/assets/icons'
import { useState } from 'react'
import { ListItemButton } from './ListItemButton'
import { ListItemContent } from '../ListItemContent/ListItemContent'

const meta: Meta<typeof ListItemButton> = {
	title: 'shared/ListItem/ListItemButton',
	component: ListItemButton,
	args: {

    },
}

export default meta

type Story = StoryObj<typeof ListItemButton>

const ListItemButtonWrapper = (args: any) => {
	const [isSelected, setIsSelected] = useState<boolean>(false)
	const [isActive, setIsActive] = useState<boolean>(false)

	const handleChangeSelected = () => {
		setIsSelected((prev) => !prev)
	}
	const handleChangeActive = () => {
		setIsActive((prev) => !prev)
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column'}}>
			<ListItemButton onClick={handleChangeSelected} isSelected={isSelected} {...args}>
				<ListItemContent
					title="List item button 1"
					description="Select me"
					StartSlot={<Gear />}
				/>
			</ListItemButton>
			<ListItemButton onClick={handleChangeActive} isActive={isActive} {...args}>
				<ListItemContent
					title="List item button 2"
					description="Set active me"
					StartSlot={<Gear />}
				/>
			</ListItemButton>
		</div>
	)
}

export const DefaultListItemButton: Story = {
	render: (args) => ListItemButtonWrapper(args)
}