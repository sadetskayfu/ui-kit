import * as React from 'react'
import { classNames } from '@/shared/helpers/class-names';
import { BaseChip } from '../../base';
import { useBorderContext } from '@/shared/ui/border-provider';
import { Ripple, useRipple } from '@/shared/lib/ripple';
import { mergeProps } from '@/shared/helpers/merge-props';
import styles from '../chip.module.scss';

export const ChipRoot = React.forwardRef((props: ChipRoot.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
	const {
		className,
		children,
		size = 'm',
		color = 'secondary',
		variant = 'filled',
		disableRipple = false,
		disableRippleSpaceKey = false,
		interactive = true,
		...otherProps
	} = props;

	const { containerRef, ripples, removeRipple, ...rippleHandlers } = useRipple({ disableRipple, disableSpaceKey: disableRippleSpaceKey })

	const mergedProps = mergeProps({...rippleHandlers}, otherProps)

	return (
		<BaseChip.Root
			ref={forwardedRef}
			className={state =>
				classNames(
					styles['chip'],
					[
						className,
						styles[`size-${size}`],
						styles[`color-${color}`],
						styles[`variant-${variant}`],
					],
					{
						[styles['disabled']]: state.disabled,
						[styles['interactive']]: interactive
					}
				)
			}
			{...mergedProps}
		>
			{children}
			<Ripple ref={containerRef} ripples={ripples} removeRipple={removeRipple} />
		</BaseChip.Root>
	);
});

export namespace ChipRoot {
	export interface Props extends Omit<BaseChip.Root.Props, 'className'> {
		className?: string;
		/**
		 * @default 'm'
		 */
		size?: 's' | 'm';
		/**
		 * @default 'secondary'
		 */
		color?: 'primary' | 'secondary';
		/**
		 * @default 'filled'
		 */
		variant?: 'filled' | 'outlined';
		/**
		 * @default false
		 */
		disableRipple?: boolean
		/**
		 * Установите true, если ваш <Chip> ссылка
		 * 
		 * @default false
		 */
		disableRippleSpaceKey?: boolean
		/**
		 * Включает hover стили
		 * 
		 * @default true
		 */
		interactive?: boolean
	}
}
