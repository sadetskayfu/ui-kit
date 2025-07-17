import { forwardRef, memo, useRef } from 'react';
import { TextField, type TextFieldProps } from '@/shared/ui/text-field';
import { useNumberField, type UseNumberFieldProps } from '../model/use-number-field';

type NumberFieldProps = Omit<UseNumberFieldProps, 'inputRef'> &
	Omit<TextFieldProps, 'value' | 'defaultValue' | 'onChange' | 'onClear' | 'clearButton'>;

export const NumberField = memo(
	forwardRef((props: NumberFieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
		const {
			min,
			max,
			step,
			defaultValue,
			value: externalValue,
			onChange,
			renderIncrementButton,
			renderDecrementButton,
			actions: externalActions,
			readOnly,
			inputRef: externalInputRef,
			...otherProps
		} = props;
		const localInputRef = useRef<HTMLInputElement>(null);
		const inputRef = externalInputRef ?? localInputRef

		const { value, actions, handleChange, handleKeyDown } = useNumberField({
			min,
			max,
			step,
			defaultValue,
			value: externalValue,
			onChange,
			renderIncrementButton,
			renderDecrementButton,
			actions: externalActions,
			readOnly,
			inputRef,
		});

		return (
			<TextField
				ref={ref}
				inputRef={inputRef}
				value={value}
				actions={actions}
				readOnly={readOnly}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				{...otherProps}
			/>
		);
	})
);
