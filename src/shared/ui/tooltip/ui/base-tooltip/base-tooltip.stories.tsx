import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/ui/button';
import { BaseTooltip } from './base-tooltip';

const meta: Meta<typeof BaseTooltip> = {
	title: 'shared/tooltip/base-tooltip',
	component: BaseTooltip,
	args: {
		placement: 'top',
		offset: 12,
		arrowPadding: 10,
		flipPadding: 5,
		interactive: false,
		followCursor: false,
		describeChild: false,
		disableFocus: false,
		disableClick: true,
		disableHover: false,
		disableTouch: false,
		centeringText: false,
	},
};

export default meta;

type Story = StoryObj<typeof BaseTooltip>;

export const Default: Story = {
	args: {
		label: 'Солнце сегодня какое-то ленивое. Вроде и светит, но как-то нехотя, сквозь пелену облаков. Сижу у окна, пью чай с лимоном и думаю о всякой ерунде. Например, о том, почему кошки так любят коробки. Или о том, что пора бы уже начать планировать отпуск, а то лето пролетит, как один миг.',
		children: <Button>Button</Button>,
	},
};
