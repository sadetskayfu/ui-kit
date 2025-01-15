import { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'
import { OptionItem } from '@/shared/ui/OptionItem'
import { useCallback, useState } from 'react'
import { Chip } from '@/shared/ui/Chip'

const options = Array.from({length: 10}, (_, index) => {
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
			return <OptionItem key={option.value} value={option.value} label={option.label}/>
		}),
		options: options,
		label: 'Label',
		placeholder: 'Placeholder..',
		size: 'large',
		variant: 'outlined',
		labelVariant: 'on-border',
		disabled: false,
		readOnly: false,
		required: false,
		menuHeight: '300px',
		menuWidth: '100%',
		menuPosition: 'bottom',
		defaultWidth: true,
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
		<Select  selectedValue={selectedValue} onChange={handleChange} {...args}>

		</Select>
	)
}

const MultiSelectWrapper = (args: any) => {
	const [selectedValue, setSelectedValue] = useState<string[]>([])

	const handleChange = useCallback((value: string | string[]) => {
		setSelectedValue(value as string[])
	}, [])

	return (
		<Select  selectedValue={selectedValue} onChange={handleChange} {...args}>

		</Select>
	)
}

export const SingleSelect: Story = {
	render: (args) => SingleSelectWrapper(args),
}

export const MultiSelect: Story = {
	render: (args) => MultiSelectWrapper(args),
}

export const MultiSelectWithChips: Story = {
	render: (args) => MultiSelectWrapper(args),
	args: {
		renderTags: (value, label, params) => <Chip key={value} label={label} size='small' color='secondary' {...params}/>
	}
}

export const SelectWidthDisabledOptions: Story = {
	render: (args) => MultiSelectWrapper(args),
	args: {
		getDisabledOptions: (value: string) => value === '2' || value === '5',
	}
}


