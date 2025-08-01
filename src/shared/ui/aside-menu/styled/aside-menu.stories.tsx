import type { Meta, StoryObj } from '@storybook/react';
import { AsideMenu } from './index';
import { Button } from '@/shared/ui/button';

const meta: Meta<typeof AsideMenu.Root> = {
	title: 'shared/aside-menu',
	component: AsideMenu.Root,
	args: {
		removeScroll: false,
		returnFocus: true,
		initialOpen: false,
        modal: true,
        closeOnFocusOut: true,
        closeOnOutsidePress: true
	},
};

export default meta;

type Story = StoryObj<typeof AsideMenu.Root>;

const AsideMenuWrapper = (args: any, position: 'left' | 'top' | 'right' | 'bottom', visibleBackdrop = true) => {
	return (
		<AsideMenu.Root {...args}>
			<AsideMenu.Trigger render={<Button>AsideMenu trigger</Button>} />
			<AsideMenu.Popup
				style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}
                position={position}
                visibleBackdrop={visibleBackdrop}
			>
				<AsideMenu.Title className="fz-5">AsideMenu title</AsideMenu.Title>
				<AsideMenu.Description className="fc-soft">AsideMenu description</AsideMenu.Description>
				<AsideMenu.Close
					render={
						<Button size="s" color="secondary">
							Close
						</Button>
					}
				/>
			</AsideMenu.Popup>
		</AsideMenu.Root>
	);
};

export const Left: Story = {
	render: args => AsideMenuWrapper(args, 'left'),
};
export const Right: Story = {
	render: args => AsideMenuWrapper(args, 'right'),
};
export const Top: Story = {
	render: args => AsideMenuWrapper(args, 'top'),
};
export const Bottom: Story = {
	render: args => AsideMenuWrapper(args, 'bottom'),
};
export const NotVisibleBackdrop: Story = {
    render: args => AsideMenuWrapper(args, 'bottom', false),
}
