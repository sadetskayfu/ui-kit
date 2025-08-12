import { BaseSelect } from '../../base';
import { Backdrop } from '@/shared/ui/backdrop';
import { classNames } from '@/shared/helpers/class-names';
import { useBorderContext } from '@/shared/ui/border-provider';
import styles from './select-popup.module.scss';

export const SelectPopup = (props: SelectPopup.Props) => {
	const { children, backdrop, visibleBackdrop = false, portalTarget } = props;

	const borderContext = useBorderContext()

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
					classNames(styles['popup'], [borderContext?.borderClassName], {
						[styles['open']]: state.status === 'open',
						[styles['close']]: state.status === 'close',
					})
				}
			>
				{children}
			</BaseSelect.Popup>
		</BaseSelect.Portal>
	);
};

export namespace SelectPopup {
	export interface Props {
		children?: React.ReactNode;
		/**
		 * @default false
		 */
		backdrop?: boolean;
		/**
		 * Применить визуальные стили (backgroundColor, blur)
		 *
		 * @default false
		 */
		visibleBackdrop?: boolean;
		portalTarget?: BaseSelect.Portal.Props['root'];
	}
}
