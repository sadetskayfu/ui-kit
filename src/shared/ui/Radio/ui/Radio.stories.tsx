import { Meta, StoryObj } from '@storybook/react'
import { FormGroup } from '@/shared/ui/FormGroup'
import { Radio } from './Radio'
import { useState } from 'react'
import { FormLabel } from '@/shared/ui/FormLabel'

const meta: Meta<typeof Radio> = {
	title: 'shared/Radio',
	component: Radio,
	args: {
		size: 'medium',
		variant: 'filled',
	},
}

export default meta

type Story = StoryObj<typeof Radio>

const RadioGroupWrapper = (args: any) => {
	const [selectedValue, setSelectedValue] = useState('1')

	const handleChange = (value: string) => {
		setSelectedValue(value)
	}

	return (
		<>
			<FormGroup label="Radio group">
				<FormLabel
					label="First"
					Component={
						<Radio
							name="radio"
							value="1"
							selectedValue={selectedValue}
							onChange={handleChange}
							{...args}
						/>
					}
				/>
				<FormLabel
					label="Second"
					Component={
						<Radio
							name="radio"
							value="2"
							selectedValue={selectedValue}
							onChange={handleChange}
							{...args}
						/>
					}
				/>
				<FormLabel
					label="Third"
					Component={
						<Radio
							name="radio"
							value="3"
							selectedValue={selectedValue}
							onChange={handleChange}
							{...args}
						/>
					}
				/>
			</FormGroup>
		</>
	)
}

export const Default: Story = {
	render: (args) => RadioGroupWrapper(args),
}
