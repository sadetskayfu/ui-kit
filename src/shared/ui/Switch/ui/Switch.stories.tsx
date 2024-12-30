import { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'
import { useState } from 'react'

const meta: Meta<typeof Switch> = {
	title: 'shared/Switch',
	component: Switch,
	args: {
		size: 'medium',
		disabled: false,
		required: false,
		name: 'switch'
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
			<Switch checked={isChecked} onChange={handleChange}{...args} />
		</>
	)
}

export const Default: Story = {
	render: (args) => SwitchWrapper(args),
}
