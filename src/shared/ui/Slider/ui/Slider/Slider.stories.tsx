import { Meta, StoryObj } from '@storybook/react'
import { Slider } from './Slider'
import { FormEvent, useCallback, useState } from 'react'
import { Button } from '@/shared/ui/Button'

const meta: Meta<typeof Slider> = {
	title: 'shared/Slider',
	component: Slider,
	args: {
		size: 'medium',
		tooltipPosition: 'top',
		markerLabelPosition: 'bottom',
		orientation: 'horizontal',
		disabled: false,
		isTooltip: true,
	},
}

export default meta

type Story = StoryObj<typeof Slider>

const SliderWrapper = (args: any) => {
	return (
		<div style={{ width: '350px' }}>
			<Slider {...args} />
		</div>
	)
}

const UncontrolledSliderWrapper = (args: any) => {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const formData = new FormData(event.currentTarget)

		const minValue = formData.get('min-value')
		const maxValue = formData.get('max-value')

		alert(`Min value: ${minValue}, max value: ${maxValue}`)
	}

	return (
		<form
			onSubmit={handleSubmit}
			style={{
				display: 'flex',
				flexDirection: 'column',
				rowGap: '10px',
				width: '350px',
			}}
		>
			<Slider
				{...args}
				defaultValue={[0, 100]}
				min={0}
				max={100}
				minInputName="min-value"
				maxInputName="max-value"
			/>
			<Button color="secondary" type="submit">
				Submit
			</Button>
		</form>
	)
}

const ControlledSliderWrapper = (args: any) => {
	const [value, setValue] = useState<[number, number]>([0, 100000])

	const handleChange = useCallback((value: number | [number, number]) => {
		setValue(value as [number, number])
	}, [])

	return (
		<div style={{ display: 'flex', gap: '10px', width: '350px' }}>
			<span>Min value: {value[0]}</span>
			<Slider
				value={value}
				onChange={handleChange}
				min={0}
				max={100000}
				step={1000}
				debounceDelay={200}
				{...args}
			/>
			<span>Max value: {value[1]}</span>
		</div>
	)
}

export const Default: Story = {
	render: (args) => SliderWrapper(args),
	args: {
		defaultValue: 0,
		min: 0,
		max: 100,
		step: 1,
		'aria-label': 'Default slider',
	},
}

export const WithMarkers: Story = {
	render: (args) => SliderWrapper(args),
	args: {
		defaultValue: 40,
		min: 40,
		max: 200,
		step: 40,
		isMarkers: true,
		isVisibleMarkersLabel: true,
		'aria-label': 'Slider with markers',
	},
}

export const WithCustomMarkers: Story = {
	render: (args) => SliderWrapper(args),
	args: {
		defaultValue: 40,
		min: 40,
		max: 200,
		step: 1,
		isMarkers: true,
		isVisibleMarkersLabel: true,
		customMarkers: [
			{ value: 40, label: '40' },
			{ value: 80, label: '80' },
			{ value: 200, label: '200' },
		],
		'aria-label': 'Slider with custom markers',
	},
}

export const CustomLabels: Story = {
	render: (args) => SliderWrapper(args),
	args: {
		defaultValue: 0,
		min: 0,
		max: 2000,
		step: 400,
		isMarkers: true,
		isVisibleMarkersLabel: true,
		getMarkerLabel: (value: number) => `${value}$`,
		getTooltipLabel: (value: number) => `${value}$`,
		'aria-label': 'Slider with custom labels',
	},
}

export const Range: Story = {
	render: (args) => SliderWrapper(args),
	args: {
		defaultValue: [0, 1000],
		min: 0,
		max: 1000,
		step: 100,
		minRange: 20,
		'aria-label': 'Slider with custom markers',
	},
}

export const Controlled: Story = {
	render: (args) => ControlledSliderWrapper(args),
}

export const Uncontrolled: Story = {
	render: (args) => UncontrolledSliderWrapper(args),
}
