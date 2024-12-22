import { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'
import { Icon } from '@/shared/ui/Icon'
import { useState } from 'react'
import { IconButton } from '@/shared/ui/IconButton'

const meta: Meta<typeof Badge> = {
	title: 'shared/Badge',
	component: Badge,
	args: {
		color: 'primary',
		overlap: 'circular',
		position: 'top-right',
		size: 'medium',
		children: <Icon size='large' variant="book-mark" />,
	},
}

const BadgeWrapper = (args: any) => {
	const [count, setCount] = useState<number>(2)

	const handleIncrement = () => {   
		setCount((prev) => prev + 1)
	}
	const handleDecrement = () => {
        if(count === 0) return
		setCount((prev) => prev - 1)
	}

	return (
		<div style={{ display: 'flex', gap: '10px' }}>
			<IconButton size="small-m" variant="clear" onClick={handleDecrement}>
				<Icon variant="minus" />
			</IconButton>
			<Badge badgeContent={count} {...args} />
			<IconButton size="small-m" variant="clear" onClick={handleIncrement}>
				<Icon variant="plus" />
			</IconButton>
		</div>
	)
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
	render: (args) => BadgeWrapper(args),
}

export const ClearContent: Story = {
    args: {
        badgeContent: '',
        size: 'small',
        isVisible: true,
    }
}
