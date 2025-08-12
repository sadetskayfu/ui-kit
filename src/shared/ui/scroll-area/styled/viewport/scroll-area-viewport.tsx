import { classNames } from '@/shared/helpers/class-names';
import { BaseScrollArea } from '../../base';
import styles from './scroll-area-viewport.module.scss';

export const ScrollAreaViewport = (props: ScrollAreaViewport.Props) => {
	const { className, children, border, ...otherProps } = props;

	return (
		<BaseScrollArea.Viewport
			className={classNames(styles['viewport'], [className], {[styles['border']]: border})}
            {...otherProps}
		>
			{children}
		</BaseScrollArea.Viewport>
	);
};

export namespace ScrollAreaViewport {
	export interface Props extends Omit<BaseScrollArea.Viewport.Props, 'className' | 'render'> {
		className?: string;
		/**
		 * @default 0, если есть полоса прокрутки, либо вертикальная, либо горизонтальная,
		 */
		tabIndex?: number;
        /**
         * @default false
         */
        border?: boolean
	}
}
