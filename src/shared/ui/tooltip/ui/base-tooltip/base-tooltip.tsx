import { type HTMLAttributes, type ReactElement } from 'react';
import type { UseTooltipProps } from '../../model/use-tooltip';
import { Tooltip } from '../tooltip';
import { TooltipTrigger } from '../tooltip-trigger';
import { TooltipContent, type TooltipContentProps } from '../tooltip-content';
import { classNames } from '@/shared/helpers/class-names';
import styles from './base-tooltip.module.scss';

interface BaseTooltipProps extends TooltipContentProps, UseTooltipProps {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
	label: string | number;
}

export const BaseTooltip = (props: BaseTooltipProps) => {
	const { children, label, className, contentClassName, maxWidth, centeringText, zIndex, style, ...otherProps } =
		props;

	return (
		<Tooltip {...otherProps}>
			<TooltipTrigger>{children}</TooltipTrigger>
			<TooltipContent
				className={className}
				contentClassName={classNames(styles['content'], [contentClassName])}
				centeringText={centeringText}
				maxWidth={maxWidth}
				zIndex={zIndex}
				style={style}
			>
				{label}
			</TooltipContent>
		</Tooltip>
	);
};
