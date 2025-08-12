import { BaseSelect } from '../../base';
import { Backdrop } from '@/shared/ui/backdrop';
import { classNames } from '@/shared/helpers/class-names';
import styles from './select-dialog-popup.module.scss';
import { ScrollArea } from '@/shared/ui/scroll-area';

export const SelectDialogPopup = (props: SelectDialogPopup.Props) => {
	const { children, backdrop = true, visibleBackdrop = true, portalTarget } = props;

	return (
		<BaseSelect.Portal root={portalTarget}>
			{backdrop && (
				<BaseSelect.Backdrop
					render={(props, state) => (
						<Backdrop
							open={state.status === 'open'}
							visible={visibleBackdrop}
							{...props}
						/>
					)}
				/>
			)}
			<BaseSelect.Popup
				className={state =>
					classNames(styles['popup'], [], {
						[styles['open']]: state.status === 'open',
						[styles['close']]: state.status === 'close',
					})
				}
			>
				<div role='presentation' className={styles['content']}>
				{children}
				</div>
			</BaseSelect.Popup>
		</BaseSelect.Portal>
	);
};

export namespace SelectDialogPopup {
	export interface Props {
		children?: React.ReactNode;
		/**
		 * @default true
		 */
		backdrop?: boolean;
		/**
		 * Применить визуальные стили (backgroundColor, blur)
		 *
		 * @default true
		 */
		visibleBackdrop?: boolean;
		portalTarget?: BaseSelect.Portal.Props['root'];
	}
}
