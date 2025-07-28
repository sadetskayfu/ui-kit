import * as React from 'react';
import { BaseAlert } from '../base';
import { classNames } from '@/shared/helpers/class-names';
import { useBorderContext } from '@/shared/ui/border-provider';
import styles from './alert.module.scss';

export const Alert = React.memo(
	React.forwardRef((props: Alert.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const {
			className,
			actionsClassName,
			title,
			description,
			icon,
			actions,
			severity = 'info',
			variant = 'filled',
			...otherProps
		} = props;

		const borderContext = useBorderContext();

		return (
			<BaseAlert.Root
				ref={forwardedRef}
				className={classNames(styles['alert'], [
					className,
					borderContext?.borderClassName,
					styles[`severity-${severity}`],
					styles[`variant-${variant}`],
				])}
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
				{actions && (
					<div className={classNames(styles['actions'], [actionsClassName])}>
						{actions}
					</div>
				)}
			</BaseAlert.Root>
		);
	})
);

export namespace Alert {
	export interface Props extends Omit<BaseAlert.Root.Props, 'className' | 'render'> {
		className?: string;
		actionsClassName?: string;
		title: string;
		description?: string | React.ReactElement;
		icon?: React.ReactElement;
		actions?: React.ReactNode;
		/**
		 * @default 'info'
		 */
		severity?: 'info' | 'warning' | 'error' | 'success';
		/**
		 * @default 'filled'
		 */
		variant?: 'filled' | 'outlined';
	}
}
