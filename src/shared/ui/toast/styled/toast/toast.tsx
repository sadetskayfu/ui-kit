import * as React from 'react';
import { BaseToast } from '../../base';
import { classNames } from '@/shared/helpers/class-names';
import styles from './toast.module.scss';

export const Toast = React.memo(
	React.forwardRef((props: Toast.Props, forwardedRef: React.ForwardedRef<HTMLDivElement>) => {
		const { children, className, toast, ...otherProps } = props;

		const getClassName = (state: BaseToast.Root.State) => {
			return classNames(
				styles['toast'],
				[
					className,
					state.swipeDirection && styles[`swipe-direction-${state.swipeDirection}`],
					state.transitionStatus && styles[`transition-status-${state.transitionStatus}`],
				],
				{ [styles['expanded']]: state.expanded, [styles['limited']]: state.limited }
			);
		};

		return (
			<BaseToast.Root
				ref={forwardedRef}
				className={getClassName}
				swipeDirection={['right', 'down']}
				toast={toast}
				{...otherProps}
			>
				{children}
			</BaseToast.Root>
		);
	})
);

export namespace Toast {
	export interface Props
		extends Omit<BaseToast.Root.Props, 'className' | 'swipeDirection'> {
		className?: string;
	}
}
