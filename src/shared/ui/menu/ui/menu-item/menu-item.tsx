import { forwardRef, memo, type ReactElement } from 'react';
import { BaseMenuItem, type BaseMenuItemProps } from './base-menu-item';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import styles from './menu-item.module.scss';

type RenderIconProps = {
	className: string;
};

interface MenuItemProps extends Omit<BaseMenuItemProps, 'children' | 'label'> {
	contentClassName?: string;
    label?: string // Нужен для typeahead, если не передан берем title как label
	title: string;
	description?: string;
	renderStartIcon?: (props: RenderIconProps) => ReactElement;
	renderEndIcon?: (props: RenderIconProps) => ReactElement;
}

export const MenuItem = memo(
	forwardRef(
		(props: MenuItemProps, ref: React.ForwardedRef<HTMLButtonElement | HTMLAnchorElement>) => {
			const {
				contentClassName,
                label,
				title,
				description,
				renderStartIcon,
				renderEndIcon,
				...baseMenuItemProps
			} = props;

            const mods: Mods = {
                [styles['with-start-icon']]: Boolean(renderStartIcon),
                [styles['with-end-icon']]: Boolean(renderEndIcon)
            }

			return (
				<BaseMenuItem ref={ref} label={label ?? title} {...baseMenuItemProps}>
					<div className={classNames(styles['menu-item-content'], [contentClassName], mods)}>
						<div className={styles['main']}>
							{renderStartIcon &&
								renderStartIcon({ className: styles['start-icon'] })}
							{title}
							{renderEndIcon && renderEndIcon({ className: styles['end-icon'] })}
						</div>
						{description && (
							<span className={styles['description']}>{description}</span>
						)}
					</div>
				</BaseMenuItem>
			);
		}
	)
);
