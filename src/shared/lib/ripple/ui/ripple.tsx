import { classNames, type AdditionalClasses } from '@/shared/helpers/class-names';
import { forwardRef } from 'react';
import type { Ripple as RippleType } from '../model/ripple';
import styles from './ripple.module.scss';

interface RippleProps {
	ripples: RippleType[];
	size?: 'default' | 'small';
	removeRipple: (rippleId: number) => void;
}

export const Ripple = forwardRef(
	(
		{ ripples, size = 'default', removeRipple }: RippleProps,
		ref: React.ForwardedRef<HTMLSpanElement>
	) => {
		const additionalClasses: AdditionalClasses = [styles[`size-${size}`]];

		return (
			<span ref={ref} className={classNames(styles['ripple-wrapper'], additionalClasses)}>
				{ripples &&
					ripples.map(ripple => (
						<span
							className={classNames(styles['ripple'], [], {
								[styles['fade']]: ripple.ending,
							})}
							key={ripple.id}
							style={{
								top: ripple.y,
								left: ripple.x,
								animationDuration: `${size === 'default' ? 1000 : 600}ms`,
							}}
							onTransitionEnd={event => {
								if (ripple.ending && event.propertyName === 'opacity') {
									removeRipple(ripple.id);
								}
							}}
						/>
					))}
			</span>
		);
	}
);
