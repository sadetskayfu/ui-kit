import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './field';
import { useId, useMemo, useRef, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { XMarkIcon } from '@/shared/ui/icons';

const meta: Meta<typeof Field> = {
	title: 'shared/field',
	component: Field,
	args: {
		size: 'm',
		variant: 'outlined',
		borderPlacement: 'all',
		label: 'Label',
		helperText: 'Helper text',
		hiddenLabel: false,
		disabled: false,
		required: false,
		errored: false,
		fullWidth: false,
	},
};

export default meta;

type Story = StoryObj<typeof Field>;

const FieldWrapper = (args: any, isTextField: boolean) => {
	const id = useId();
	const inputId = `${id}-input`;
	const labelId = `${id}-label`;

	const [isAdornment, setIsAdornment] = useState<boolean>(false);
	const [actionsCount, setActionsCount] = useState<number>(0);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	const childRef = useRef<HTMLInputElement | HTMLDivElement>(null);

	const handleToggleAdornment = () => {
		setIsAdornment(prev => !prev);
	};

	const addAction = () => {
		setActionsCount(prev => prev + 1);
	};

	const removeAction = () => {
		if (actionsCount <= 0) return;

		setActionsCount(prev => prev - 1);
	};

	const actions = useMemo(() => {
		if (actionsCount === 1) {
			return (
				<Button iconButton size="xs" variant="clear">
					<XMarkIcon />
				</Button>
			);
		}

		if (actionsCount > 1) {
			return Array.from({ length: actionsCount }, (_, index) => index).map(value => (
				<Button key={value} iconButton size="xs" variant="clear">
					<XMarkIcon />
				</Button>
			));
		}
	}, [actionsCount]);

	return (
		<div style={{ width: '350px' }}>
			<div style={{ display: 'flex', marginBottom: '10px' }}>
				<button
					style={{ color: isAdornment ? 'green' : 'black' }}
					onClick={handleToggleAdornment}
				>
					Start adornment
				</button>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginLeft: '10px',
						gap: '5px',
					}}
				>
					<button onClick={removeAction}>-</button>
					<span style={{ width: '100%' }}>Actions count: {actionsCount}</span>
					<button onClick={addAction}>+</button>
				</div>
			</div>
			<Field
				focusTarget={childRef}
				focused={isFocused}
				startAdornment={isAdornment ? 'KG' : undefined}
				actions={actions}
				inputId={isTextField ? inputId : undefined}
				labelId={labelId}
				{...args}
			>
				{isTextField ? (
					<input
						style={{ backgroundColor: 'aquamarine' }}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						ref={childRef as React.RefObject<HTMLInputElement>}
					/>
				) : (
					<div
						style={{
							backgroundColor: 'aquamarine',
							display: 'flex',
							alignItems: 'center',
						}}
						tabIndex={0}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						ref={childRef}
					>
						Text text text text text
					</div>
				)}
			</Field>
		</div>
	);
};

export const WithChildInput: Story = {
	render: args => FieldWrapper(args, true),
};

export const WithChildDiv: Story = {
	render: args => FieldWrapper(args, false),
};

export const Test: Story = {
	render: () => (
		<div style={{display: 'flex', alignItems: 'center', width: '500px'}}>
			<Field fullWidth borderPlacement='left' label="label" labelId="1" variant="outlined">
				<div></div>
			</Field>
			<Field fullWidth borderPlacement='right' hiddenLabel label="label" labelId="1" variant="filled">
				<div></div>
			</Field>
		</div>
	),
};
