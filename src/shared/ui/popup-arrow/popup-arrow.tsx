import * as React from 'react'
import { classNames } from '@/shared/helpers/class-names';
import styles from './popup-arrow.module.scss';

export const PopupArrow = React.memo(
	React.forwardRef((props: PopupArrow.Props, ref: React.ForwardedRef<HTMLSpanElement>) => {
		const { className, side, style } = props;

		return (
			<span ref={ref} style={style} className={classNames(styles['arrow'], [className, styles[`side-${side}`]])} />
		);
	})
);

export namespace PopupArrow {
	export type Side = 'top' | 'bottom' | 'left' | 'right';

	export interface Props {
		className?: string
		side: Side,
		style?: React.CSSProperties
	}
}
