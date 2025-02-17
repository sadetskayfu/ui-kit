import { Meta, StoryObj } from '@storybook/react'
import { Snackbar } from './Snackbar'
import { useEffect, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { Alert } from '@/shared/ui/Alert'
import { IconButton } from '@/shared/ui/IconButton'
import { CheckMark, XMark } from '@/shared/assets/icons'

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
				Icon={<CheckMark size="small" />}
				Action={
					<IconButton variant="clear" color="inherit" size="small-xx">
						<XMark />
					</IconButton>
				}
			>
				Success Alert
			</Alert>
		),
		variant: 'clear',
	},
}
