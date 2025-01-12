import { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'
import { OptionItem } from '../../OptionItem'
import { useCallback, useState } from 'react'

const options = Array.from({length: 20}, (_, index) => {
	return {
		value: index + 1 + '',
		label: `Option ${index + 1}`
	}
})

const meta: Meta<typeof Select> = {
	title: 'shared/Select',
	component: Select,
	args: {
		children: options.map((option) => {
			return <OptionItem value={option.value} label={option.label}/>
		}),
		options: options,
		size: 'large',
		variant: 'filled',
		hiddenLabel: false,
		chips: false,
		disabled: false,
		readOnly: false,
		required: false,
		menuHeight: '300px',
		menuWidth: '100%',
		menuPosition: 'bottom',
	},
}

export default meta

type Story = StoryObj<typeof Select>

const SingleSelectWrapper = (args: any) => {
	const [selectedValue, setSelectedValue] = useState<string>('')

	const handleChange = useCallback((value: string | string[]) => {
		setSelectedValue(value as string)
	}, [])

	return (
		<Select style={{width: '400px'}} selectedValue={selectedValue} onChange={handleChange} {...args}>

		</Select>
	)
}

const MultiSelectWrapper = (args: any) => {
	const [selectedValue, setSelectedValue] = useState<string[]>([])

	const handleChange = useCallback((value: string | string[]) => {
		setSelectedValue(value as string[])
	}, [])

	return (
		<Select style={{width: '400px'}} selectedValue={selectedValue} onChange={handleChange} {...args}>

		</Select>
	)
}

export const SingleSelect: Story = {
	render: (args) => SingleSelectWrapper(args),
	args: {
		label: 'Single select',
		placeholder: 'Select one option'
	}
}

export const MultiSelect: Story = {
	render: (args) => MultiSelectWrapper(args),
	args: {
		label: 'Multi select',
		placeholder: 'Select more options'
	}
}

export const MultiSelectWithChips: Story = {
	render: (args) => MultiSelectWrapper(args),
	args: {
		label: 'Chips',
		chips: true,
		placeholder: 'Select more options'
	}
}

export const SelectWidthDisabledOptions: Story = {
	render: (args) => MultiSelectWrapper(args),
	args: {
		label: 'Disabled options',
		placeholder: 'Placeholder...',
		getDisabledOptions: (value: string) => value === '2' || value === '5',
		menuPosition: 'right-start',
	}
}


