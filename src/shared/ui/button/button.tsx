import * as React from 'react';
import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import { Ripple, useRipple } from '@/shared/lib/ripple';
import { CircularProgress } from '@/shared/ui/circular-progress';
import { ModernComponentProps } from '@/shared/helpers/types';
import {
	ButtonVariantContext,
	useButtonVariantContext,
} from './variant-provider/button-variant-context';
import { useBorderContext } from '@/shared/ui/border-provider';
import { useRenderElement } from '@/shared/hooks';
import styles from './button.module.scss';

export const Button = React.memo(
	React.forwardRef((props: Button.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
		const {
			render,
			className,
			children,
			variant,
			color,
			size,
			iconButton,
			disabled,
			loading,
			fullWidth,
			disableRipple,
			disableRippleSpaceKey,
			...otherProps
		} = props;

		const { ripples, containerRef, removeRipple, ...rippleHandlers } = useRipple({
			disableRipple,
			disableSpaceKey: disableRippleSpaceKey,
		});

		const variantContext = useButtonVariantContext();
		const borderContext = useBorderContext();

		const isDisabled = disabled || variantContext?.disabled || false;
		const isIconButton = iconButton || variantContext?.iconButton || false;

		const additionalClasses: AdditionalClasses = [
			borderContext?.borderClassName,
			styles[`variant-${variant || variantContext?.variant || 'filled'}`],
			styles[`color-${color || variantContext?.color || 'primary'}`],
			styles[`size-${size || variantContext?.size || 'm'}`],
		];

		const mods: Mods = {
			[styles['disabled']]: isDisabled,
			[styles['loading']]: loading,
			[styles['icon-button']]: isIconButton,
			[styles['full-width']]: fullWidth,
		};

		const element = useRenderElement('button', {
			className,
			render,
			ref: forwardedRef,
			props: [
				{
					className: classNames(styles['button'], additionalClasses, mods),
					disabled: isDisabled,
					...rippleHandlers,
					children: (
						<>
							{children}
							{loading && (
								<CircularProgress
									className={styles['loader']}
									size="s"
									color="inherit"
									absCenter
								/>
							)}
							<Ripple
								ref={containerRef}
								ripples={ripples}
								removeRipple={removeRipple}
							/>
						</>
					),
				},
				otherProps,
			],
		});

		return element;
	})
);

export namespace Button {
	export interface State {}
	export interface Props extends ModernComponentProps<'button', State>, ButtonVariantContext {
		loading?: boolean;
		fullWidth?: boolean;
		disableRipple?: boolean;
		disableRippleSpaceKey?: boolean;
	}
}
