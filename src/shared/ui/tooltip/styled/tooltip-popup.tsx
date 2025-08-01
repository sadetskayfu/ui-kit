import { classNames } from '@/shared/helpers/class-names';
import { BaseTooltip } from '../base';
import styles from './tooltip-popup.module.scss';

export const TooltipPopup = (props: TooltipPopup.Props) => {
	const {
		className,
		contentClassName,
		children,
		root,
		contentStyle,
        centeringText,
		...otherProps
	} = props;

	return (
		<BaseTooltip.Portal root={root}>
			<BaseTooltip.Popup
				className={state =>
					classNames(styles['popup'], [className], {
						[styles['open']]: state.status === 'open',
						[styles['close']]: state.status === 'close',
                        [styles['instant-phase']]: state.instantPhase
					})
				}
				{...otherProps}
			>
				<div
					className={classNames(styles['content'], [contentClassName], {[styles['centering-text']]: centeringText})}
					style={contentStyle}
				>
					{children}
				</div>
			</BaseTooltip.Popup>
		</BaseTooltip.Portal>
	);
};

export namespace TooltipPopup {
	export interface Props extends React.ComponentPropsWithoutRef<'div'> {
		contentClassName?: string;
		root?: BaseTooltip.Portal.Props['root'];
		contentStyle?: React.CSSProperties;
        centeringText?: boolean
	}
}
