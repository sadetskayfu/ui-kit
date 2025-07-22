import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseTabs } from '../../base';
import styles from './tabs-tab.module.scss';

export const TabsTab = React.memo(React.forwardRef((props: TabsTab.Props, forwardedRef: React.ForwardedRef<HTMLButtonElement>) => {
	const {
		className,
		label,
		icon,
		size = 'm',
		iconPosition = 'right',
		variant = 'filled',
		...otherProps
	} = props;

	const getClassName = React.useCallback(
		(state: BaseTabs.Tab.State) => {
			return classNames(
				styles['tab'],
				[
					className,
					styles[`size-${size}`],
					styles[`variant-${variant}`],
					styles[`icon-position-${iconPosition}`],
				],
				{
					[styles['selected']]: state.selected,
					[styles['disabled']]: state.disabled,
				}
			);
		},
		[className, size, iconPosition, variant ]
	);

	return (
		<BaseTabs.Tab ref={forwardedRef} className={getClassName} {...otherProps}>
			{icon && icon}
			{label != null && label}
		</BaseTabs.Tab>
	);
}));

export namespace TabsTab {
	export interface Props extends Omit<BaseTabs.Tab.Props, 'className' | 'render'> {
		className?: string;
		label?: string | number | React.ReactElement;
		icon?: React.ReactElement;
		/**
		 * @default m
		 */
		size?: 's' | 'm';
		/**
		 * @default right
		 */
		iconPosition?: 'left' | 'top' | 'right' | 'bottom';
		/**
		 * @default filled
		 */
		variant?: 'filled' | 'clear';
	}
}
