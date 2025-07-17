import type { Meta, StoryObj } from '@storybook/react';
import { ListItemLink } from './list-item-link';
import { GearIcon } from '@/shared/ui/icons';
import { ListItemContent } from '../list-item-content/list-item-content';

const meta: Meta<typeof ListItemLink> = {
	title: 'shared/list-item/list-item-link',
	component: ListItemLink,
	args: {
		borderRadius: 'none',
		active: false,
		disableRipple: false,
		disabled: false,
		children: (
			<ListItemContent
				title="Title"
				description="Description"
				startAdornment={<GearIcon size="l" />}
				renderActions={props => <GearIcon className={props.className} size="s" />}
			/>
		),
	},
};

export default meta;

type Story = StoryObj<typeof ListItemLink>;

const Wrapper = (args: any) => {
	return (
		<div style={{ width: '400px' }}>
			<ListItemLink {...args} />
		</div>
	);
};

export const Default: Story = {
	render: args => Wrapper(args),
	args: {
		href: '/example',
	},
};

export const CustomLink: Story = {
	render: args => Wrapper(args),
	args: {
		renderLink: props => <a href="/example" {...props} />,
	},
};
