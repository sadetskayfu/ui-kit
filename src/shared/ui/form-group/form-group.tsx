import * as React from 'react';
import { useEventCallback } from '@/shared/hooks';
import { FormGroupContext } from './form-group-context';
import { FormHelperText } from '@/shared/ui/form-helper-text';
import { classNames } from '@/shared/helpers/class-names';
import { Composite } from '@floating-ui/react';
import styles from './form-group.module.scss';

const FormGroupComponent = <Value extends string[]>(props: FormGroup.Props<Value>) => {
	const {
		className,
		style,
		children,
		label,
		hiddenLabel,
		error,
		disabled = false,
		required = false,
		readOnly = false,
		helperText,
		value,
		onChange,
		minValueLength = 0,
		labelColor = 'soft',
		orientation = 'vertical',
	} = props;

	const helperTextId = React.useId();

	const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value;

		if (value.includes(inputValue)) {
			if (value.length > minValueLength) {
				onChange(
					value.filter(v => v !== inputValue) as Value,
					event
				);
			} else {
				return;
			}
		} else {
			onChange([...value, inputValue] as Value, event);
		}
	});

	const contextValue: FormGroupContext = React.useMemo(
		() => ({ value, onChange: handleChange, disabled, readOnly }),
		[handleChange, value, disabled, readOnly]
	);

	return (
		<Composite
			orientation={orientation}
			render={
				<fieldset
					className={classNames(
						styles['form-group'],
						[
							className,
							styles[`label-color-${labelColor}`],
							styles[`orientation-${orientation}`],
						],
						{ [styles['error']]: error }
					)}
					aria-invalid={error ? 'true' : undefined}
					aria-describedby={helperText ? helperTextId : undefined}
					aria-required={required ? 'true' : undefined}
					aria-disabled={disabled ? 'true' : undefined}
					style={style}
				>
					<legend className={hiddenLabel ? 'visually-hidden' : undefined}>
						{label}
						{required && <span aria-hidden="true"> *</span>}
					</legend>
					<FormGroupContext.Provider value={contextValue}>
						<div className={styles['group']}>{children}</div>
					</FormGroupContext.Provider>
					{helperText && (
						<FormHelperText id={helperTextId} error={error}>
							{helperText}
						</FormHelperText>
					)}
				</fieldset>
			}
		/>
	);
};

export const FormGroup = React.memo(FormGroupComponent) as typeof FormGroupComponent;

export namespace FormGroup {
	export interface Props<Value extends string[]> {
		className?: string;
		style?: React.CSSProperties;
		children?: React.ReactNode;
		label: string;
		/**
		 * Скрывает label визуально
		 * @default false
		 */
		hiddenLabel?: boolean;
		helperText?: string;
		error?: boolean;
		disabled?: boolean;
		required?: boolean;
		readOnly?: boolean;
		value: Value;
		onChange: (value: Value, event: React.ChangeEvent<HTMLInputElement>) => void;
		/**
		 * Не дает возможности снять checked с чекбокса, если текущее кол-во выбранных чекбоксов меньше чем minValueLength
		 * @default 0
		 */
		minValueLength?: number;
		/**
		 * @default 'soft'
		 */
		labelColor?: 'soft' | 'hard';
		/**
		 * @default 'vertical'
		 */
		orientation?: 'horizontal' | 'vertical';
	}
}
