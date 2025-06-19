import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/ui/button';
import { useId, useRef, useState } from 'react';
import { Collapse } from './collapse';
import { CollapseTrigger } from './collapse-trigger';
import { CollapseContent } from './collapse-content';
import { CollapseClose } from './collapse-close';

const meta: Meta<typeof Collapse> = {
	title: 'shared/collapse',
	component: Collapse,
	args: {
		initialOpen: false,
		lazy: false,
		fade: false,
		duration: 300,
	},
};

export default meta;

type Story = StoryObj<typeof Collapse>;

const SharedCollapseContent = ({ children }: { children?: React.ReactNode }) => {
	return (
		<CollapseContent>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					rowGap: '10px',
					backgroundColor: 'black',
					padding: '10px',
				}}
			>
				<p>
					Солнце сегодня какое-то ленивое. Вроде и светит, но как-то нехотя, сквозь пелену
					облаков. Сижу у окна, пью чай с лимоном и думаю о всякой ерунде. Например, о
					том, почему кошки так любят коробки. Или о том, что пора бы уже начать
					планировать отпуск, а то лето пролетит, как один миг.
				</p>
				<div style={{ display: 'flex', columnGap: '10px', marginLeft: 'auto' }}>
					<Button borderRadius='none' size="s" variant="filled">
						Button
					</Button>
					{children && children}
				</div>
			</div>
		</CollapseContent>
	);
};

const UncontrolledCollapse = (args: any) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<Collapse {...args}>
				<CollapseTrigger>
					<Button variant="outlined" borderRadius="none">
						Collapse 1
					</Button>
				</CollapseTrigger>
				<SharedCollapseContent>
					<CollapseClose>
						<Button borderRadius='none' size="s" variant="outlined">
							Close
						</Button>
					</CollapseClose>
				</SharedCollapseContent>
			</Collapse>
			<Collapse {...args}>
				<CollapseTrigger>
					<Button variant="outlined" borderRadius="none">
						Collapse 2
					</Button>
				</CollapseTrigger>
				<SharedCollapseContent>
					<CollapseClose>
						<Button size="s" variant="outlined" borderRadius='none'>
							Close
						</Button>
					</CollapseClose>
				</SharedCollapseContent>
			</Collapse>
		</div>
	);
};

const ControlledCollapse = (args: any) => {
	const [openedCollapse, setOpenedCollapse] = useState<string>('');

	const handleOpen = (value: string) => {
		if (openedCollapse === value) {
			setOpenedCollapse('');
		} else {
			setOpenedCollapse(value);
		}
	};

	const handleClose = () => {
		setOpenedCollapse('');
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<Collapse open={openedCollapse === '1'} {...args}>
				<CollapseTrigger>
					<Button onClick={() => handleOpen('1')} variant="outlined" borderRadius="none">
						Collapse 1
					</Button>
				</CollapseTrigger>
				<SharedCollapseContent>
					<CollapseClose>
						<Button onClick={handleClose} size="s"  variant="outlined" borderRadius='none'>
							Close
						</Button>
					</CollapseClose>
				</SharedCollapseContent>
			</Collapse>
			<Collapse open={openedCollapse === '2'} {...args}>
				<CollapseTrigger>
					<Button variant="outlined" onClick={() => handleOpen('2')} borderRadius="none">
						Collapse 2
					</Button>
				</CollapseTrigger>
				<SharedCollapseContent>
					<CollapseClose>
						<Button size="s" onClick={handleClose} variant="outlined" borderRadius='none'>
							Close
						</Button>
					</CollapseClose>
				</SharedCollapseContent>
			</Collapse>
		</div>
	);
};

const CollapseWithCustomTrigger = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const id = useId();
	const labelId = `${id}-label`;
	const bodyId = `${id}-body`;

	const referenceRef = useRef<HTMLButtonElement>(null);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<Button
				ref={referenceRef}
				id={labelId}
				onClick={() => setIsOpen(prev => !prev)}
				aria-controls={isOpen ? bodyId : undefined}
				aria-expanded={isOpen ? 'true' : 'false'}
				borderPlacement={isOpen ? 'top' : 'all'}
			>
				Open collapse
			</Button>
			<Collapse
				referenceRef={referenceRef}
				open={isOpen}
				setOpen={setIsOpen}
				labelId={labelId}
				bodyId={bodyId}
				{...args}
			>
				<SharedCollapseContent>
					<CollapseClose>
						<Button size='s' variant="outlined" borderRadius='none'>Close</Button>
					</CollapseClose>
				</SharedCollapseContent>
			</Collapse>
		</div>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledCollapse(args),
};

export const Controlled: Story = {
	render: args => ControlledCollapse(args),
};

export const WithCustomTrigger: Story = {
	render: args => CollapseWithCustomTrigger(args),
};
