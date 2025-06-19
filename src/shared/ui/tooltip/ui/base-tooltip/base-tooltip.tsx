import { type HTMLAttributes, type ReactElement } from 'react';
import type { UseTooltipProps } from '../../model/use-tooltip';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip-trigger';
import { TooltipContent } from '../tooltip-content';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import styles from './base-tooltip.module.scss'

interface BaseTooltipProps extends UseTooltipProps {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
	maxWidth?: number;
	label: string | number;
	contentClassName?: string;
	centeringText?: boolean;
}

export const BaseTooltip = (props: BaseTooltipProps) => {
	const { children, label, contentClassName, maxWidth, centeringText: isCenteringText, ...otherProps } = props;

    const mods: Mods = {
        [styles['centering-text']]: isCenteringText
    }

	return (
		<Tooltip {...otherProps}>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent maxWidth={maxWidth} contentClassName={classNames(styles['content'], [contentClassName], mods)}>{label}</TooltipContent>
		</Tooltip>
	);
};
