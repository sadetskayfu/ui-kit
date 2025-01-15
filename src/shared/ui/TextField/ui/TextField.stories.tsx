import { Meta, StoryObj } from '@storybook/react'
import { TextField } from './TextField'
import { useState } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { Arrow, User } from '@/shared/assets/icons'

const meta: Meta<typeof TextField> = {
	title: 'shared/TextField',
	component: TextField,
	args: {
		variant: 'outlined',
		placeholder: 'Placeholder..',
		labelVariant: 'on-border',
		size: 'medium',
		label: 'Label',
		disabled: false,
		readonly: false,
		required: false,
        multiline: false,
		defaultWidth: true,
	},
}

export default meta

type Story = StoryObj<typeof TextField>

const FieldWrapper = (args: any) => {
	const [value, setValue] = useState('')
	const [error, setError] = useState('')

	const handleChange = (value: string) => {
		setValue(value)
	}

	const handleClear = () => {
		setValue('')
	}

	const handleValidate = () => {
		if (value.length < 4) {
			setError('Слишком короткое значение')
		} else {
			setError('')
		}
	}

	return (
		<TextField
			inputProps={{ placeholder: 'Enter email', type: 'email' }}
			errorMessage={error}
			onBlur={handleValidate}
			value={value}
			onChange={handleChange}
			onClear={handleClear}
			{...args}
		/>
	)
}

export const DefaultField: Story = {
}

export const FieldWithAdornment: Story = {
	args: {
		StartAdornment: 'KG',
	},
}

export const FieldWithActions: Story = {
	args: {
		Actions: [
			<IconButton size="small-xx" variant="clear" color="secondary">
				<User />
			</IconButton>,
			<IconButton size="small-xx" variant="clear" color="secondary">
				<Arrow />
			</IconButton>,
		],
	},
}

export const FieldWithClearButton: Story = {
    render: (args) => FieldWrapper(args),
}


export const MultilineField: Story = {
    render: (args) => FieldWrapper(args),
    args: {
        multiline: true,
    }
}
