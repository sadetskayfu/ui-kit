import { classNames } from '@/shared/helpers/class-names';
import { BaseDialog } from '../../base';
import styles from './default-dialog-popup.module.scss';

export const DefaultDialogPopup = (props: DefaultDialogPopup.Props) => {
	const { className, contentClassName, children, root, contentStyle, ...otherProps } = props;

	return (
		<BaseDialog.Portal root={root}>
			<BaseDialog.Backdrop
				className={state =>
					classNames(styles['backdrop'], [], {
						[styles['open']]: state.status === 'open',
					})
				}
			/>
			<BaseDialog.Popup
				className={state =>
					classNames(styles['popup'], [className], {
						[styles['open']]: state.status === 'open',
						[styles['close']]: state.status === 'close',
					})
				}
				{...otherProps}
			>
				<div
					className={classNames(styles['content'], [
						contentClassName
					])}
					style={contentStyle}
				>
					{children}
				</div>
			</BaseDialog.Popup>
		</BaseDialog.Portal>
	);
};

export namespace DefaultDialogPopup {
	export interface Props extends React.ComponentPropsWithoutRef<'div'> {
		contentClassName?: string;
		root?: BaseDialog.Portal.Props['root'];
		contentStyle?: React.CSSProperties;
	}
}
