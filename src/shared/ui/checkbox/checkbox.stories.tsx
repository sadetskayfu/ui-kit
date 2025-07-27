import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { GearIcon, TrashIcon } from '@/shared/ui/icons';

const meta: Meta<typeof Checkbox> = {
	title: 'shared/checkbox',
	component: Checkbox,
	args: {
        color: 'primary',
        size: 'm',
        variant: 'filled',
        disabled: false,
        readOnly: false,
        required: false,
        disableRipple: false,
        disableDefaultIconStyle: false
	},
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

const ControlledCheckboxWrapper = (args: any) => {
    const [value, setValue] = React.useState<string[]>([])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value

        setValue((prev) => {
            if (prev.includes(inputValue)) {
                return prev.filter((value) => value !== inputValue)
            } else {
                return [...prev, inputValue]
            }
        })
    }

    return (
        <div>
            <Checkbox {...args} value='1' onChange={handleChange} checked={value.includes('1')} />
            <Checkbox {...args} value='2' onChange={handleChange} checked={value.includes('2')}/>
            <Checkbox {...args} value='3' onChange={handleChange} checked={value.includes('3')}/>
        </div>
    )
}

export const Uncontrolled: Story = {};

export const Controlled: Story = {
	render: args => ControlledCheckboxWrapper(args),
};

export const WithCustomCheckedIcon: Story = {
    args: {
        checkedIcon: <TrashIcon size='xs'/>
    }
}

export const WithCustomUncheckedIcon: Story = {
    args: {
        uncheckedIcon: <GearIcon />,
        checkedIcon: <GearIcon />
    }
}

