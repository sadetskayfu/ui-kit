import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseScrollArea } from '../../base';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import { useDirection } from '@/app/providers/direction-provider';
import styles from './scroll-area-scrollbar.module.scss';

export const ScrollAreaScrollbar = React.memo((props: ScrollAreaScrollbar.Props) => {
	const { alwaysVisible, orientation = 'vertical' } = props;

	const { orientation: rootOrientation } = useScrollAreaRootContext();
	const direction = useDirection();

	return (
		<BaseScrollArea.Scrollbar
			className={state =>
				classNames(
					styles['scrollbar'],
					[
						styles[`orientation-${state.orientation}`],
						styles[`root-orientation-${rootOrientation}`],
                        styles[`direction-${direction}`]
					],
					{
						[styles['hovering']]: state.hovering,
						[styles['scrolling']]: state.scrolling,
						[styles['always-visible']]: alwaysVisible,
					}
				)
			}
			orientation={orientation}
		>
			<BaseScrollArea.Thumb className={styles['thumb']} />
		</BaseScrollArea.Scrollbar>
	);
});

export namespace ScrollAreaScrollbar {
	export interface Props {
		/**
		 * @default false
		 */
		alwaysVisible?: boolean;
		/**
		 * @default 'vertical'
		 */
		orientation?: 'horizontal' | 'vertical';
	}
}
