import { lazy, Suspense, useCallback, useMemo, useState, type ReactElement } from 'react';
import { Button } from '@/shared/ui/button';

const MinusIcon = lazy(() =>
	import('@/shared/ui/icons').then(module => ({
		default: module.MinusIcon,
	}))
);
const PlusIcon = lazy(() =>
	import('@/shared/ui/icons').then(module => ({
		default: module.PlusIcon,
	}))
);

type ActionButtonProps = {
	onClick: (event: React.MouseEvent) => void;
};

export interface UseNumberFieldProps {
	min?: number;
	max?: number;
	step?: number;
	defaultValue?: string;
	value?: string;
	readOnly?: boolean;
	actions?: (ReactElement | null)[] | ReactElement;
	inputRef: React.RefObject<HTMLInputElement | null>;
	onChange?: (
		value: string,
		event:
			| React.MouseEvent<HTMLElement>
			| React.KeyboardEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLInputElement>
	) => void;
	renderIncrementButton?: (props: ActionButtonProps) => ReactElement;
	renderDecrementButton?: (props: ActionButtonProps) => ReactElement;
}

const pattern = /^-?[0-9]*$/;

export function useNumberField(props: UseNumberFieldProps) {
	const {
		min,
		max,
		step = 1,
		readOnly: isReadOnly,
		actions: externalActions,
		defaultValue,
		value: controlledValue,
		inputRef,
		onChange: controlledOnChange,
		renderIncrementButton,
		renderDecrementButton,
	} = props;

	const [uncontrolledValue, setUncontrolledValue] = useState<string>(defaultValue || '0');
	const value = controlledValue ?? uncontrolledValue;
	const onChange = controlledOnChange ?? setUncontrolledValue;

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (isReadOnly) return;

			const inputValue = event.target.value;

			if (!inputValue) {
				onChange('', event);
				return;
			}

			if (!pattern.test(inputValue)) {
				return;
			}

			const hasMinus = inputValue.startsWith('-');

			if (hasMinus && inputValue.length === 1) {
				onChange(inputValue, event);
				return;
			}

			const numberInputValue = Number(inputValue);
			let newValue: number = numberInputValue;

			if (min != null && numberInputValue < min) {
				newValue = min;
			} else if (max != null && numberInputValue > max) {
				newValue = max;
			}

			onChange(String(newValue), event);
		},
		[max, min, isReadOnly, onChange]
	);

	const incrementValue = useCallback(
		(event: any) => {
			if (isReadOnly) return;

			const newValue = Number(value) + step;
			onChange(String(max != null ? Math.min(newValue, max) : newValue), event);
		},
		[onChange, max, step, value, isReadOnly]
	);

	const decrementValue = useCallback(
		(event: any) => {
			if (isReadOnly) return;

			const currentValue = value;
			let newValue: number;

			if (currentValue === '-') {
				newValue = -step;
			} else {
				newValue = Number(currentValue) - step;
			}

			onChange(String(min != null ? Math.max(newValue, min) : newValue), event);
		},
		[onChange, min, step, value, isReadOnly]
	);

	const setFocusOnInput = useCallback(() => {
		const input = inputRef.current

		if(input && document.activeElement !== input) {
			input.focus()
		}
	}, [inputRef])

	const handleIncrementValue = useCallback((event: React.MouseEvent) => {
		event.stopPropagation()

		setFocusOnInput()
		incrementValue(event)
	}, [incrementValue, setFocusOnInput])

	const handleDecrementValue = useCallback((event: React.MouseEvent) => {
		event.stopPropagation()

		setFocusOnInput()
		decrementValue(event)
	}, [decrementValue, setFocusOnInput])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (isReadOnly) return;

			switch (event.key) {
				case 'ArrowUp':
					event.preventDefault();
					incrementValue(event);
					break;
				case 'ArrowDown':
					event.preventDefault();
					decrementValue(event);
					break;
				default:
					break;
			}
		},
		[decrementValue, incrementValue, isReadOnly]
	);

	const actions = useMemo(() => {
		const incrementButton = renderIncrementButton ? (
			renderIncrementButton({ onClick: handleIncrementValue})
		) : (
			<Button
				tabIndex={-1}
				size="xs"
				variant="clear"
				color="green"
				borderRadius="circular"
				iconButton
				onClick={handleIncrementValue}
			>
				<Suspense fallback={null}>
					<PlusIcon />
				</Suspense>
			</Button>
		);

		const decrementButton = renderDecrementButton ? (
			renderDecrementButton({ onClick: handleDecrementValue })
		) : (
			<Button
				tabIndex={-1}
				size="xs"
				variant="clear"
				color="red"
				borderRadius="circular"
				iconButton
				onClick={handleDecrementValue}
			>
				<Suspense fallback={null}>
					<MinusIcon />
				</Suspense>
			</Button>
		);

		if (Array.isArray(externalActions)) {
			return [decrementButton, incrementButton, ...externalActions];
		}

		if (externalActions) {
			return [decrementButton, incrementButton, externalActions];
		}

		return [decrementButton, incrementButton];
	}, [
		externalActions,
		handleIncrementValue,
		handleDecrementValue,
		renderDecrementButton,
		renderIncrementButton,
	]);

	return { actions, value, handleChange, handleKeyDown };
}
