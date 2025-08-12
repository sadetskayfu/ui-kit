import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './index';
import { DirectionProvider } from '@/app/providers/direction-provider';

const meta: Meta<typeof ScrollArea.Root> = {
	title: 'shared/scroll-area',
	component: ScrollArea.Root,
	args: {
		
	},
};

export default meta;

type Story = StoryObj<typeof ScrollArea.Root>;

const ScrollAreaVerticalWrapper = (args: any) => {
	return (
		<ScrollArea.Root
			{...args}
			orientation="vertical"
			style={{ width: '400px', height: '150px' }}
		>
			<ScrollArea.Viewport border>
				<ScrollArea.Content padding='m'>
					<p>
						Vernacular architecture is building done outside any academic tradition, and
						without professional guidance. It is not a particular architectural movement
						or style, but rather a broad category, encompassing a wide range and variety
						of building types, with differing methods of construction, from around the
						world, both historical and extant and classical and modern. Vernacular
						architecture constitutes 95% of the world's built environment, as estimated
						in 1995 by Amos Rapoport, as measured against the small percentage of new
						buildings every year designed by architects and built by engineers.
					</p>
				</ScrollArea.Content>
				<ScrollArea.Scrollbar orientation="vertical" />
			</ScrollArea.Viewport>
		</ScrollArea.Root>
	);
};

const ScrollAreaHorizontalWrapper = (args: any) => {
	return (
		<ScrollArea.Root
			{...args}
			orientation="horizontal"
			style={{ width: '400px' }}
		>
			<ScrollArea.Viewport border>
				<ScrollArea.Content padding='m'>
					<p style={{ textWrap: 'nowrap' }}>
						Vernacular architecture is building done outside any academic tradition, and
						without professional guidance. It is not a particular architectural movement
						or style, but rather a broad category, encompassing a wide range and variety
						of building types, with differing methods of construction, from around the
						world, both historical and extant and classical and modern. Vernacular
						architecture constitutes 95% of the world's built environment, as estimated
						in 1995 by Amos Rapoport, as measured against the small percentage of new
						buildings every year designed by architects and built by engineers.
					</p>
				</ScrollArea.Content>
				<ScrollArea.Scrollbar orientation="horizontal" />
			</ScrollArea.Viewport>
		</ScrollArea.Root>
	);
};

const ScrollAreaBothWrapper = (args: any) => {
	return (
		<ScrollArea.Root {...args} orientation="both" style={{ width: '400px', height: '250px' }}>
			<ScrollArea.Viewport border>
				<ScrollArea.Content padding='m'>
					<p style={{ textWrap: 'nowrap' }}>
						Vernacular architecture is building done outside any academic tradition, and
						without professional guidance. It is not a particular architectural movement
						or style, but <br />
						rather a broad category, encompassing a wide range and variety of building
						types, <br />
						with differing methods of construction, from around the world, both
						historical and <br />
						extant and classical and modern. Vernacular architecture constitutes 95% of
						the world's built environment, as estimated in 1995 by Amos Rapoport, as
						measured against the small percentage of new buildings every year designed
						by architects and built by engineers. Vernacular architecture is building
						done outside any academic tradition, and without professional guidance. It
						is not a particular architectural movement or style, but <br />
						rather a broad category, encompassing a wide range and variety of building
						types, <br />
						with differing methods of construction, from around the world, both
						historical and <br />
						extant and classical and modern. Vernacular architecture constitutes 95% of
						the world's built environment, as estimated in 1995 by Amos Rapoport, as
						measured against the small percentage of new buildings every year designed
						by architects and built by engineers. Vernacular architecture is building
						done outside any academic tradition, and without professional guidance. It
						is not a particular architectural movement or style, but <br />
						rather a broad category, encompassing a wide range and variety of building
						types, <br />
						with differing methods of construction, from around the world, both
						historical and <br />
						extant and classical and modern. Vernacular architecture constitutes 95% of
						the world's built environment, as estimated in 1995 by Amos Rapoport, as
						measured against the small percentage of new buildings every year designed
						by architects and built by engineers.
					</p>
				</ScrollArea.Content>
				<ScrollArea.Scrollbar orientation="vertical" />
				<ScrollArea.Scrollbar orientation="horizontal" />
				<ScrollArea.Corner />
			</ScrollArea.Viewport>
		</ScrollArea.Root>
	);
};

export const Vertical: Story = {
	render: args => ScrollAreaVerticalWrapper(args),
};

export const Horizontal: Story = {
	render: args => ScrollAreaHorizontalWrapper(args),
};

export const Both: Story = {
	render: args => ScrollAreaBothWrapper(args),
};

export const VerticalRTL: Story = {
	render: args => (
		<DirectionProvider direction="rtl">{ScrollAreaVerticalWrapper(args)}</DirectionProvider>
	),
};

export const BothRTL: Story = {
	render: args => (
		<DirectionProvider direction="rtl">{ScrollAreaBothWrapper(args)}</DirectionProvider>
	),
};
