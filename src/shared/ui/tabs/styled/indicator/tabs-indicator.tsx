import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseTabs } from '../../base';
import styles from './tabs-indicator.module.scss';

export const TabsIndicator = React.memo((props: TabsIndicator.Props) => {
	const { className, position = 'bottom' } = props;

	const getClassName = React.useCallback(
		(state: BaseTabs.Indicator.State) => {
			return classNames(styles['indicator'], [
				className,
				styles[`orientation-${state.orientation}`],
				styles[`position-${position}`],
			]);
		},
		[className, position]
	);

	return <BaseTabs.Indicator className={getClassName} />;
});

export namespace TabsIndicator {
	export interface Props extends Omit<BaseTabs.Indicator.Props, 'className'> {
		className?: string;
		/**
		 * @default bottom
		 */
		position?: 'left' | 'top' | 'right' | 'bottom';
	}
}
