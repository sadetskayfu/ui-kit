import { Meta, StoryObj } from '@storybook/react'
import { FormLabel } from './FormLabel'
import { useState } from 'react'
import { Switch } from '../../Switch'

const meta: Meta<typeof FormLabel> = {
	title: 'shared/FormLabel',
	component: FormLabel,
	args: {
		disabled: false,
		required: false,
		labelPosition: 'right',
		label: 'I am label'
	},
}

export default meta

type Story = StoryObj<typeof FormLabel>

const FormLabelWrapper = (args: any) => {
	const [isChecked, setIsChecked] = useState<boolean>(false)

	const handleChange = (value: boolean) => {
		setIsChecked(value)
	}

	return (
		<>
			<FormLabel {...args} Component={<Switch checked={isChecked} onChange={handleChange} name='Checkbox with label'/>}/>
		</>
	)
}

export const Default: Story = {
	render: (args) => FormLabelWrapper(args),
}
