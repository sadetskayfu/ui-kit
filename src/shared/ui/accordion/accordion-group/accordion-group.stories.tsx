import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '../accordion';
import { AccordionGroup } from './accordion-group';
import { AccordionClose } from '../accordion-close';
import { Button } from '@/shared/ui/button';

const meta: Meta<typeof AccordionGroup> = {
	title: 'shared/accordion/accordion-group',
	component: Accordion,
	args: {
        initialOpen: '1'
    },
};

export default meta;

type Story = StoryObj<typeof AccordionGroup>;

const SharedAccordionContent = () => {
	return (
		<p>
			Солнце сегодня какое-то ленивое. Вроде и светит, но как-то нехотя, сквозь пелену
			облаков. Сижу у окна, пью чай с лимоном и думаю о всякой ерунде. Например, о том, почему
			кошки так любят коробки. Или о том, что пора бы уже начать планировать отпуск, а то лето
			пролетит, как один миг.
		</p>
	);
};

const AccordionGroupWrapper = (args: any) => {
	return (
        <AccordionGroup style={{display: 'flex', flexDirection: 'column', rowGap: '15px'}} {...args}>
			<Accordion title="Accordion 1">
				<SharedAccordionContent />
			</Accordion>
			<Accordion title="Accordion 2">
				<SharedAccordionContent />
			</Accordion>
            <Accordion title="Accordion 3">
				<SharedAccordionContent />
                <AccordionClose>
                    <Button style={{marginLeft: 'auto', marginTop: '5px'}} variant='outlined' size='s'>Close</Button>
                </AccordionClose>
			</Accordion>
        </AccordionGroup>
	);
};

export const Default: Story = {
    render: args => AccordionGroupWrapper(args)
}
