import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './index';
import { DirectionProvider, TextDirection } from '@/app/providers/direction-provider';

const meta: Meta<typeof Tabs.Root> = {
	title: 'shared/tabs',
	component: Tabs.Root,
	args: {
		orientation: 'horizontal',
		loop: true,
		activateOnFocus: false,
	},
};

export default meta;

type Story = StoryObj<typeof Tabs.Root>;

const UncontrolledTabsWrapper = (args: any, direction: TextDirection = 'ltr') => {
	return (
		<DirectionProvider direction={direction}>
			<Tabs.Root {...args}>
				<Tabs.List
					style={{
						display: 'flex',
						flexDirection: args.orientation === 'vertical' ? 'column' : 'row',
						gap: '10px',
					}}
				>
					<Tabs.Tab label="Tab 1" />
					<Tabs.Tab label="Tab 2" />
					<Tabs.Tab label="Tab 3" disabled />
					<Tabs.Tab label="Tab 4" />
				</Tabs.List>
				<Tabs.Panel style={{ padding: '20px' }}>Panel 1</Tabs.Panel>
				<Tabs.Panel style={{ padding: '20px' }}>Panel 2</Tabs.Panel>
				<Tabs.Panel style={{ padding: '20px' }}>Panel 3</Tabs.Panel>
				<Tabs.Panel style={{ padding: '20px' }}>Panel 4</Tabs.Panel>
			</Tabs.Root>
		</DirectionProvider>
	);
};

const ControlledTabsWrapper = (args: any) => {
	const [value, setValue] = React.useState<string>('2');

	return (
		<Tabs.Root value={value} onChange={setValue} {...args}>
			<Tabs.List
				style={{
					position: 'relative',
					display: 'flex',
					flexDirection: args.orientation === 'vertical' ? 'column' : 'row',
				}}
			>
				<Tabs.Tab value="1" variant="clear" label="Tab 1" />
				<Tabs.Tab value="2" variant="clear" label="Tab 2" />
				<Tabs.Tab value="3" variant="clear" label="Tab 3" disabled />
				<Tabs.Tab value="4" variant="clear" label="Tab 4" />
				<button onClick={() => setValue('1')}>Select tab 1</button>
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Panel value="1" style={{ padding: '20px' }}>
				Panel 1
			</Tabs.Panel>
			<Tabs.Panel value="2" style={{ padding: '20px' }}>
				Panel 2
			</Tabs.Panel>
			<Tabs.Panel value="3" style={{ padding: '20px' }}>
				Panel 3
			</Tabs.Panel>
			<Tabs.Panel value="4" style={{ padding: '20px' }}>
				Panel 4
			</Tabs.Panel>
		</Tabs.Root>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledTabsWrapper(args),
};

export const Controlled: Story = {
	render: args => ControlledTabsWrapper(args),
};

export const RTL: Story = {
    render: args => UncontrolledTabsWrapper(args, 'rtl')
};
