import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './accordion';
import { Button } from '@/shared/ui/button';
import { AccordionClose } from './accordion-close';
import { useState } from 'react';

const meta: Meta<typeof Accordion> = {
	title: 'shared/accordion',
	component: Accordion,
	args: {
		lazy: false,
		fade: false,
		duration: 300,
		initialOpen: false,
	},
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const SharedAccordionContent = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
			<p>
				Солнце сегодня какое-то ленивое. Вроде и светит, но как-то нехотя, сквозь пелену
				облаков. Сижу у окна, пью чай с лимоном и думаю о всякой ерунде. Например, о том,
				почему кошки так любят коробки. Или о том, что пора бы уже начать планировать
				отпуск, а то лето пролетит, как один миг.
			</p>
			<div style={{ display: 'flex', columnGap: '10px', marginLeft: 'auto' }}>
				<Button size="s">Button</Button>
				{children && children}
			</div>
		</div>
	);
};

const UncontrolledAccordionWrapper = (args: any) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', rowGap: '15px', width: '100%' }}>
			<Accordion title="Accordion 1" {...args}>
				<SharedAccordionContent>
					<AccordionClose>
						<Button size="s" variant="outlined">
							Close
						</Button>
					</AccordionClose>
				</SharedAccordionContent>
			</Accordion>
			<Accordion title="Accordion 2" {...args}>
				<SharedAccordionContent />
			</Accordion>
		</div>
	);
};

const ControlledAccordionWrapper = (args: any) => {
	const [openedAccordions, setOpenedAccordions] = useState<string[]>([]);

	const handleToggle = (value: string) => {
		if (openedAccordions.find(openedAccordion => openedAccordion === value)) {
			setOpenedAccordions(
				openedAccordions.filter(openedAccordions => openedAccordions !== value)
			);
		} else {
			setOpenedAccordions([...openedAccordions, value]);
		}
	};

	const handleClose = (value: string) => {
		setOpenedAccordions(
			openedAccordions.filter(openedAccordions => openedAccordions !== value)
		);
	};

	const handleCloseAll = () => {
		setOpenedAccordions([]);
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', rowGap: '15px', width: '100%' }}>
			<Accordion
				title="Accordion 1"
				open={Boolean(openedAccordions.find(openedAccordion => openedAccordion === '1'))}
				onClick={() => handleToggle('1')}
				{...args}
			>
				<SharedAccordionContent>
					<AccordionClose>
						<Button onClick={() => handleClose('1')} size="s" variant="outlined">
							Close
						</Button>
					</AccordionClose>
				</SharedAccordionContent>
			</Accordion>
			<Accordion
				title="Accordion 2"
				open={Boolean(openedAccordions.find(openedAccordion => openedAccordion === '2'))}
				onClick={() => handleToggle('2')}
				{...args}
			>
				<SharedAccordionContent />
			</Accordion>
			<Accordion
				title="Accordion 3"
				open={Boolean(openedAccordions.find(openedAccordion => openedAccordion === '3'))}
				onClick={() => handleToggle('3')}
				{...args}
			>
				<SharedAccordionContent />
			</Accordion>
			<Button variant="clear" onClick={handleCloseAll}>
				Close all
			</Button>
		</div>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledAccordionWrapper(args),
};

export const Controlled: Story = {
	render: args => ControlledAccordionWrapper(args),
};

