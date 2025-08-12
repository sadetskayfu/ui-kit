import * as React from 'react';
import { Select } from '../../index';
import { FilledField } from '@/shared/ui/field';

export const FilledSelect = (props: FilledSelect.Props) => {
	const {
		className,
		label,
		hiddenLabel,
		children,
		readOnly,
		required,
		disabled,
		errored,
		startAdornment,
		actions,
		placeholder,
		helperText,
		renderValue,
		size,
        selectRef,
        fieldRef,
        ...otherProps
	} = props;

	const sharedMods = {
		disabled,
		required,
		readOnly,
	};

	return (
		<Select.Root {...sharedMods} {...otherProps}>
			<FilledField.Root {...sharedMods} errored={errored} className={className} size={size}>
				<FilledField.Label hidden={hiddenLabel}>{label}</FilledField.Label>
				<Select.Trigger
                    ref={fieldRef}
					render={
						<FilledField.Field >
							{startAdornment && (
								<FilledField.StartAdornment>
									{startAdornment}
								</FilledField.StartAdornment>
							)}
							<FilledField.Control
								nativeInput={false}
                                ref={selectRef as any}
								render={
									<Select.Control >
										<Select.Value
											placeholder={placeholder}
											render={renderValue}
										/>
									</Select.Control>
								}
							/>
							<FilledField.Actions offset="xs">
								{actions}
								<Select.Icon
								/>
							</FilledField.Actions>
						</FilledField.Field>
					}
				/>
				{helperText && <FilledField.HelperText>{helperText}</FilledField.HelperText>}
			</FilledField.Root>
			{children}
		</Select.Root>
	);
};

export namespace FilledSelect {
	export interface Props extends Omit<Select.Root.Props, 'children'> {
		className?: string;
		label: string;
		hiddenLabel?: boolean;
		children?: React.ReactNode;
		startAdornment?: React.ReactNode;
		actions?: React.ReactNode;
		placeholder?: string;
		helperText?: string;
		errored?: boolean;
		renderValue?: Select.Value.Props['render'];
		size?: FilledField.Root.Props['size'];
        selectRef?: React.RefObject<HTMLDivElement>
        fieldRef?: React.RefObject<HTMLDivElement>
	}
}
