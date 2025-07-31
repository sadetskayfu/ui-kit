import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './index';
import { Button } from '@/shared/ui/button';
import { BorderProvider } from '@/shared/ui/border-provider';

const meta: Meta<typeof Drawer.Root> = {
	title: 'shared/drawer',
	component: Drawer.Root,
	args: {
		removeScroll: true,
		returnFocus: true,
		initialOpen: false,
		modal: true,
		closeOnFocusOut: true,
		closeOnOutsidePress: true,
		position: 'bottom',
	},
	argTypes: {
		position: {
			control: 'radio',
			options: ['bottom', 'top', 'left', 'right'],
		},
	},
};

export default meta;

type Story = StoryObj<typeof Drawer.Root>;

const DrawerWrapper = (args: any, width?: number, height?: number) => {
	return (
		<Drawer.Root {...args}>
			<Drawer.Trigger render={<Button>Drawer trigger</Button>} />
			<Drawer.Popup
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '15px',
					height,
					width,
				}}
			>
				{args.position === 'bottom' && <Drawer.Indicator />}
				<Drawer.Title className="fs-5">Title</Drawer.Title>
				<Drawer.Description className="fc-soft">
					Практический опыт показывает, что курс на социально-ориентированный национальный
					проект способствует подготовке и реализации дальнейших направлений развития
					проекта. Значимость этих проблем настолько очевидна, что повышение уровня
					гражданского сознания обеспечивает широкому кругу специалистов участие в
					формировании соответствующих условий активизации? Не следует, однако, забывать о
					том, что выбранный нами инновационный путь позволяет оценить значение
					соответствующих условий активизации?
				</Drawer.Description>
				<BorderProvider borderRadius="m">
					<Drawer.Close
						render={
							<Button color="secondary" variant="outlined" style={{ width: '200px' }}>
								Close
							</Button>
						}
					/>
				</BorderProvider>
				{args.position === 'top' && <Drawer.Indicator />}
			</Drawer.Popup>
		</Drawer.Root>
	);
};

export const Bottom: Story = {
	render: args => DrawerWrapper(args),
};

export const Left: Story = {
	render: args => DrawerWrapper(args, 400),
	args: {
		position: 'left'
	}
};

export const WithSnapPoints: Story = {
	render: args => DrawerWrapper(args, undefined, 500),
	args: {
		snapPoints: ['150px', '300px', 1],
		initialSnapPointIndex: 0,
	},
};
