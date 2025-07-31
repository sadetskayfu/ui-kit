import { classNames } from '@/shared/helpers/class-names';
import { BaseDialog, useDialogRootContext } from '../../base';
import styles from './default-dialog-popup.module.scss';
import { Backdrop } from '@/shared/ui/backdrop';

export const DefaultDialogPopup = (props: DefaultDialogPopup.Props) => {
	const {
		className,
		contentClassName,
		children,
		root,
		contentStyle,
		visibleBackdrop = true,
		...otherProps
	} = props;

	const { modal } = useDialogRootContext();

	return (
		<BaseDialog.Portal root={root}>
			{modal && (
				<BaseDialog.Backdrop render={(props, state) => <Backdrop open={state.status === 'open'} visible={visibleBackdrop} {...props} /> }/>
			)}
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
					className={classNames(styles['content'], [contentClassName])}
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
		/**
		 * @default 'true'
		 * @description 'Иммеет ли backdrop визуальные стили, такие как blur и backgroundColor'
		 */
		visibleBackdrop?: boolean;
	}
}
