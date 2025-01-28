import { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'
import { useState } from 'react'
import { Typography } from '@/shared/ui/Typography'

const meta: Meta<typeof Accordion> = {
	title: 'shared/Accordion',
	component: Accordion,
	args: {
		titleVariant: 'h4',
		disabled: false,
		isLazy: false,
		isUnmount: false,
		variant: 'filled',
		title: 'Accordion header',
		children: (
			<Typography variant='text' component='p' color='soft'>
				Accordion body. AI stands for Artificial Intelligence, which refers to the
				simulation of human intelligence in machines. It enables them to perform
				tasks like problem-solving, learning, and decision-making. Accordion body.
				AI stands for Artificial Intelligence, which refers to the simulation of
				human intelligence in machines. It enables them to perform tasks like
				problem-solving, learning, and decision-making. Accordion body. AI stands
				for Artificial Intelligence, which refers to the simulation of human
				intelligence in machines. It enables them to perform tasks like
				problem-solving, learning, and decision-making.
			</Typography>
		),
	},
}

export default meta

type Story = StoryObj<typeof Accordion>

const ControlledAccordionWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const handleToggle = () => {
		setIsOpen((prev) => !prev)
	}

	return (
		<div style={{display: 'flex', flexDirection: 'column', rowGap: '15px'}}>
			<span>Is open: {isOpen ? 'true' : 'false'}</span>
			<Accordion isOpen={isOpen} onToggle={handleToggle} {...args}></Accordion>
		</div>
	)
}

export const Default: Story = {}

export const Controlled: Story = {
	render: (args) => ControlledAccordionWrapper(args),
}
