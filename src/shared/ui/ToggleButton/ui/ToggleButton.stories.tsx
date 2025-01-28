import { Meta, StoryObj } from '@storybook/react'
import { ToggleButton } from './ToggleButton'
import { useState } from 'react'
import { Gear } from '@/shared/assets/icons'

const meta: Meta<typeof ToggleButton> = {
	title: 'shared/ToggleButton',
	component: ToggleButton,
	args: {
		size: 'medium',
		color: 'secondary',
		disabled: false,
	},
}

export default meta

type Story = StoryObj<typeof ToggleButton>

const ToggleButtonWrapper = (args: any) => {
	const [selectedValue, setSelectedValue] = useState<string>('')

	const handleChange = (value: string) => {
		let newValue: string

		if(value === selectedValue) {
			newValue = ''
		} else {
			newValue = value
		}
		setSelectedValue(newValue)
	}

	return (
		<ToggleButton value='1' onChange={handleChange} isSelected={selectedValue === '1'} {...args}>
			<Gear />
		</ToggleButton>
	)
}

export const DefaultToggleButton: Story = {
	render: (args) => ToggleButtonWrapper(args)
}

