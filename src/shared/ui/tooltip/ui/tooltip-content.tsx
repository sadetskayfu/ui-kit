import { useEffect, type ReactNode } from 'react';
import { useTooltipContext } from '../model/use-tooltip-context';
import { FloatingPortal, useDelayGroup, useTransitionStatus } from '@floating-ui/react';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import { TooltipArrow, type TooltipArrowSide } from '@/shared/ui/popup-arrow';
import styles from './tooltip.module.scss';

export interface TooltipContentProps {
	className?: string;
	contentClassName?: string;
	children: ReactNode;
	maxWidth?: number;
	style?: React.CSSProperties;
	centeringText?: boolean
}

export const TooltipContent = (props: TooltipContentProps) => {
	const { className, contentClassName, children, maxWidth, style, centeringText: isCenteringText } = props;

	const {
		tooltipId,
		context,
		refs,
		floatingStyles,
		arrowRef,
		portalTarget,
		isInteractive,
        referenceRef,
		getFloatingProps,
	} = useTooltipContext();

	const { currentId, isInstantPhase } = useDelayGroup(context, {
		id: context.floatingId,
	});

	const instantDuration = 100;
	const duration = 200;

	const { isMounted, status } = useTransitionStatus(context, {
		duration: isInstantPhase
			? {
					open: instantDuration,
					close: currentId === context.floatingId ? duration : instantDuration,
				}
			: duration,
	});

	const arrowX = context.middlewareData.arrow?.x;
	const arrowY = context.middlewareData.arrow?.y;
	const side = context.placement.split('-')[0] as TooltipArrowSide;

	const mods: Mods = {
		[styles['open']]: status === 'open',
		[styles['close']]: status === 'close',
		[styles['instant-phase']]: isInstantPhase,
		[styles['centering-text']]: isCenteringText
	};

    useEffect(() => {
        if(referenceRef) {
            refs.setReference(referenceRef.current)
        }
    }, [referenceRef, refs])

	if (!isMounted) return null;

	return (
		<FloatingPortal root={portalTarget}>
			<div
				className={classNames(styles['tooltip'], [className])}
				role="presentation"
				ref={refs.setFloating}
				style={{
					...floatingStyles,
					pointerEvents: isInteractive ? 'all' : 'none',
					maxWidth,
				}}
			>
				<div
					className={classNames(styles['content'], [contentClassName], mods)}
					id={tooltipId}
					role="tooltip"
					style={style}
					{...getFloatingProps()}
				>
					{children}
					<TooltipArrow
						ref={arrowRef}
						side={side}
						style={{
							left: arrowX != null ? `${arrowX}px` : '',
							top: arrowY != null ? `${arrowY}px` : '',
						}}
					/>
				</div>
			</div>
		</FloatingPortal>
	);
};
