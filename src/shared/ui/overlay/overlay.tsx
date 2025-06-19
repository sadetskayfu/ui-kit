import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import { FloatingOverlay } from '@floating-ui/react';
import { type ReactNode } from 'react';
import styles from './overlay.module.scss';

type OverlayVariant = 'dark' | 'transparent';

interface OverlayProps {
	children?: ReactNode;
	open?: boolean;
	close?: boolean;
	zIndex?: number;
	variant?: OverlayVariant;
}

export const Overlay = (props: OverlayProps) => {
	const { children, open, close, variant = 'dark', zIndex = 1500 } = props;

	const additionalClasses: AdditionalClasses = [styles[`variant-${variant}`]];

	const mods: Mods = {
		[styles['open']]: open,
		[styles['close']]: close,
	};

	return (
		<FloatingOverlay
			className={classNames(styles['overlay'], additionalClasses, mods)}
			style={{ zIndex }}
		>
			{children}
		</FloatingOverlay>
	);
};
