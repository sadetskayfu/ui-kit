import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import {
	CheckboxVariantContext,
	useCheckboxVariantContext,
} from './variant-provider/checkbox-variant-context';
import { useFormGroupContext } from '@/shared/ui/form-group';
import { CheckMarkIcon } from '@/shared/ui/icons';
import { Ripple, useRipple } from '@/shared/lib/ripple';
import { mergeProps } from '@/shared/helpers/merge-props';
import { CompositeItem } from '@floating-ui/react';
import { parseOffset } from '@/shared/helpers/parse-offset';
import { useFormControlLabelContext } from '@/shared/ui/form-control-label';
import styles from './checkbox.module.scss';

/**
 * Renders a `<span>` element with hidden inout
 */
export const Checkbox = React.forwardRef(
	(props: Checkbox.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
		const {
			className,
			style,
			inputRef,
			containerProps,
			uncheckedIcon,
			checkedIcon,
			color,
			variant,
			size,
			offset,
			disabled,
			required,
			checked,
			disableRipple,
			value,
			onChange,
			...otherProps
		} = props;

		const { containerRef, ripples, removeRipple, ...rippleHandlers } = useRipple({
			centering: true,
			disableRipple,
		});

		const variantContext = useCheckboxVariantContext();
		const groupContext = useFormGroupContext();
		const formLabelContext = useFormControlLabelContext();

		const isChecked = checked || (value ? groupContext?.value.includes(value) : undefined);
		const isDisabled =
			disabled ||
			formLabelContext?.disabled ||
			variantContext?.disabled ||
			groupContext?.disabled ||
			false;

		const mergedProps = mergeProps(rippleHandlers, otherProps);

		const inputProps: React.ComponentPropsWithRef<'input'> = {
			ref: inputRef,
			type: 'checkbox',
			onChange: onChange ?? groupContext?.onChange ?? undefined,
			disabled: isDisabled,
			required: required || variantContext?.required || formLabelContext?.required,
			checked: isChecked,
			value,
			'aria-labelledby': formLabelContext?.labelId,
		};

		return (
			<span
				ref={forwardedRef}
				className={classNames(
					styles['checkbox'],
					[
						className,
						parseOffset(styles, offset ?? variantContext?.offset),
						styles[`color-${color || variantContext?.color || 'primary'}`],
						styles[`variant-${variant || variantContext?.variant || 'filled'}`],
						styles[`size-${size || variantContext?.size || 'm'}`],
					],
					{
						[styles['disabled']]: isDisabled,
						[styles['with-unchecked-icon']]: Boolean(uncheckedIcon),
					}
				)}
				style={style}
				{...containerProps}
			>
				{groupContext ? (
					<CompositeItem render={<input {...inputProps} {...mergedProps} />} />
				) : (
					<input {...inputProps} {...mergedProps} />
				)}
				<span className={styles['body']}>
					{uncheckedIcon ? (
						<span className={styles['unchecked-icon']}>{uncheckedIcon}</span>
					) : (
						<span className={styles['blank']} />
					)}
					{checkedIcon ? (
						<span className={styles['checked-icon']}>{checkedIcon}</span>
					) : (
						<span className={styles['checked-icon']}>
							<CheckMarkIcon variant="clear" />
						</span>
					)}
				</span>
				{!disableRipple && (
					<Ripple
						ref={containerRef}
						ripples={ripples}
						removeRipple={removeRipple}
						size="small"
					/>
				)}
			</span>
		);
	}
);

export namespace Checkbox {
	export interface Props
		extends Omit<React.ComponentPropsWithoutRef<'input'>, 'color' | 'size' | 'value'>,
			CheckboxVariantContext {
		className?: string;
		style?: React.CSSProperties;
		value?: string;
		inputRef?: React.RefObject<HTMLInputElement | null>;
		containerProps?: React.ComponentPropsWithoutRef<'span'>;
		uncheckedIcon?: React.ReactElement;
		checkedIcon?: React.ReactElement;
		disableRipple?: boolean;
	}
}
