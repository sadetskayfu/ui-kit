import { Meta, StoryObj } from '@storybook/react'
import { Slider } from './Slider'
import { useState } from 'react'

const meta: Meta<typeof Slider> = {
	title: 'shared/Slider',
	component: Slider,
	args: {
		size: 'medium',
		tooltipPosition: 'top',
		markersPosition: 'bottom',
		disabled: false,
	},
}

export default meta

type Story = StoryObj<typeof Slider>

export const DefaultSlider: Story = {
	args: {
        value: 0,
		"aria-label": 'Default slider',
		min: 0,
		max: 100,
		step: 1,
    }
}

export const SliderWithMarkers: Story = {
	args: {
        value: 40,
		"aria-label": 'Slider with markers',
		min: 40,
		max: 200,
		step: 40,
		isMarkers: true,
		isVisibleMarkersLabel: true,
    }
}

export const SliderWithCustomMarkers: Story = {
	args: {
        value: 40,
		"aria-label": 'Slider with custom markers',
		min: 40,
		max: 200,
		step: 1,
		isMarkers: true,
		isVisibleMarkersLabel: true,
		customMarkers: [{value: 40, label: '40'}, {value: 200, label: '200'}],
    }
}

export const CustomTooltipLabelAndMarkerLabel: Story = {
	args: {
        value: 0,
		"aria-label": 'Slider with custom labels',
		min: 0,
		max: 2000,
		step: 400,
		isMarkers: true,
		isVisibleMarkersLabel: true,
		getMarkerLabel: (value: number) => (`${value}$`),
		getTooltipLabel: (value: number) => (`${value}$`)
    }
}

export const RangeSlider: Story = {
	args: {
        value: [0, 20000],
		"aria-label": 'Slider with custom markers',
		min: 0,
		max: 20000,
		step: 1,
		minRange: 1,
    }
}