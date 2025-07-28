import * as React from 'react';
import { BaseToggle } from '../base';
import { Ripple, useRipple } from '@/shared/lib/ripple';
import { mergeProps } from '@/shared/helpers/merge-props';
import { classNames } from '@/shared/helpers/class-names';
import { useBorderContext } from '@/shared/ui/border-provider/border-context';
import {
	ToggleVariantContext,
	useToggleVariantContext,
} from './variant-provider/toggle-variant-context';
import styles from './toggle.module.scss';

export const Toggle = React.memo(
	React.forwardRef((props: Toggle.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const {
			children,
			className,
			value,
			onChange,
			iconButton,
			disableRipple,
			color,
			size,
			...otherProps
		} = props;

		const { containerRef, ripples, removeRipple, ...rippleHandlers } = useRipple({
			disableRipple,
		});

		const mergedProps = mergeProps(rippleHandlers, otherProps);

		const borderContext = useBorderContext();
		const variantContext = useToggleVariantContext();
        

		const getClassName = React.useCallback(
			(state: BaseToggle.State) => {
				return classNames(
					styles['toggle'],
					[
						className,
                        borderContext?.borderClassName,
						styles[`size-${size || variantContext?.size || 'm'}`],
						styles[`color-${color || variantContext?.color || 'primary'}`],
					],
					{
						[styles['pressed']]: state.pressed,
						[styles['disabled']]: state.disabled,
                        [styles['icon-button']]: iconButton
					}
				);
			},
			[
				className,
				borderContext?.borderClassName,
				color,
				size,
				variantContext?.size,
				variantContext?.color,
                iconButton
			]
		);

		return (
			<BaseToggle
				ref={forwardedRef}
				className={getClassName}
				value={value}
				onChange={onChange}
				{...mergedProps}
			>
				{children}
				<Ripple ref={containerRef} ripples={ripples} removeRipple={removeRipple} />
			</BaseToggle>
		);
	})
);

export namespace Toggle {
	export interface Props
		extends Omit<BaseToggle.Props, 'className' | 'render'>,
			ToggleVariantContext {
		className?: string;
		iconButton?: boolean;
		disableRipple?: boolean;
	}
}
