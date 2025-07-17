import { classNames, type AdditionalClasses, type Mods } from '@/shared/helpers/class-names';
import { FloatingOverlay } from '@floating-ui/react';
import { type ReactNode } from 'react';
import styles from './overlay.module.scss';

type OverlayVariant = 'dark' | 'transparent';

interface OverlayProps {
	children?: ReactNode;
	open?: boolean;
	close?: boolean;
	variant?: OverlayVariant;
}

export const Overlay = (props: OverlayProps) => {
	const { children, open, close, variant = 'dark' } = props;

	const additionalClasses: AdditionalClasses = [styles[`variant-${variant}`]];

	const mods: Mods = {
		[styles['open']]: open,
		[styles['close']]: close,
	};

	return (
		<FloatingOverlay
			className={classNames(styles['overlay'], additionalClasses, mods)}
		>
			{children}
		</FloatingOverlay>
	);
};
