import {
	cloneElement,
	forwardRef,
	memo,
	type AnchorHTMLAttributes,
	type ButtonHTMLAttributes,
	type HTMLAttributes,
	type ReactElement,
} from 'react';
import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import { Ripple, useRipple } from '@/shared/lib/ripple';
import { CircularProgress } from '@/shared/ui/circular-progress';
import type { ButtonContextType } from './model/button-context';
import { useButtonContext } from './model/use-button-context';
import styles from './button.module.scss';

type HTMLProps = HTMLAttributes<HTMLElement>;
type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof HTMLProps | 'disabled' | 'type'
>;
type HTMLLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof HTMLProps | 'href'>;

interface ButtonProps extends ButtonContextType, Omit<HTMLProps, 'color'> {
	type?: 'submit' | 'reset' | 'button';
	buttonProps?: HTMLButtonProps;
	linkProps?: HTMLLinkProps;
	to?: string;
	linkComponent?: ReactElement<HTMLProps>;
	loading?: boolean;
	fullWidth?: boolean
}

export const Button = memo(
	forwardRef(
		(props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>) => {
			const {
				className,
				children,
				type = 'button',
				buttonProps,
				linkProps,
				to,
				linkComponent,
				variant,
				color,
				size,
				borderPlacement,
				borderRadius,
				iconButton,
				disabled,
				loading: isLoading,
				fullWidth: isFullWidth,
				onKeyUp,
				onKeyDown,
				onMouseUp,
				onMouseDown,
				onMouseLeave,
				onBlur,
				...otherProps
			} = props;

			const { ripples, containerRef, removeRipple, ...handlers } = useRipple({
				onKeyDown,
				onKeyUp,
				onMouseDown,
				onMouseLeave,
				onMouseUp,
				onBlur,
			});

			const context = useButtonContext();

			const isDisabled = disabled || context?.disabled || false;
			const isIconButton = iconButton || context?.iconButton || false;

			const additionalClasses: AdditionalClasses = [
				className,
				styles[`variant-${variant || context?.variant || 'filled'}`],
				styles[`color-${color || context?.color || 'primary'}`],
				styles[`size-${size || context?.size || 'm'}`],
				styles[`border-placement-${borderPlacement || context?.borderPlacement || 'all'}`],
				styles[`border-radius-${borderRadius || context?.borderRadius || 'm'}`],
			];

			const mods: Mods = {
				[styles['disabled']]: isDisabled,
				[styles['loading']]: isLoading,
				[styles['icon-button']]: isIconButton,
				[styles['full-width']]: isFullWidth
			};

			if (linkComponent) {
				return cloneElement(linkComponent, {
					className: classNames(styles['button'], additionalClasses, mods),
					children,
					'aria-disabled': isDisabled ? 'true' : undefined,
					...otherProps,
					...linkProps,
					...handlers,
				});
			}

			if (to) {
				return (
					<a
						ref={ref as React.ForwardedRef<HTMLAnchorElement>}
						className={classNames(styles['button'], additionalClasses, mods)}
						href={to}
						aria-disabled={isDisabled ? 'true' : undefined}
						{...linkProps}
						{...otherProps}
						{...handlers}
					>
						{children}
					</a>
				);
			}

			return (
				<button
					ref={ref as React.ForwardedRef<HTMLButtonElement>}
					className={classNames(styles['button'], additionalClasses, mods)}
					type={type}
					disabled={isDisabled}
					{...buttonProps}
					{...otherProps}
					{...handlers}
				>
					{children}
					{isLoading && (
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
						size={isIconButton ? 'small' : 'default'}
						removeRipple={removeRipple}
					/>
				</button>
			);
		}
	)
);
