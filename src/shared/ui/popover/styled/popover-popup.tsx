import { classNames } from '@/shared/helpers/class-names';
import { BasePopover, usePopoverRootContext } from '../base';
import { Backdrop } from '@/shared/ui/backdrop';
import styles from './popover-popup.module.scss';

export const PopoverPopup = (props: PopoverPopup.Props) => {
	const {
		className,
		contentClassName,
		children,
		root,
		contentStyle,
		visibleBackdrop = false,
		...otherProps
	} = props;

	const { modal } = usePopoverRootContext();

	return (
		<BasePopover.Portal root={root}>
			{modal && (
				<BasePopover.Backdrop render={(props, state) => <Backdrop open={state.status === 'open'} visible={visibleBackdrop} {...props} /> }/>
			)}
			<BasePopover.Popup
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
			</BasePopover.Popup>
		</BasePopover.Portal>
	);
};

export namespace PopoverPopup {
	export interface Props extends React.ComponentPropsWithoutRef<'div'> {
		contentClassName?: string;
		root?: BasePopover.Portal.Props['root'];
		contentStyle?: React.CSSProperties;
		/**
		 * @default false
		 * @description 'Иммеет ли backdrop визуальные стили, такие как blur и backgroundColor'
		 */
		visibleBackdrop?: boolean;
	}
}
