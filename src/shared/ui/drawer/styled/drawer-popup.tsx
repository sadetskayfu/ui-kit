import { classNames } from '@/shared/helpers/class-names';
import { BaseDrawer, useDrawerRootContext } from '../base';
import { Backdrop } from '@/shared/ui/backdrop';
import styles from './drawer-popup.module.scss';

export const DrawerPopup = (props: DrawerPopup.Props) => {
	const { className, children, root, visibleBackdrop = true, ...otherProps } = props;

	const { modal } = useDrawerRootContext();

	return (
		<BaseDrawer.Portal root={root}>
			{modal && (
				<BaseDrawer.Backdrop
					render={(props, state) => (
						<Backdrop
							open={state.status === 'open'}
							visible={visibleBackdrop}
							{...props}
						/>
					)}
				/>
			)}
			<BaseDrawer.Popup
				className={state =>
					classNames(styles['popup'], [className, styles[`position-${state.position}`]], {
						[styles['open']]: state.status === 'open',
						[styles['close']]: state.status === 'close'
					})
				}
				{...otherProps}
			>
				{children}
			</BaseDrawer.Popup>
		</BaseDrawer.Portal>
	);
};

export namespace DrawerPopup {
	export interface Props extends React.ComponentPropsWithoutRef<'div'> {
		root?: BaseDrawer.Portal.Props['root'];
		/**
		 * @default 'true'
		 * @description 'Иммеет ли backdrop визуальные стили, такие как blur и backgroundColor'
		 */
		visibleBackdrop?: boolean;
	}
}
