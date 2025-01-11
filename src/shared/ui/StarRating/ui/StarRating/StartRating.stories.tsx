import { Meta, StoryObj } from '@storybook/react'
import { StarRating } from './StarRating'
import { useState } from 'react'

const meta: Meta<typeof StarRating> = {
	title: 'shared/StarRating',
	component: StarRating,
	args: {
        label: 'Star rating',
        disabled: false,
        readonly: false,
        required: false,
        maxStars: 5,
        hiddenLegend: true,
        name: 'star-rating',
        precise: false,
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
            <StarRating selectedValue={rating} onChange={handleChange} {...args}/>
		</>
	)
}

export const Default: Story = {
	render: (args) => StarRatingWrapper(args),
}
