import { Meta, StoryObj } from '@storybook/react'
import { CircularProgress } from './CircularProgress'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/ui/Button'

const meta: Meta<typeof CircularProgress> = {
	title: 'shared/CircularProgress',
	component: CircularProgress,
	args: {
		size: 'large',
		color: 'primary',
		absCenter: false,
	},
}

export default meta

type Story = StoryObj<typeof CircularProgress>

const ControlledProgressWrapper = (args: any) => {
	const [value, setValue] = useState<number>(0)

	const maxValue = 5

	const intervalIdRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		intervalIdRef.current = setInterval(() => {
			if (value < maxValue) {
				setValue((prev) => prev + 1)
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
			<CircularProgress value={value} maxValue={maxValue} label={`${maxValue - value}s`} {...args} />
		</>
	)
}

const ProgressOnButtonWrapper = (args: any) => {
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

	const handleStartLoading = () => {
		setIsLoading(true)
	}

	useEffect(() => {
		if (isLoading) {
			timeoutIdRef.current = setTimeout(() => {
				setIsLoading(false)
			}, 3000)
		}
	}, [isLoading])

	useEffect(() => {
		return () => {
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current)
			}
		}
	}, [])

	return (
		<div style={{ position: 'relative' }}>
			<Button color="grey" disabled={isLoading} onClick={handleStartLoading}>
				Start loading
			</Button>
			{isLoading && <CircularProgress {...args} />}
		</div>
	)
}

export const Default: Story = {}

export const ControlledProgress: Story = {
	render: (args) => ControlledProgressWrapper(args),
}

export const ProgressOnButton: Story = {
	render: (args) => ProgressOnButtonWrapper(args),
	args: {
		size: 'medium',
		absCenter: true,
	},
}
