import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { Ripple, useRipple } from '@/shared/lib/ripple';
import { mergeProps } from '@/shared/helpers/merge-props';
import { parseOffset } from '@/shared/helpers/parse-offset';
import { useFormControlLabelContext } from '@/shared/ui/form-control-label';
import {
	RadioVariantContext,
	useRadioVariantContext,
} from './variant-provider/radio-variant-context';
import { useRadioGroupContext } from '../radio-group';
import styles from './radio.module.scss';

/**
 * Renders a `<span>` element with hidden inout
 */
export const Radio = React.memo(React.forwardRef(
	(props: Radio.Props, forwardedRef: React.ForwardedRef<HTMLSpanElement>) => {
		const {
			className,
			style,
			inputRef,
			containerProps,
			variant,
			size,
			offset,
			disabled,
			checked,
			disableRipple,
			name,
			value,
			onChange,
			...otherProps
		} = props;

		const variantContext = useRadioVariantContext();
		const groupContext = useRadioGroupContext();
		const formLabelContext = useFormControlLabelContext();

		const isChecked = checked || (value ? groupContext?.value === value : undefined);
		const isDisabled =
			disabled ||
			formLabelContext?.disabled ||
			variantContext?.disabled ||
			groupContext?.disabled ||
			false;

		const { containerRef, ripples, removeRipple, ...rippleHandlers } = useRipple({
			centering: true,
			disableRipple: disableRipple || isChecked,
		});

		const mergedProps = mergeProps(rippleHandlers, otherProps);

		const inputProps: React.ComponentPropsWithRef<'input'> = {
			ref: inputRef,
			type: 'radio',
			disabled: isDisabled,
			checked: isChecked,
			value,
			onChange: onChange ?? groupContext?.onChange ?? undefined,
			name: name ?? groupContext?.name,
			'aria-labelledby': formLabelContext?.labelId,
		};

		return (
			<span
				ref={forwardedRef}
				className={classNames(
					styles['radio'],
					[
						className,
						parseOffset(styles, offset ?? variantContext?.offset),
						styles[`variant-${variant || variantContext?.variant || 'filled'}`],
						styles[`size-${size || variantContext?.size || 'm'}`],
					],
					{
						[styles['disabled']]: isDisabled,
					}
				)}
				style={style}
				{...containerProps}
			>
				<input {...inputProps} {...mergedProps} />
				<span className={styles['body']}>
					<span className={styles['blank']}>
                        <span className={styles['indicator']} />
                    </span>
				</span>
				<Ripple
					ref={containerRef}
					ripples={ripples}
					removeRipple={removeRipple}
					size="small"
				/>
			</span>
		);
	}
));

export namespace Radio {
	export interface Props
		extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value'>,
			RadioVariantContext {
		className?: string;
		style?: React.CSSProperties;
		value?: string;
		inputRef?: React.RefObject<HTMLInputElement | null>;
		containerProps?: React.ComponentPropsWithoutRef<'span'>;
		disableRipple?: boolean;
	}
}
