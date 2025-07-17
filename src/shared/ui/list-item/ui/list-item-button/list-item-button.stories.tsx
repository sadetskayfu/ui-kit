import type { Meta, StoryObj } from '@storybook/react';
import { ListItemButton } from './list-item-button';
import { GearIcon } from '@/shared/ui/icons';
import { ListItemContent } from '../list-item-content/list-item-content';

const meta: Meta<typeof ListItemButton> = {
	title: 'shared/list-item/list-item-button',
	component: ListItemButton,
	args: {
		borderRadius: 'none',
		pressed: false,
		active: false,
		disableRipple: false,
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof ListItemButton>;

const Wrapper = (args: any) => {
	return (
		<div style={{ width: '400px' }}>
			<ListItemButton {...args} />
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
				renderActions={props => <GearIcon className={props.className} size='s'/>}
			/>
		)
	},
};
