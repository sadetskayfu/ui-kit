import { Meta, StoryObj } from '@storybook/react'
import { StarRating } from './StarRating'
import { useState } from 'react'

const meta: Meta<typeof StarRating> = {
	title: 'shared/StarRating',
	component: StarRating,
	args: {
		label: 'Star rating',
		disabled: false,
		readOnly: false,
		required: false,
		maxStars: 5,
		isHiddenLegend: true,
		name: 'star-rating',
		isPrecise: false,
		size: 'medium',
	},
}

export default meta

type Story = StoryObj<typeof StarRating>

const StarRatingWrapper = (args: any) => {
	const [rating, setRating] = useState<number>(0)

	const handleChange = (value: number) => {
		setRating(value)
	}

	return (
		<>
			<StarRating selectedValue={rating} onChange={handleChange} {...args} />
		</>
	)
}

const ControlledFillValueWrapper = (args: any) => {
	const [rating, setRating] = useState<number>(0)
	const [fillValue, setFillValue] = useState<number>(rating)

	const handleChange = (value: number) => {
		setRating(value)
	}
	const handleChangeFillValue = (value: number) => {
		setFillValue(value)
	}

	return (
		<div style={{ display: 'flex', columnGap: '10px', alignItems: 'center' }}>
			<StarRating
				selectedValue={rating}
				fillValue={fillValue}
				onChange={handleChange}
				onChangeFillValue={handleChangeFillValue}
				{...args}
			/>
			<span>Stars: {fillValue}</span>
		</div>
	)
}

export const Default: Story = {
	render: (args) => StarRatingWrapper(args),
}

export const ControlledFillValue: Story = {
	render: (args) => ControlledFillValueWrapper(args),
}
