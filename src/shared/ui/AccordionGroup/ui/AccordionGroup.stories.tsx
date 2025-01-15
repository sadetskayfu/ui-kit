import { Meta, StoryObj } from '@storybook/react'
import { AccordionGroup } from './AccordionGroup'
import { Accordion } from '@/shared/ui/Accordion'
import { Typography } from '@/shared/ui/Typography'

const meta: Meta<typeof AccordionGroup> = {
	title: 'shared/AccordionGroup',
	component: AccordionGroup,
	args: {
		initialValue: '',
	},
}

export default meta

type Story = StoryObj<typeof Accordion>

const AccordionGroupWrapper = (args: any) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
			<AccordionGroup {...args}>
				<Accordion title="Accordion 1">
					<Typography variant="text" component="p" color="soft">
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
				</Accordion>
				<Accordion title="Accordion 1">
					<Typography variant="text" component="p" color="soft">
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
				</Accordion>
				<Accordion title="Accordion 1">
					<Typography variant="text" component="p" color="soft">
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
				</Accordion>
			</AccordionGroup>
		</div>
	)
}

export const DefaultAccordionGroup: Story = {
	render: (args) => AccordionGroupWrapper(args),
}
