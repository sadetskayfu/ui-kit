import { Meta, StoryObj } from '@storybook/react'
import Indicator from './Indicator'
import { useState } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { Gear } from '@/shared/assets/icons'

const meta: Meta<typeof Indicator> = {
	title: 'shared/Indicator',
	component: Indicator,
	args: {
		position: 'bottom',
		color: 'primary',
		weight: 'hard',
	},
}

export default meta

type Story = StoryObj<typeof Indicator>

const IndicatorWrapper = (args: any) => {
    const [isActive, setIsActive] = useState<boolean>(false)

	return (
		<div style={{position: 'relative'}}>
			<IconButton borderRadius='square' onClick={() => setIsActive(prev => !prev)}><Gear /></IconButton>
            <Indicator isActive={isActive} {...args}/>
		</div>
	)
}

export const Default: Story = {
    render: (args) => IndicatorWrapper(args)
}
