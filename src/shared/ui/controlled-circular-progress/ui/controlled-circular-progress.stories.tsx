import type { Meta, StoryObj } from '@storybook/react';
import { ControlledCircularProgress } from './controlled-circular-progress';
import { Button } from '@/shared/ui/button';
import { useTimer } from '@/shared/hooks';

const meta: Meta<typeof ControlledCircularProgress> = {
	title: 'shared/controlled-circular-progress',
	component: ControlledCircularProgress,
	args: {
		color: 'inherit',
		size: 24,
		strokeWidth: 2,
	},
};

export default meta;

type Story = StoryObj<typeof ControlledCircularProgress>;

const ControlledIncrementProgressWrapper = (args: any) => {
	const { time, startTimer, isRunning } = useTimer({
		startTime: 0,
		endTime: 100,
		variant: 'incr',
		step: 20,
	});

	return (
		<div style={{ position: 'relative' }}>
			<Button onClick={startTimer} disabled={isRunning}>
				Start loading
			</Button>
			{isRunning && (
				<ControlledCircularProgress
					label={`${time}%`}
					value={time}
					minValue={0}
					maxValue={100}
					absCenter
					{...args}
				/>
			)}
		</div>
	);
};

const ControlledDecrementProgressWrapper = (args: any) => {
	const { time, startTimer, isRunning } = useTimer({
		startTime: 5,
		endTime: 0,
		variant: 'decr',
		step: 1,
	});

	return (
		<div style={{ position: 'relative' }}>
			<Button onClick={startTimer} disabled={isRunning}>
				Start loading
			</Button>
			{isRunning && (
				<ControlledCircularProgress
					label={`${time}`}
					value={time}
					minValue={0}
					maxValue={5}
					absCenter
					{...args}
				/>
			)}
		</div>
	);
};

export const IncrementProgress: Story = {
	render: args => ControlledIncrementProgressWrapper(args),
};

export const DecrementProgress: Story = {
	render: args => ControlledDecrementProgressWrapper(args),
};
