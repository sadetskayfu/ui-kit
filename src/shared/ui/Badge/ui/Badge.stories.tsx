import { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'
import { useState } from 'react'
import { IconButton } from '@/shared/ui/IconButton'
import { BookMark, Minus, Plus } from '@/shared/assets/icons'

const meta: Meta<typeof Badge> = {
	title: 'shared/Badge',
	component: Badge,
	args: {
		color: 'primary',
		overlap: 'circular',
		position: 'top-right',
		size: 'medium',
		children: <BookMark size='large'/>,
	},
}

export default meta

type Story = StoryObj<typeof Badge>

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
			<IconButton size="small-x" variant="clear" onClick={handleDecrement}>
				<Minus />
			</IconButton>
			<Badge badgeContent={count} {...args} />
			<IconButton size="small-x" variant="clear" onClick={handleIncrement}>
				<Plus />
			</IconButton>
		</div>
	)
}

export const DefaultBadge: Story = {
	render: (args) => BadgeWrapper(args),
}

export const BadgeWithMaxCount: Story = {
	args: {
		badgeContent: 999,
		max: 99,
	}
}

export const AlwaysVisibleBadge: Story = {
    args: {
        badgeContent: '',
        size: 'small',
        isVisible: true,
    }
}
