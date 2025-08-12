import { classNames } from '@/shared/helpers/class-names';
import { BaseScrollArea } from '../../base';
import { useScrollAreaRootContext } from '../root/scroll-area-root-context';
import { useDirection } from '@/app/providers/direction-provider';
import styles from './scroll-area-content.module.scss';

export const ScrollAreaContent = (props: ScrollAreaContent.Props) => {
	const { className, children, padding, ...otherProps } = props;

	const { orientation } = useScrollAreaRootContext();
	const direction = useDirection();

	return (
		<BaseScrollArea.Content
			className={state =>
				classNames(
					styles['content'],
					[
						className,
						styles[`orientation-${orientation}`],
						styles[`direction-${direction}`],
						styles[`padding-${padding}`],
					],
					{
						[styles['visible-scrollbar-x']]: !state.hiddenScrollbarX,
						[styles['visible-scrollbar-y']]: !state.hiddenScrollbarY,
					}
				)
			}
			{...otherProps}
		>
			{children}
		</BaseScrollArea.Content>
	);
};

export namespace ScrollAreaContent {
	export interface Props extends Omit<BaseScrollArea.Content.Props, 'className' | 'render'> {
		className?: string;
		/**
		 * @default undefined
		 */
		padding?: 'm' | 'l';
	}
}
