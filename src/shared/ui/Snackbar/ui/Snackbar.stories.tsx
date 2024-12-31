import { Meta, StoryObj } from '@storybook/react'
import { Snackbar } from './Snackbar'
import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { Icon } from '@/shared/ui/Icon'
import { IconButton } from '../../IconButton'

const meta: Meta<typeof Snackbar> = {
	title: 'shared/Snackbar',
	component: Snackbar,
	args: {
		position: 'top-right',
		variant: 'filled',
	},
}

export default meta

type Story = StoryObj<typeof Snackbar>

const SnackbarWrapper = (args: any) => {
	const [isVisible, setIsVisible] = useState<boolean>(true)

	useEffect(() => {
		// Reset visibility when args change
		setIsVisible(true)
	}, [args.message, args.position, args.variant])

	return (
		<>
			<Button onClick={() => setIsVisible((prev) => !prev)}>
				Toggle visibility Snackbar
			</Button>
			<Snackbar
				{...args}
				isVisible={isVisible}
				onClose={() => setIsVisible(false)}
			/>
		</>
	)
}

export const Default: Story = {
	render: (args) => SnackbarWrapper(args),
	args: {
		children: 'Default snackbar with message',
	},
}

export const AutoHide: Story = {
	render: (args) => SnackbarWrapper(args),
	args: {
		autoHideDuration: 5000,
		children: 'Default snackbar with auto hide 5s',
	},
}

export const CustomContentWithAlert: Story = {
	render: (args) => SnackbarWrapper(args),
	args: {
		children: (
			<Alert
				variant="filled"
				severity="success"
				Icon={<Icon variant="check-mark" size="small"/>}
				Action={
					<IconButton variant="clear" color="custom-color" size="small-xx">
						<Icon variant="x-mark" />
					</IconButton>
				}
			>
				Success Alert
			</Alert>
		),
		variant: 'clear',
	},
}
