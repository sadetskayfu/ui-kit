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
        isMultiline: false,
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
			inputProps={{ placeholder: 'Enter email', type: 'number' }}
			errorMessage={error}
			onBlur={handleValidate}
			value={value}
			onChange={handleChange}
			onClear={handleClear}
			{...args}
		/>
	)
}

export const Default: Story = {
}

export const WithAdornment: Story = {
	args: {
		StartAdornment: 'KG',
	},
}

export const WithActions: Story = {
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

export const WithClearButton: Story = {
    render: (args) => FieldWrapper(args),
}


export const Multiline: Story = {
    render: (args) => FieldWrapper(args),
    args: {
        isMultiline: true,
    }
}
