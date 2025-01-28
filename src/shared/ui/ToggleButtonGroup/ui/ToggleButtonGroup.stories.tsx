import { Meta, StoryObj } from '@storybook/react'
import { ToggleButtonGroup } from './ToggleButtonGroup'
import { useCallback, useState } from 'react'
import { ToggleButton } from '@/shared/ui/ToggleButton/ui/ToggleButton'
import { isValueSelected } from '@/shared/helpers/checkingValues'

const meta: Meta<typeof ToggleButtonGroup> = {
	title: 'shared/ToggleButtonGroup',
	component: ToggleButtonGroup,
	args: {
		orientation: 'horizontal',
        isClearedBorderRadius: true,
	},
}

export default meta

type Story = StoryObj<typeof ToggleButtonGroup>

const ToggleButtonGroupSingleSelectWrapper = (args: any) => {
	const [selectedValue, setSelectedValue] = useState<string>('')
    
	const handleChange = useCallback(
		(value: string) => {
			let newValue: string

			if (value === selectedValue) {
				newValue = ''
			} else {
				newValue = value
			}
			setSelectedValue(newValue)
		},
		[selectedValue]
	)

	return (
        <ToggleButtonGroup
			selectedValue={selectedValue}
			onChange={handleChange}
            aria-label='Toggle button group single select'
			{...args}
		>
			<ToggleButton value="1">First button</ToggleButton>
			<ToggleButton value="2">Second button</ToggleButton>
			<ToggleButton value="3">Third button</ToggleButton>
		</ToggleButtonGroup>
	)
}

const ToggleButtonGroupMultiSelectWrapper = (args: any) => {
	const [selectedValues, setSelectedValues] = useState<string[]>([])

	const handleChange = useCallback(
		(buttonValue: string) => {
			let newValues: string[]

            const isSelected = isValueSelected(buttonValue, selectedValues)

            if(isSelected) {
                newValues = selectedValues.filter((value) => value !== buttonValue)
            } else {
                newValues = [...selectedValues]
                newValues.push(buttonValue)
            }
			setSelectedValues(newValues)
		},
		[selectedValues]
	)

	return (
		<ToggleButtonGroup
			selectedValue={selectedValues}
			onChange={handleChange}
            aria-label='Toggle button group multi select'
			{...args}
		>
			<ToggleButton value="1">1</ToggleButton>
			<ToggleButton value="2">2</ToggleButton>
			<ToggleButton value="3">3</ToggleButton>
            <ToggleButton value="4">4</ToggleButton>
            <ToggleButton value="5" disabled>5</ToggleButton>
		</ToggleButtonGroup>
	)
}

export const ToggleButtonGroupSingleSelect: Story = {
	render: (args) => ToggleButtonGroupSingleSelectWrapper(args),
}

export const ToggleButtonGroupMultiSelect: Story = {
	render: (args) => ToggleButtonGroupMultiSelectWrapper(args),
}
