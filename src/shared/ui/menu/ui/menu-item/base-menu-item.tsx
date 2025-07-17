import { useFloatingTree, useListItem, useMergeRefs } from '@floating-ui/react';
import { useMenuContext } from '../../model/use-menu-context';
import {
	forwardRef,
	useContext,
	type AnchorHTMLAttributes,
	type HTMLAttributes,
	type HTMLProps,
	type ReactElement,
} from 'react';
import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import { MenuItemContext, type MenuItemContextType } from './menu-item-context';
import { Ripple, useRipple } from '@/shared/lib/ripple';
import styles from './base-menu-item.module.scss';

export interface BaseMenuItemProps extends MenuItemContextType, HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
	label: string; // for typeahead
	disabled?: boolean;
	disableCloseAfterClick?: boolean;
	disableRipple?: boolean;
	to?: string;
	renderLink?: (
		props: HTMLProps<HTMLAnchorElement> & { to?: string }
	) => ReactElement<AnchorHTMLAttributes<HTMLAnchorElement>>;
}

export const BaseMenuItem = forwardRef(
	(props: BaseMenuItemProps, ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>) => {
		const {
			children,
			className,
			label,
			disabled: isDisabled,
			disableCloseAfterClick,
			disableRipple,
			to,
			borderRadius,
			renderLink,
			onClick,
			onBlur,
			onKeyDown,
			onKeyUp,
			onMouseDown,
			onMouseLeave,
			onMouseUp,
			...otherProps
		} = props;

		const { containerRef, ripples, removeRipple, ...handlers } = useRipple({
			disableRipple,
			disableSpaceKey: Boolean(to || renderLink),
			onBlur,
			onKeyDown,
			onKeyUp,
			onMouseDown,
			onMouseLeave,
			onMouseUp,
		});

		const context = useContext(MenuItemContext);
		const { activeIndex, getItemProps } = useMenuContext();
		const item = useListItem({ label: isDisabled ? null : label });
		const tree = useFloatingTree();
		const mergeRef = useMergeRefs([ref, item.ref]);

		const isActive = item.index === activeIndex;

		const additionalClasses: AdditionalClasses = [
			className,
			styles[`border-radius-${borderRadius || context?.borderRadius || 'm'}`],
		];

		const mods: Mods = { [styles['disabled']]: isDisabled };

		const sharedProps: HTMLAttributes<HTMLElement> = {
			className: classNames(styles['menu-item'], additionalClasses, mods),
			role: 'menuitem',
			tabIndex: isActive ? 0 : -1,
			...getItemProps({
				...otherProps,
				...handlers,
				onClick: event => {
					onClick?.(event);

					if (!disableCloseAfterClick) {
						tree?.events.emit('click');
					}
				},
			}),
		};

		if (renderLink) {
			return renderLink({
				ref: mergeRef as React.ForwardedRef<HTMLAnchorElement>,
				to,
				'aria-disabled': isDisabled ? 'true' : undefined,
				children: (
					<>
						{children}
						{!disableRipple && (
							<Ripple
								ref={containerRef}
								ripples={ripples}
								removeRipple={removeRipple}
							/>
						)}
					</>
				),
				...sharedProps,
			});
		}

		if (to) {
			return (
				<a
					ref={mergeRef as React.ForwardedRef<HTMLAnchorElement>}
					href={to}
					aria-disabled={isDisabled ? 'true' : undefined}
					{...sharedProps}
				>
					{children}
					{!disableRipple && (
						<Ripple ref={containerRef} ripples={ripples} removeRipple={removeRipple} />
					)}
				</a>
			);
		}

		return (
			<button
				ref={mergeRef as React.ForwardedRef<HTMLButtonElement>}
				disabled={isDisabled}
				type="button"
				{...sharedProps}
			>
				{children}
				{!disableRipple && (
					<Ripple ref={containerRef} ripples={ripples} removeRipple={removeRipple} />
				)}
			</button>
		);
	}
);
