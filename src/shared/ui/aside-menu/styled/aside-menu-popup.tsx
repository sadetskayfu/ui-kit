import { classNames } from '@/shared/helpers/class-names';
import { BaseAsideMenu, useBaseAsideMenuRootContext } from '../base';
import { Backdrop } from '@/shared/ui/backdrop';
import styles from './aside-menu-popup.module.scss';

export const AsideMenuPopup = (props: AsideMenuPopup.Props) => {
	const {
		className,
		children,
		root,
		visibleBackdrop = true,
		position = 'left',
		...otherProps
	} = props;

	const { modal } = useBaseAsideMenuRootContext();

	return (
		<BaseAsideMenu.Portal root={root}>
			{modal && (
				<BaseAsideMenu.Backdrop
					render={(props, state) => (
						<Backdrop
							open={state.status === 'open'}
							visible={visibleBackdrop}
							{...props}
						/>
					)}
				/>
			)}
			<BaseAsideMenu.Popup
				className={state =>
					classNames(styles['popup'], [className, styles[`position-${position}`]], {
						[styles['open']]: state.status === 'open',
						[styles['close']]: state.status === 'close'
					})
				}
				{...otherProps}
			>
				{children}
			</BaseAsideMenu.Popup>
		</BaseAsideMenu.Portal>
	);
};

export namespace AsideMenuPopup {
	export interface Props extends React.ComponentPropsWithoutRef<'div'> {
		root?: BaseAsideMenu.Portal.Props['root'];
		/**
		 * @default 'true'
		 * @description 'Иммеет ли backdrop визуальные стили, такие как blur и backgroundColor'
		 */
		visibleBackdrop?: boolean;
		/**
		 * @default 'left'
		 */
		position?: 'left' | 'top' | 'right' | 'bottom';
	}
}
