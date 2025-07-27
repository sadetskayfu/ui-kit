import { classNames } from '@/shared/helpers/class-names';
import { BaseToast } from '../../base';
import styles from './toast-viewport.module.scss';

export const ToastViewport = (props: ToastViewport.Props) => {
	const { className, children, ...otherProps } = props;

	return (
		<BaseToast.Portal>
			<BaseToast.Viewport
				className={classNames(styles['viewport'], [className])}
				{...otherProps}
			>
				{children}
			</BaseToast.Viewport>
		</BaseToast.Portal>
	);
};

export namespace ToastViewport {
	export interface Props extends Omit<BaseToast.Viewport.Props, 'className' | 'render'> {
		className?: string;
	}
}
