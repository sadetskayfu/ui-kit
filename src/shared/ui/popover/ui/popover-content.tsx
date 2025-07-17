import { RemoveScroll } from 'react-remove-scroll';
import { FloatingFocusManager, FloatingPortal, useTransitionStatus } from '@floating-ui/react';
import { usePopoverContext } from '../model/use-popover-context';
import { type ReactNode, useEffect, useRef } from 'react';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import { TooltipArrow, type TooltipArrowSide } from '@/shared/ui/tooltip-arrow';
import { Overlay } from '@/shared/ui/overlay';
import styles from './popover.module.scss';

interface PopoverContentProps {
	className?: string;
	contentClassName?: string;
	children: ReactNode;
	style?: React.CSSProperties;
	id?: string; // If we don't using PopoverTrigger, we can provider id for content body
}

export const PopoverContent = (props: PopoverContentProps) => {
	const { className, contentClassName, children, style, id } = props;

	const {
		context,
		refs,
		modal,
		labelId,
		descriptionId,
		floatingStyles,
		initialFocus,
		returnFocus,
		portalTargetRef,
		referenceRef,
		arrowRef,
		showArrow,
		removeScroll,
		getFloatingProps,
	} = usePopoverContext();

	const contentRef = useRef<HTMLDivElement>(null);

	const initialFocusValue = initialFocus != null ? initialFocus : contentRef;

	const { isMounted, status } = useTransitionStatus(context, {
		duration: 200,
	});

	const arrowX = context.middlewareData.arrow?.x;
	const arrowY = context.middlewareData.arrow?.y;
	const side = context.placement.split('-')[0] as TooltipArrowSide;

	// We return the focus without waiting for the animation to complete
	useEffect(() => {
		if (status === 'close') {
			if (typeof returnFocus === 'boolean') {
				if (returnFocus) {
					const referenceEl = refs.reference.current as HTMLElement | null;
					referenceEl?.focus();
				}
			} else {
				returnFocus.current?.focus();
			}
		}
	}, [status, returnFocus, refs.reference]);

	const mods: Mods = {
		[styles['open']]: status === 'open',
		[styles['close']]: status === 'close',
	};

	useEffect(() => {
		if (referenceRef) {
			refs.setReference(referenceRef.current);
		}
	}, [referenceRef, refs])

	if (!isMounted) return null;

	return (
		<FloatingPortal root={portalTargetRef}>
			{ modal && <Overlay variant="transparent" /> }
			<FloatingFocusManager
				initialFocus={initialFocusValue}
				returnFocus={false}
				context={context}
				modal={modal}
			>
				<div
					className={classNames(styles['popover'], [className])}
					ref={refs.setFloating}
					style={floatingStyles}
					role="presentation"
				>
					<RemoveScroll enabled={removeScroll}>
						<div
							className={classNames(styles['content'], [contentClassName], mods)}
							style={style}
							ref={contentRef}
							aria-labelledby={labelId}
							aria-describedby={descriptionId}
							aria-modal={modal ? 'true' : undefined}
							{...getFloatingProps()}
							{...(id != null && { id })}
						>
							{children}
							{showArrow && (
								<TooltipArrow
									ref={arrowRef}
									side={side}
									style={{
										left: arrowX != null ? `${arrowX}px` : '',
										top: arrowY != null ? `${arrowY}px` : '',
									}}
								/>
							)}
						</div>
					</RemoveScroll>
				</div>
			</FloatingFocusManager>
		</FloatingPortal>
	);
};
