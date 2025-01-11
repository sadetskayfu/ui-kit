import { Meta, StoryObj } from '@storybook/react'
import { TextField } from './TextField'
import { ChangeEvent, useState } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { Arrow, User } from '@/shared/assets/icons'

const meta: Meta<typeof TextField> = {
	title: 'shared/TextField',
	component: TextField,
	args: {
		variant: 'filled',
		size: 'large',
		disabled: false,
		readOnly: false,
		required: false,
        multiline: false,
        hiddenLabel: false,
	},
}

export default meta

type Story = StoryObj<typeof TextField>

const FieldWrapper = (args: any) => {
	const [value, setValue] = useState('')
	const [error, setError] = useState('')

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)
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
	args: {
        label: 'Default field'
    }
}

export const FieldWithAdornment: Story = {
	args: {
        label: 'With Start adornment',
		StartAdornment: 'KG',
        inputProps: {
            placeholder: 'With adornment'
        }
	},
}

export const FieldWithActions: Story = {
	args: {
        label: 'With actions button',
		Actions: [
			<IconButton size="small-xx" variant="clear" color="grey">
				<User />
			</IconButton>,
			<IconButton size="small-xx" variant="clear" color="grey">
				<Arrow />
			</IconButton>,
		],
	},
}

export const FieldWithClearButton: Story = {
    render: (args) => FieldWrapper(args),
    args: {
        label: 'Pass onClear function for clear button',
        inputProps: {
            placeholder: 'Min length 4'
        }
    }
}


export const MultilineField: Story = {
    render: (args) => FieldWrapper(args),
    args: {
        label: 'Message',
        multiline: true,
        textAreaProps: {
            placeholder: 'Auto height textarea'
        }
    }
}
