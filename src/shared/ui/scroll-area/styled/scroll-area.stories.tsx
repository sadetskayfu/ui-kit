import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
import { Button } from '@/shared/ui/button';

const meta: Meta<typeof ScrollArea> = {
	title: 'shared/scroll-area',
	component: ScrollArea,
	args: {
		border: true,
		contentPadding: 'm',
		alwaysVisibleScrollbar: false,
	},
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Vertical: Story = {
	args: {
		orientation: 'vertical',
        maxWidth: 400,
        maxHeight: 200,
		children: (
			<>
				<p>
					Vernacular architecture is building done outside any academic tradition, and
					without professional guidance. It is not a particular architectural movement or
					style, but rather a broad category, encompassing a wide range and variety of
					building types, with differing methods of construction, from around the world,
					both historical and extant and classical and modern. Vernacular architecture
					constitutes 95% of the world's built environment, as estimated in 1995 by Amos
					Rapoport, as measured against the small percentage of new buildings every year
					designed by architects and built by engineers.
				</p>
				<Button variant='clear' style={{ marginTop: '10px', marginLeft: 'auto' }}>Button</Button>
			</>
		),
	},
};

export const Horizontal: Story = {
	args: {
		orientation: 'horizontal',
        width: 400,
		children: (
			<p style={{ textWrap: 'nowrap' }}>
				Vernacular architecture is building done outside any academic tradition, and without
				professional guidance. It is not a particular architectural movement or style, but
				rather a broad category, encompassing a wide range and variety of building types,
				with differing methods of construction, from around the world, both historical and
				extant and classical and modern. Vernacular architecture constitutes 95% of the
				world's built environment, as estimated in 1995 by Amos Rapoport, as measured
				against the small percentage of new buildings every year designed by architects and
				built by engineers.
			</p>
		),
	},
};

export const Both: Story = {
	args: {
		orientation: 'both',
        width: 300,
		height: 200,
		children: (
			<p style={{ textWrap: 'nowrap' }}>
				Vernacular architecture is building done outside any academic tradition, and without
				professional guidance. It is not a particular architectural movement or style, but <br />
				rather a broad category, encompassing a wide range and variety of building types, <br />
				with differing methods of construction, from around the world, both historical and <br />
				extant and classical and modern. Vernacular architecture constitutes 95% of the
				world's built environment, as estimated in 1995 by Amos Rapoport, as measured
				against the small percentage of new buildings every year designed by architects and
				built by engineers.
				Vernacular architecture is building done outside any academic tradition, and without
				professional guidance. It is not a particular architectural movement or style, but <br />
				rather a broad category, encompassing a wide range and variety of building types, <br />
				with differing methods of construction, from around the world, both historical and <br />
				extant and classical and modern. Vernacular architecture constitutes 95% of the
				world's built environment, as estimated in 1995 by Amos Rapoport, as measured
				against the small percentage of new buildings every year designed by architects and
				built by engineers.
				Vernacular architecture is building done outside any academic tradition, and without
				professional guidance. It is not a particular architectural movement or style, but <br />
				rather a broad category, encompassing a wide range and variety of building types, <br />
				with differing methods of construction, from around the world, both historical and <br />
				extant and classical and modern. Vernacular architecture constitutes 95% of the
				world's built environment, as estimated in 1995 by Amos Rapoport, as measured
				against the small percentage of new buildings every year designed by architects and
				built by engineers.
			</p>
		),
	},
};
