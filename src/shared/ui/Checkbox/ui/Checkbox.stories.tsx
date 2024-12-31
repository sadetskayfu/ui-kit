import { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'
import { useState } from 'react'
import { Icon } from '../../Icon'

const meta: Meta<typeof Checkbox> = {
	title: 'shared/Checkbox',
	component: Checkbox,
	args: {
		size: 'medium',
        color: 'primary',
        variant: 'filled',
		disabled: false,
		required: false,
	},
}

export default meta

type Story = StoryObj<typeof Checkbox>

const CheckboxWrapper = (args: any) => {
	const [isChecked, setIsChecked] = useState<boolean>(false)

	const handleChange = (value: boolean) => {
		setIsChecked(value)
	}

	return (
		<>
			<Checkbox checked={isChecked} onChange={handleChange} inputProps={{'aria-label': 'Default checkbox'}} {...args} />
		</>
	)
}

export const Default: Story = {
	render: (args) => CheckboxWrapper(args),
}

export const FavoriteCheckbox: Story = {
	render: (args) => CheckboxWrapper(args),
    args: {
        CheckedIcon: <Icon variant='heart'/>,
        Icon: <Icon variant='heart'/>,
        variant: 'clear',
        color: 'red',
		inputProps: {
			'aria-label': 'Favorite'
		}
    }
}
