import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './text-field';
import { useCallback, useId, useRef, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { GearIcon } from '@/shared/ui/icons';
import { Tooltip, TooltipContent } from '@/shared/ui/tooltip';

const meta: Meta<typeof TextField> = {
	title: 'shared/text-field',
	component: TextField,
	args: {
		variant: 'outlined',
		size: 'm',
		borderPlacement: 'all',
		label: 'Label',
		disabled: false,
		readOnly: false,
		required: false,
		fullWidth: false,
		hiddenLabel: false,
		clearButton: false,
		placeholder: 'Enter value',
		helperText: 'Helper text',
		type: 'text',
	},
};

export default meta;

type Story = StoryObj<typeof TextField>;

const ControlledFieldWrapper = (args: any) => {
	const [value, setValue] = useState('');
	const [error, setError] = useState('');

	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value);
	}, []);

	const handleValidate = useCallback(() => {
		if (value.length < 4) {
			setError('Минимальная длина 4 символа');
		} else {
			setError('');
		}
	}, [value]);

	const handleClear = useCallback(() => {
		setValue('');
	}, []);

	return (
		<div style={{ width: '400px' }}>
			<TextField
				errored={Boolean(error)}
				value={value}
				onBlur={handleValidate}
				onChange={handleChange}
				onClear={handleClear}
				{...args}
				helperText={error ? error : 'Helper text'}
			/>
		</div>
	);
};

const IntegrationWithTooltipWrapper = (args: any) => {
	const [isOpenTooltip, setIsOpenTooltip] = useState<boolean>(false);
	const tooltipHelperTextId = useId();

	const inputRef = useRef<HTMLInputElement>(null);
    const fieldRef = useRef<HTMLDivElement>(null)

	return (
		<div style={{ display: 'flex' }}>
			<Button borderPlacement="left" onClick={() => inputRef.current?.focus()}>
				Set focus on input (check input ref)
			</Button>
			<TextField
				{...args}
                ref={fieldRef}
                inputRef={inputRef}
				onFocus={() => setIsOpenTooltip(true)}
				onBlur={() => setIsOpenTooltip(false)}
				clearButton
				aria-describedby={isOpenTooltip ? tooltipHelperTextId : undefined}
				borderPlacement="right"
			/>
			<Tooltip referenceRef={fieldRef} open={isOpenTooltip} setOpen={setIsOpenTooltip}>
				<TooltipContent>
					<span id={tooltipHelperTextId}>Helper text in tooltip</span>
				</TooltipContent>
			</Tooltip>
		</div>
	);
};

export const Default: Story = {};

export const WithAdornment: Story = {
	args: {
		startAdornment: 'KG',
		clearButton: true,
	},
};

export const WithActions: Story = {
	args: {
		actions: [
			<Button
				onClick={e => e.stopPropagation()}
				iconButton
				borderRadius="circular"
				size="xs"
				variant="clear"
				color="secondary"
			>
				<GearIcon />
			</Button>,
			<Button
				onClick={e => e.stopPropagation()}
				iconButton
				borderRadius="circular"
				size="xs"
				variant="clear"
				color="secondary"
			>
				<GearIcon />
			</Button>,
		],
		clearButton: true,
	},
};

export const WithCustomClearButton: Story = {
	args: {
		renderClearButton: props => (
			<Button variant="outlined" color="secondary" size="s" borderRadius="m" {...props}>
				clear
			</Button>
		),
		clearButton: true,
        actionsStyle: {
            paddingInline: '5px'
        }
	},
};

export const Controlled: Story = {
	render: args => ControlledFieldWrapper(args),
};

export const IntegrationWithTooltip: Story = {
	render: args => IntegrationWithTooltipWrapper(args),
};
