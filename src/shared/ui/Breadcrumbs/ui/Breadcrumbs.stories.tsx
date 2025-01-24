import { Meta, StoryObj } from '@storybook/react'
import { Breadcrumbs } from './Breadcrumbs'
import { CustomLink } from '@/shared/ui/CustomLink'

const meta: Meta<typeof Breadcrumbs> = {
	title: 'shared/Breadcrumbs',
	component: Breadcrumbs,
	args: {
		'aria-label': 'Breadcrumbs',
	},
}

export default meta

type Story = StoryObj<typeof Breadcrumbs>

export const Default: Story = {
	args: {
		children: [
			<CustomLink to='/' color="inherit">First</CustomLink>,
			<CustomLink to='/' color="inherit">Second</CustomLink>,
            <CustomLink to='/' color="primary">Third</CustomLink>,
		],
	},
}
