import { Meta, StoryObj } from '@storybook/react'
import { Slider } from './Slider'
import { useState } from 'react'

const meta: Meta<typeof Slider> = {
	title: 'shared/Sliderr',
	component: Slider,
	args: {

	},
}

export default meta

type Story = StoryObj<typeof Slider>

export const DefaultSlider: Story = {
	args: {
        value: [0, 100],
        min: 0,
        max: 100,
        minRange: 10,
        onChange: ((value) => console.log(value))
    }
}
