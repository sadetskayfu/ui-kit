import { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'

const meta: Meta<typeof Accordion> = {
	title: 'shared/Accordion',
	component: Accordion,
	args: {
		titleVariant: 'h4',
		disabled: false,
		variant: 'filled',
		title: 'Accordion header',
		children: (
			<p>
				Accordion body. AI stands for Artificial Intelligence, which refers to the
				simulation of human intelligence in machines. It enables them to perform
				tasks like problem-solving, learning, and decision-making.
                Accordion body. AI stands for Artificial Intelligence, which refers to the
				simulation of human intelligence in machines. It enables them to perform
				tasks like problem-solving, learning, and decision-making.
                Accordion body. AI stands for Artificial Intelligence, which refers to the
				simulation of human intelligence in machines. It enables them to perform
				tasks like problem-solving, learning, and decision-making.
			</p>
		),
	},
}

export default meta

type Story = StoryObj<typeof Accordion>

export const Default: Story = {}

