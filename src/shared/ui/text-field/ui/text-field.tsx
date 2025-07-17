import {
	Field,
	type FieldBorderPlacement,
	type FieldSize,
	type FieldVariant,
} from '@/shared/ui/field';
import {
	forwardRef,
	memo,
	type InputHTMLAttributes,
	type ReactNode,
} from 'react';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import { useMergeRefs } from '@floating-ui/react';
import { useTextField, type UseTextFieldProps } from '../model/use-text-field';
import styles from './text-field.module.scss';

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

export interface TextFieldProps extends HTMLInputProps, UseTextFieldProps {
	className?: string;
	label: string;
	variant?: FieldVariant;
	size?: FieldSize;
	borderPlacement?: FieldBorderPlacement;
	helperText?: string | null;
	startAdornment?: ReactNode;
	hiddenLabel?: boolean;
	errored?: boolean;
	fullWidth?: boolean;
	actionsStyle?: React.CSSProperties
	inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const TextField = memo(
	forwardRef((props: TextFieldProps, ref: React.ForwardedRef<HTMLDivElement>) => {
		const {
			className,
			label,
			labelId: externalLabelId,
			name,
			actions: externalActions,
			startAdornment,
			helperText,
			defaultDirty,
			clearButton,
			inputRef: externalInputRef,
			type = 'text',
			variant,
			size,
			borderPlacement,
			hiddenLabel: isHiddenLabel,
			disabled: isDisabled,
			required: isRequired,
			readOnly: isReadOnly,
			errored: isErrored,
			fullWidth: isFullWidth,
			actionsStyle,
			onBlur,
			onFocus,
			onClear,
			onChange,
			onMouseDown,
			renderClearButton,
			...otherProps
		} = props;

		const {
			handleFocus,
			handleBlur,
			handleChange,
			isDirty,
			isFocused,
			actions,
			inputId,
			labelId,
			inputRef,
		} = useTextField({
			labelId: externalLabelId,
			name,
			actions: externalActions,
			defaultDirty,
			clearButton,
			renderClearButton,
			onBlur,
			onFocus,
			onClear,
			onChange,
		});

		const mergeInputRef = useMergeRefs([inputRef, externalInputRef]);

		const mods: Mods = {
			[styles['dirty']]: isDirty,
			[styles['focused']]: isFocused,
			[styles['readonly']]: isReadOnly,
		};

		return (
			<Field
				className={className}
				fieldClassName={classNames(styles['field'], [], mods)}
				label={label}
				labelId={labelId}
				inputId={inputId}
				variant={variant}
				size={size}
				borderPlacement={borderPlacement}
				hiddenLabel={isHiddenLabel}
				errored={isErrored}
				focused={isFocused}
				startAdornment={startAdornment}
				actions={actions}
				helperText={helperText}
				focusTarget={inputRef}
				disabled={isDisabled}
				required={isRequired}
				fullWidth={isFullWidth}
				actionsStyle={actionsStyle}
				ref={ref}
			>
				<input
					className={styles['input']}
					id={inputId}
					ref={mergeInputRef}
					name={name}
					type={type}
					disabled={isDisabled}
					required={isRequired}
					readOnly={isReadOnly}
					onChange={handleChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					onMouseDown={event => {
						event.stopPropagation();
						onMouseDown?.(event);
					}}
					aria-invalid={isErrored ? 'true' : 'false'}
					{...otherProps}
				/>
			</Field>
		);
	})
);
