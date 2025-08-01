import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/ui/button';
import { useId, useRef, useState } from 'react';
import { Tooltip } from '.';

const meta: Meta<typeof Tooltip.Root> = {
	title: 'shared/tooltip',
	component: Tooltip.Root,
	args: {
		placement: 'top',
		flipPadding: 5,
		interactive: true,
		followCursor: false,
		describeChild: false,
		disableFocus: false,
		disableClick: true,
		disableHover: false,
		disableLongTouch: false,
        openTimeAfterLongTouch: 5000,
        closeOnOutsidePress: false
	},
};

export default meta;

type Story = StoryObj<typeof Tooltip.Root>;

const SharedTooltipPopup = ({ contentSize }: { contentSize: 'min' | 'max' }) => {
	return (
		<Tooltip.Popup>
			{contentSize === 'max' ? (
				<span>
					Солнце сегодня какое-то ленивое. Вроде и светит, но как-то нехотя, сквозь пелену
					облаков. Сижу у окна, пью чай с лимоном и думаю о всякой ерунде. Например, о
					том, почему кошки так любят коробки. Или о том, что пора бы уже начать
					планировать отпуск, а то лето пролетит, как один миг.
				</span>
			) : (
				<span>1</span>
			)}
            <Tooltip.Arrow />
		</Tooltip.Popup>
	);
};

const UncontrolledTooltipWrapper = (args: any) => {
	return (
		<div style={{ display: 'flex', columnGap: '10px' }}>
			<Tooltip.Root {...args}>
				<Tooltip.Trigger render={<Button>Min content</Button>} />
				<SharedTooltipPopup contentSize="min" />
			</Tooltip.Root>
			<Tooltip.Root {...args}>
            <Tooltip.Trigger render={<Button>Max content</Button>} />
				<SharedTooltipPopup contentSize="max" />
			</Tooltip.Root>
		</div>
	);
};

const WithGroupWrapper = (args: any) => {
	return (
		<div style={{ display: 'flex', columnGap: '10px' }}>
			<Tooltip.Group delay={300}>
				<Tooltip.Root {...args}>
					<Tooltip.Trigger render={<Button>Tooltip 1</Button>} />
					<SharedTooltipPopup contentSize="min" />
				</Tooltip.Root>
				<Tooltip.Root {...args}>
                    <Tooltip.Trigger render={<Button>Tooltip 2</Button>} />
					<SharedTooltipPopup contentSize="min" />
				</Tooltip.Root>
				<Tooltip.Root {...args}>
                    <Tooltip.Trigger render={<Button>Tooltip 3</Button>} />
					<SharedTooltipPopup contentSize="min" />
				</Tooltip.Root>
			</Tooltip.Group>
		</div>
	);
};

const WithCustomTriggerWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const tooltipId = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<>
			<input
				ref={inputRef}
				aria-describedby={isOpen ? tooltipId : undefined}
				placeholder="Placeholder.."
				onFocus={handleOpen}
				onBlur={handleClose}
			/>
			<Tooltip.Root
				referenceRef={inputRef}
				open={isOpen}
				setOpen={setIsOpen}
				{...args}
			>
				<Tooltip.Popup id={tooltipId}>
                    <p>Hello world</p>
                </Tooltip.Popup>
			</Tooltip.Root>
		</>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledTooltipWrapper(args),
};

export const WithCustomTrigger: Story = {
    render: args => WithCustomTriggerWrapper(args),
}

export const WithGroup: Story = {
	render: args => WithGroupWrapper(args),
};

export const OpenOnClick: Story = {
	render: args => UncontrolledTooltipWrapper(args),
	args: {
		disableClick: false,
		disableFocus: true,
		disableHover: true,
		disableLongTouch: true,
	},
};

export const FollowCursor: Story = {
    render: args => UncontrolledTooltipWrapper(args),
	args: {
        followCursor: true
	}, 
}
