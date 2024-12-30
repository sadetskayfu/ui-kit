import { Meta, StoryObj } from '@storybook/react'
import { FormGroup } from './FormGroup'
import { useState } from 'react'
import { FormLabel } from '@/shared/ui/FormLabel'
import { Checkbox } from '@/shared/ui/Checkbox'

const meta: Meta<typeof FormGroup> = {
	title: 'shared/FormGroup',
	component: FormGroup,
	args: {
        orientation: 'horizontal',
        required: false,
        label: 'Checkbox group',
        hiddenLegend: false,
        size: 'medium'
    },
}

export default meta

type Story = StoryObj<typeof FormGroup>

const FormGroupWrapper = (args: any) => {
    const [state, setState] = useState({
        first: false,
        second: false,
        third: false
    })

    const handleChange = (value: boolean, name: string) => {
        setState({
            ...state,
            [name]: value
        })
    }

    const { first, second, third } = state;
    const error = [first, second, third].filter((v) => v).length !== 2;
    
	return (
		<>
			<FormGroup errorMessage={error ? 'Pick minimum two' : undefined} {...args} >
				<FormLabel label='First' Component={<Checkbox name='first' checked={state.first} onChange={handleChange}/>} />
                <FormLabel label='Second' Component={<Checkbox name='second' checked={state.second} onChange={handleChange}/>} />
                <FormLabel label='Third' Component={<Checkbox name='third' checked={state.third} onChange={handleChange}/>} />
			</FormGroup>
		</>
	)
}

export const Default: Story = {
	render: (args) => FormGroupWrapper(args),
}

