import { Meta, StoryObj } from '@storybook/react'
import { LinearProgress } from './LinearProgress'
import { useEffect, useRef, useState } from 'react'

const meta: Meta<typeof LinearProgress> = {
	title: 'shared/LinearProgress',
	component: LinearProgress,
	args: {
		color: 'primary',
	},
}

export default meta

type Story = StoryObj<typeof LinearProgress>

const ControlledProgressWrapper = (args: any) => {
	const [value, setValue] = useState<number>(0)

	const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		intervalIdRef.current = setInterval(() => {
			if (value < 100) {
				setValue((prev) => prev + 10)
			} else {
				setValue(0)
			}
		}, 1000)
		return () => {
			if (intervalIdRef.current) {
				clearInterval(intervalIdRef.current)
			}
		}
	}, [value])

	return (
		<>
			<LinearProgress value={value} label={`${value}%`} {...args} />
		</>
	)
}

export const Default: Story = {}

export const Controlled: Story = {
	render: (args) => ControlledProgressWrapper(args),
}

