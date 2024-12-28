import { Meta, StoryObj } from '@storybook/react'
import { Backdrop } from './Backdrop'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'

const meta: Meta<typeof Backdrop> = {
	title: 'shared/Backdrop',
	component: Backdrop,
	args: {
		variant: 'dark',
	},
}

export default meta
type Story = StoryObj<typeof Backdrop>

const BackdropWrapper = (args: any) => {
	const [isVisible, setIsVisible] = useState(false)

	const handleOpen = () => {
		setIsVisible(true)
	}
	const handleClose = () => {
		setIsVisible(false)
	}

	return (
		<>
			<Button onClick={handleOpen}>Open backdrop</Button>
			<Backdrop onClose={handleClose} isVisible={isVisible} {...args}></Backdrop>
		</>
	)
}

export const Default: Story = {
	render: (args) => <BackdropWrapper {...args} />,
}
