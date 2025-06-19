import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/shared/ui/button';
import { useId, useRef, useState } from 'react';
import { Tooltip } from './tooltip';
import { TooltipTrigger } from './tooltip-trigger';
import { TooltipContent } from './tooltip-content';
import { DelayGroup } from '@/shared/ui/delay-group';

const meta: Meta<typeof Tooltip> = {
	title: 'shared/tooltip',
	component: Tooltip,
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
	},
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

const SharedTooltipContent = ({ contentSize }: { contentSize: 'min' | 'max' }) => {
	return (
		<TooltipContent>
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
		</TooltipContent>
	);
};

const UncontrolledTooltipWrapper = (args: any) => {
	return (
		<div style={{ display: 'flex', columnGap: '10px' }}>
			<Tooltip {...args}>
				<TooltipTrigger>
					<Button>Min content</Button>
				</TooltipTrigger>
				<SharedTooltipContent contentSize="min" />
			</Tooltip>
			<Tooltip {...args}>
				<TooltipTrigger>
					<Button>Max content</Button>
				</TooltipTrigger>
				<SharedTooltipContent contentSize="max" />
			</Tooltip>
		</div>
	);
};

const WithDelayGroupWrapper = (args: any) => {
	return (
		<div style={{ display: 'flex', columnGap: '10px' }}>
			<DelayGroup>
				<Tooltip {...args}>
					<TooltipTrigger>
						<Button>Tooltip 1</Button>
					</TooltipTrigger>
					<SharedTooltipContent contentSize="min" />
				</Tooltip>
				<Tooltip {...args}>
					<TooltipTrigger>
						<Button>Tooltip 2</Button>
					</TooltipTrigger>
					<SharedTooltipContent contentSize="min" />
				</Tooltip>
				<Tooltip {...args}>
					<TooltipTrigger>
						<Button>Tooltip 3</Button>
					</TooltipTrigger>
					<SharedTooltipContent contentSize="min" />
				</Tooltip>
			</DelayGroup>
		</div>
	);
};

const ControlledTooltipWrapper = (args: any) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	return (
		<Tooltip open={isOpen} setOpen={setIsOpen} {...args}>
			<TooltipTrigger>
				<Button onClick={handleToggle}>{isOpen ? 'Close' : 'Open'}</Button>
			</TooltipTrigger>
			<SharedTooltipContent contentSize="max" />
		</Tooltip>
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
			<Tooltip
				id={tooltipId}
				referenceRef={inputRef}
				open={isOpen}
				setOpen={setIsOpen}
				{...args}
			>
				<SharedTooltipContent contentSize="max" />
			</Tooltip>
		</>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledTooltipWrapper(args),
};

export const Controlled: Story = {
	render: args => ControlledTooltipWrapper(args),
};

export const WithCustomTrigger: Story = {
    render: args => WithCustomTriggerWrapper(args),
}

export const WithDelayGroup: Story = {
	render: args => WithDelayGroupWrapper(args),
};

export const OpenOnClick: Story = {
	render: args => UncontrolledTooltipWrapper(args),
	args: {
		disableClick: false,
		disableFocus: true,
		disableHover: true,
		disableTouch: true,
	},
};
