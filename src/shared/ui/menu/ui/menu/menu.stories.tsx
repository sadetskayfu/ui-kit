import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './menu';
import { Button } from '@/shared/ui/button';
import { MenuItem } from '../menu-item/menu-item';
import { ArrowIcon, GearIcon } from '@/shared/ui/icons';
import { MenuSizeProvider } from './menu-size-provider';
import { DelayGroup } from '@/shared/ui/delay-group';

const meta: Meta<typeof Menu> = {
	title: 'shared/menu',
	component: Menu,
	args: {
		removeScroll: false,
		modal: false,
		offset: 5,
		gap: 10,
		paddingToFlip: 5,
		padding: 5,
	},
};

export default meta;

type Story = StoryObj<typeof Menu>;

const MenuWrapper = (args: any) => {
	const handleClick = (title: string) => {
		console.log(title);
	};

	return (
		<MenuSizeProvider width={200}>
			<Menu {...args} renderTrigger={props => <Button {...props}>Open menu</Button>}>
				<MenuItem onClick={() => handleClick('Good')} title="Good" />
				<MenuItem title="Apple" description="I am apple" to="/example" disabled />
				<Menu
					renderTrigger={props => (
						<MenuItem
							renderStartIcon={props => (
								<span {...props}>
									<GearIcon />
								</span>
							)}
							renderEndIcon={props => (
								<span {...props}>
									<ArrowIcon direction="right" />
								</span>
							)}
							title="Cat"
							description="I am cat"
							disableCloseAfterClick
							disableRipple
							{...props}
						/>
					)}
				>
					<Menu
						renderTrigger={props => (
							<MenuItem
								renderEndIcon={props => (
									<span {...props}>
										<ArrowIcon direction="right" />
									</span>
								)}
								title="Black"
								disableCloseAfterClick
								disableRipple
								{...props}
							/>
						)}
					>
						<MenuItem onClick={() => handleClick('Small')} title="Small" />
						<MenuItem onClick={() => handleClick('Big')} title="Big" />
					</Menu>
				</Menu>
				<Menu
					renderTrigger={props => (
						<MenuItem
							renderEndIcon={props => (
								<span {...props}>
									<ArrowIcon direction="right" />
								</span>
							)}
							title="Dog"
							disableCloseAfterClick
							disableRipple
							{...props}
						/>
					)}
				>
					<Menu
						renderTrigger={props => (
							<MenuItem
								renderEndIcon={props => (
									<span {...props}>
										<ArrowIcon direction="right" />
									</span>
								)}
								title="Black"
								disableCloseAfterClick
								disableRipple
								{...props}
							/>
						)}
					>
						<MenuItem onClick={() => handleClick('Small')} title="Small" />
						<MenuItem onClick={() => handleClick('Big')} title="Big" />
					</Menu>
				</Menu>
				<MenuItem
					title="shit"
					renderStartIcon={props => (
						<span {...props}>
							<GearIcon />
						</span>
					)}
					renderLink={props => <a href="/example" {...props} />}
				/>
			</Menu>
		</MenuSizeProvider>
	);
};

const MenuWithDelayGroupWrapper = (args: any) => {
	return (
		<MenuSizeProvider width={200}>
			<DelayGroup>
				<Menu {...args} renderTrigger={props => <Button borderPlacement='left' {...props}>Menu 1</Button>}>
					<MenuItem title="Apple" />
					<MenuItem title="Apple 1" />
					<MenuItem title="Apple 2" />
				</Menu>
                <Menu {...args} renderTrigger={props => <Button borderRadius='none' {...props}>Menu 2</Button>}>
					<MenuItem title="Apple" />
					<MenuItem title="Apple 1" />
					<MenuItem title="Apple 2" />
				</Menu>
                <Menu {...args} renderTrigger={props => <Button borderPlacement='right' {...props}>Menu 3</Button>}>
					<MenuItem title="Apple" />
					<MenuItem title="Apple 1" />
					<MenuItem title="Apple 2" />
				</Menu>
			</DelayGroup>
		</MenuSizeProvider>
	);
};

export const Default: Story = {
	render: args => MenuWrapper(args),
};

export const WithDelayGroup: Story = {
	render: args => MenuWithDelayGroupWrapper(args),
	args: {
		openVariant: 'hover',
		placementRoot: 'bottom',
	},
};
