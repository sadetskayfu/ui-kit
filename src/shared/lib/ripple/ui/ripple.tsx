import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import type { Ripple as RippleType } from '../model/ripple';
import { forwardRef } from 'react';
import styles from './ripple.module.scss';

type RippleSize = 'default' | 'small';

interface RippleProps {
	ripples?: RippleType[];
	size?: RippleSize;
}

export const Ripple = forwardRef(
	(
		{ ripples, size = 'default' }: RippleProps,
		ref: React.ForwardedRef<HTMLSpanElement>
	) => {
		const additionalClasses: AdditionalClasses = [styles[`size-${size}`]];

		return (
			<span ref={ref} className={classNames(styles['ripple-wrapper'], additionalClasses)}>
				{ripples &&
					ripples.map(ripple => (
						<span
							className={styles['ripple']}
							key={ripple.id}
							style={{
								top: ripple.y,
								left: ripple.x,
								animationDuration: `${size === 'default' ? 1000 : 600}ms`,
							}}
						></span>
					))}
			</span>
		);
	}
);
