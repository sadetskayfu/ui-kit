import type { Meta, StoryObj } from '@storybook/react';
import { ListItem } from './list-item';
import { GearIcon } from '@/shared/ui/icons';
import { Button } from '@/shared/ui/button';
import { ListItemContent } from '../list-item-content/list-item-content';

const meta: Meta<typeof ListItem> = {
	title: 'shared/list-item/list-item',
	component: ListItem,
	args: {
		borderRadius: 'none',
		pressed: false,
		active: false,
		disableRipple: false,
		disabled: false,
		onClick: () => console.log('list-item-click'),
	},
};

export default meta;

type Story = StoryObj<typeof ListItem>;

const Wrapper = (args: any) => {
	return (
		<div style={{ width: '400px' }}>
			<ListItem {...args} />
		</div>
	);
};

export const Default: Story = {
	render: args => Wrapper(args),
	args: {
		children: (
			<ListItemContent
				title="Title"
				description="Description"
				startAdornment={<GearIcon size="l" />}
				renderActions={({className, handlers}) => (
					<div className={className} {...handlers}>
						<Button
							onClick={() => console.log('button 1 click')}
							iconButton
							borderRadius="circular"
							variant="clear"
						>
							<GearIcon size="s" />
						</Button>
						<Button
							onClick={() => console.log('button 2 click')}
							iconButton
							borderRadius="circular"
							variant="clear"
						>
							<GearIcon size="s" />
						</Button>
					</div>
				)}
			/>
		),
	},
};
