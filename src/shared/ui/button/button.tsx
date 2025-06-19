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
import { mergeEventHandlers } from '@/shared/helpers/merge-event-handlers/merge-event-handlers';
import { CircularProgress } from '@/shared/ui/circular-progress';
import styles from './button.module.scss';

type HTMLProps = HTMLAttributes<HTMLElement>;
type HTMLButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	keyof HTMLProps | 'disabled' | 'type'
>;
type HTMLLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof HTMLProps | 'href'>;

type ButtonVariant = 'filled' | 'outlined' | 'clear';
type ButtonSize = 's' | 'm' | 'l';
type ButtonColor = 'primary' | 'secondary' | 'red' | 'green';
type BorderPlacement = 'left' | 'right' | 'top' | 'bottom' | 'all';
type BorderRadius = 'm' | 'full' | 'circular' | 'none';

interface ButtonProps extends HTMLProps {
	type?: 'submit' | 'reset' | 'button';
	buttonProps?: HTMLButtonProps;
	linkProps?: HTMLLinkProps;
	to?: string;
	linkComponent?: ReactElement<HTMLProps>;
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	borderPlacement?: BorderPlacement;
	borderRadius?: BorderRadius;
	disabled?: boolean;
	loading?: boolean;
	iconButton?: boolean;
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
				variant = 'filled',
				color = 'primary',
				size = 'm',
				borderPlacement = 'all',
				borderRadius = 'm',
				disabled: isDisabled,
				loading: isLoading,
				iconButton: isIconButton,
				onKeyUp,
				onMouseUp,
				...otherProps
			} = props;

			const { ripples, containerRef, handleKeyUp, handleMouseUp } = useRipple();

			const additionalClasses: AdditionalClasses = [
				className,
				styles[`variant-${variant}`],
				styles[`color-${color}`],
				styles[`size-${size}`],
				styles[`border-placement-${borderPlacement}`],
				styles[`border-radius-${borderRadius}`],
			];

			const mods: Mods = {
				[styles['disabled']]: isDisabled,
				[styles['loading']]: isLoading,
				[styles['icon-button']]: isIconButton,
			};

			if (linkComponent) {
				return cloneElement(linkComponent, {
					className: classNames(styles['button'], additionalClasses, mods),
					children,
					onKeyUp,
					onMouseUp,
					'aria-disabled': isDisabled ? 'true' : undefined,
					...otherProps,
					...linkProps,
				});
			}

			if (to) {
				return (
					<a
						ref={ref as React.ForwardedRef<HTMLAnchorElement>}
						className={classNames(styles['button'], additionalClasses, mods)}
						href={to}
						aria-disabled={isDisabled ? 'true' : undefined}
						onKeyUp={onKeyUp}
						onMouseUp={onMouseUp}
						{...linkProps}
						{...otherProps}
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
					onMouseUp={mergeEventHandlers([onMouseUp, handleMouseUp])}
					onKeyUp={mergeEventHandlers([onKeyUp, handleKeyUp])}
					{...buttonProps}
					{...otherProps}
				>
					{children}
					{isLoading && (
						<CircularProgress
							className={styles['loader']}
							size='s'
							color='inherit'
							absCenter
						/>
					)}
					<Ripple
						size={isIconButton ? 'small' : 'default'}
						ref={containerRef}
						ripples={ripples}
					/>
				</button>
			);
		}
	)
);
