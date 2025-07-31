import * as React from 'react';
import { FloatingOverlay } from '@floating-ui/react';
import { classNames } from '@/shared/helpers/class-names';
import styles from './backdrop.module.scss';

export const Backdrop = React.forwardRef(
	(props: Backdrop.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { className, children, open, visible = true, ...otherProps } = props;

		return (
			<FloatingOverlay
				ref={forwardedRef}
				className={classNames(styles['backdrop'], [className], {
					[styles['open']]: open,
					[styles['visible']]: visible,
				})}
				{...otherProps}
			>
				{children}
			</FloatingOverlay>
		);
	}
);

export namespace Backdrop {
	export interface Props {
		className?: string;
		children?: React.ReactNode;
		open?: boolean;
		/**
		 * Применять ли визуальные стили, такие как backgroudColor и blur
		 * @default true
		 */
		visible?: boolean;
	}
}
