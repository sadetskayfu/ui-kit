import * as React from 'react';
import { useEventCallback } from '@/shared/hooks';
import { ToggleGroupContext } from './toggle-group-context';
import { FormLabel } from '@/shared/ui/form-label';
import { FormHelperText } from '@/shared/ui/form-helper-text';
import { Composite } from '@floating-ui/react';
import { classNames } from '@/shared/helpers/class-names';
import styles from './toggle-group.module.scss';

/**
 * Renders a `<fieldset>` element with `<legend>`.
 */
export const ToggleGroup = <Value extends string | string[]>(props: ToggleGroup.Props<Value>) => {
	const {
		children,
		className,
		itemGroupClassName,
		label,
		value,
		onChange,
		disabled = false,
		required,
		hiddenLabel,
		error,
		helperText,
		orientation = 'horizontal',
		labelColor = 'soft',
		minValueLength = 0,
		...otherProps
	} = props;

	const helperTextId = React.useId();

	const handleChange = useEventCallback((toggleValue: string, event: React.MouseEvent) => {
		if (Array.isArray(value)) {
			if (value.includes(toggleValue)) {
				if (value.length > minValueLength) {
					onChange(value.filter(v => v !== toggleValue) as Value, event);
				} else {
					return;
				}
			} else {
				onChange([...value, toggleValue] as Value, event);
			}
		} else {
			if (value === toggleValue) {
				if (minValueLength > 0) {
					return
				} else {
					onChange('' as Value, event)
				}
			} else {
				onChange(toggleValue as Value, event);
			}
		}
	});

	const contextValue: ToggleGroupContext = React.useMemo(
		() => ({ value, onChange: handleChange, disabled }),
		[value, disabled, handleChange]
	);

	return (
		<Composite
			orientation={orientation}
			render={
				<fieldset
					className={classNames(styles['toggle-group'], [className, styles[`orientation-${orientation}`]])}
					aria-invalid={error ? 'true' : undefined}
					aria-disabled={disabled ? 'true' : undefined}
					aria-required={required ? 'true' : undefined}
					aria-describedby={helperText ? helperTextId : undefined}
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
					<div
						role="group"
						className={classNames(styles['item-group'], [itemGroupClassName])}
					>
						<ToggleGroupContext.Provider value={contextValue}>
							{children}
						</ToggleGroupContext.Provider>
					</div>
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

export namespace ToggleGroup {
	export interface Props<Value extends string | string[]> {
		children?: React.ReactNode;
		className?: string;
		itemGroupClassName?: string;
		style?: React.CSSProperties;
		label: string;
		value: Value;
		onChange: (value: Value, event: React.MouseEvent) => void;
		disabled?: boolean;
		required?: boolean;
		hiddenLabel?: boolean;
		error?: boolean;
		helperText?: string;
		/**
		 * @default 0
		 */
		minValueLength?: number;
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
