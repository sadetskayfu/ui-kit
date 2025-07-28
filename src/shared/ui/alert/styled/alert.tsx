import * as React from 'react';
import { BaseAlert } from '../base';
import { classNames } from '@/shared/helpers/class-names';
import styles from './alert.module.scss';

export const Alert = React.memo(
	React.forwardRef((props: Alert.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { className, title, description, icon, actions, severity = 'info', variant = 'filled', ...otherProps } = props;

		return (
			<BaseAlert.Root
				ref={forwardedRef}
				className={classNames(styles['alert'], [className, styles[`severity-${severity}`], styles[`variant-${variant}`]])}
				{...otherProps}
			>
				{icon && <span className={styles['icon']}>{icon}</span>}
				<div className={styles['body']}>
					<BaseAlert.Title>{title}</BaseAlert.Title>
					{description && (
						<BaseAlert.Description className={styles['description']}>
							{description}
						</BaseAlert.Description>
					)}
				</div>
				{actions && <div className={styles['actions']}>{actions}</div>}
			</BaseAlert.Root>
		);
	})
);

export namespace Alert {
	export interface Props extends Omit<BaseAlert.Root.Props, 'className' | 'render'> {
		className?: string
		title: string;
		description?: string | React.ReactElement;
		icon?: React.ReactElement;
		actions?: React.ReactNode;
		/**
		 * @default 'info'
		 */
		severity?: 'info' | 'warning' | 'error' | 'success';
		variant?: 'filled' | 'outlined'
	}
}
