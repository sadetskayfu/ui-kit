import * as React from 'react';
import { classNames } from '@/shared/helpers/class-names';
import { BaseToast } from '../../base';
import { ToastViewportContext } from './toast-viewport-context';
import styles from './toast-viewport.module.scss';

export const ToastViewport = (props: ToastViewport.Props) => {
	const { className, children, position = 'bottom-right', ...otherProps } = props;

	const contextValue: ToastViewportContext = React.useMemo(() => ({ position }), [position]);

	return (
		<BaseToast.Portal>
			<BaseToast.Viewport
				className={classNames(styles['viewport'], [
					className,
					styles[`position-${position}`],
				])}
				{...otherProps}
			>
				<ToastViewportContext.Provider value={contextValue}>
					{children}
				</ToastViewportContext.Provider>
			</BaseToast.Viewport>
		</BaseToast.Portal>
	);
};

export namespace ToastViewport {
	export interface Props extends Omit<BaseToast.Viewport.Props, 'className' | 'render'> {
		className?: string;
		/**
		 * @default 'bottom-right'
		 */
		position?: 'bottom-right' | 'top-center';
	}
}
