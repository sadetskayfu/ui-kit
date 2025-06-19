import { classNames } from '@/shared/helpers/class-names';
import { forwardRef, memo } from 'react';
import styles from './tooltip-arrow.module.scss';

export type TooltipArrowSide = 'top' | 'bottom' | 'left' | 'right';

interface TooltipArrowProps {
	side: TooltipArrowSide;
	style?: React.CSSProperties;
}

export const TooltipArrow = memo(
	forwardRef((props: TooltipArrowProps, ref: React.ForwardedRef<HTMLSpanElement>) => {
		const { side, style } = props;

		return (
			<span
				ref={ref}
				style={style}
				className={classNames(styles['arrow'], [styles[side]])}
			></span>
		);
	})
);
