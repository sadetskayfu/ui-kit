import { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'
import { useState } from 'react'
import { FormLabel } from '@/shared/ui/FormLabel'

const meta: Meta<typeof Switch> = {
	title: 'shared/Switch',
	component: Switch,
	args: {
		size: 'medium',
		disabled: false,
		required: false,
	},
}

export default meta

type Story = StoryObj<typeof Switch>

const SwitchWrapper = (args: any) => {
	const [isChecked, setIsChecked] = useState<boolean>(false)

	const handleChange = (value: boolean) => {
		setIsChecked(value)
	}

	return (
		<>
			<Switch
				checked={isChecked}
				onChange={handleChange}
				inputProps={{ 'aria-label': 'Default switch' }}
				{...args}
			/>
		</>
	)
}

const SwitchWithLabelWrapper = (args: any) => {
	const [isChecked, setIsChecked] = useState<boolean>(false)

	const handleChange = (value: boolean) => {
		setIsChecked(value)
	}

	return (
		<>
			<FormLabel
				label="Label"
				disabled={args.disabled}
				required={args.required}
				Component={<Switch checked={isChecked} onChange={handleChange} {...args} />}
			/>
		</>
	)
}

export const Default: Story = {
	render: (args) => SwitchWrapper(args),
}

export const WithLabel: Story = {
	render: (args) => SwitchWithLabelWrapper(args),
}
