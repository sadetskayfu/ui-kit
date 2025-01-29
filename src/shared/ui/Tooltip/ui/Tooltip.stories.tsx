import { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '@/shared/ui/Button'
import { useRef } from 'react'
import { useDragging } from '@/shared/hooks'

const meta: Meta<typeof Tooltip> = {
	title: 'shared/Tooltip',
	component: Tooltip,
	args: {
		Content: <p>Tooltip text text text</p>,
		position: 'top',
		delay: 0,
		isLazy: false,
		isUnmount: false,
		isClickableTooltip: false,
		isFollowCursor: false,
		disabledClick: true,
		disabledFocus: false,
		disabledHover: false,
		disabledTouch: false,
	},
}

export default meta

type Story = StoryObj<typeof Tooltip>

const TooltipWrapper = (args: any) => {
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const { handleMouseDown } = useDragging(buttonRef)

	return (
		<Tooltip parentRef={buttonRef} {...args}>
			<Button
				ref={buttonRef}
				color="secondary"
				style={ {position: 'absolute'} }
				buttonProps={{
					onMouseDown: handleMouseDown,
				}}
			>
				Button
			</Button>
		</Tooltip>
	)
}

export const Default: Story = {
	render: (args) => TooltipWrapper(args),
}

export const Clickable: Story = {
	render: (args) => TooltipWrapper(args),
	args: {
		isClickableTooltip: true,
	},
}

export const OpenOnClick: Story = {
	render: (args) => TooltipWrapper(args),
	args: {
		isClickableTooltip: true,
		disabledHover: true,
		disabledTouch: true,
		disabledFocus: true,
		disabledClick: false,
	},
}

export const FollowCursor: Story = {
	render: (args) => TooltipWrapper(args),
	args: {
		isFollowCursor: true,
	},
}
