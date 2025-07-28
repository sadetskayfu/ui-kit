import * as React from 'react';
import { useEventCallback } from '@/shared/hooks';
import { FormLabel } from '@/shared/ui/form-label';
import { FormHelperText } from '@/shared/ui/form-helper-text';
import { classNames } from '@/shared/helpers/class-names';
import { RadioGroupContext } from './radio-group-context';
import styles from './radio-group.module.scss';

/**
 * Renders a `<fieldset>` element with `<legend>`.
 */
export const RadioGroup = <Value extends string>(props: RadioGroup.Props<Value>) => {
	const {
		children,
		className,
		itemGroupClassName,
		label,
        name,
		value,
		onChange,
		disabled = false,
		required,
		hiddenLabel,
		error,
		helperText,
		orientation = 'horizontal',
		labelColor = 'soft',
		...otherProps
	} = props;

	const helperTextId = React.useId();

    const handleChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value as Value, event)
    })

	const contextValue: RadioGroupContext = React.useMemo(
		() => ({ name, value, disabled, onChange: handleChange, }),
		[name, value, disabled, handleChange]
	);

	return (
		<fieldset
			className={classNames(styles['radio-group'], [
				className,
				styles[`orientation-${orientation}`],
			])}
			aria-invalid={error ? 'true' : undefined}
			aria-disabled={disabled ? 'true' : undefined}
			aria-required={required ? 'true' : undefined}
			aria-describedby={helperText ? helperTextId : undefined}
			aria-orientation={orientation}
			{...otherProps}
		>
			<FormLabel
				Tag="legend"
				hidden={hiddenLabel}
				required={required}
				errored={error}
				color={labelColor}
			>
				{label}
			</FormLabel>
			<div role="group" className={classNames(styles['item-group'], [itemGroupClassName])}>
				<RadioGroupContext.Provider value={contextValue}>
					{children}
				</RadioGroupContext.Provider>
			</div>
			{helperText && (
				<FormHelperText id={helperTextId} error={error}>
					{helperText}
				</FormHelperText>
			)}
		</fieldset>
	);
};

export namespace RadioGroup {
	export interface Props<Value extends string> {
		children?: React.ReactNode;
		className?: string;
		itemGroupClassName?: string;
		style?: React.CSSProperties;
        name: string
		label: string;
		value: Value;
		onChange: (value: Value, event: React.ChangeEvent<HTMLInputElement>) => void;
		disabled?: boolean;
		required?: boolean;
		hiddenLabel?: boolean;
		error?: boolean;
		helperText?: string;
		/**
		 * @default 'horizontal'
		 */
		orientation?: 'horizontal' | 'vertical';
		/**
		 * @default 'soft'
		 */
		labelColor?: 'soft' | 'hard';
	}
}
