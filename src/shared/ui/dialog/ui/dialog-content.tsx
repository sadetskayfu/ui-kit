import { RemoveScroll } from 'react-remove-scroll';
import { FloatingFocusManager, FloatingPortal, useTransitionStatus } from '@floating-ui/react';
import { useDialogContext } from '../model/use-dialog-context';
import { type ReactNode, useEffect, useRef } from 'react';
import { classNames, type Mods } from '@/shared/helpers/class-names';
import { Overlay } from '@/shared/ui/overlay';
import styles from './dialog.module.scss';

interface DialogContentProps {
	className?: string;
	contentClassName?: string;
	children: ReactNode;
	style?: React.CSSProperties;
	zIndex?: number;
	id?: string; // If we don't using DialogTrigger, we can provider id for content body
}

export const DialogContent = (props: DialogContentProps) => {
	const { className, contentClassName, children, style, id, zIndex = 1500 } = props;

	const {
		context,
		refs,
		labelId,
		descriptionId,
		floatingStyles,
		initialFocus,
		returnFocus,
		removeScroll,
        portalTargetRef,
		getFloatingProps,
	} = useDialogContext();

	const contentRef = useRef<HTMLDivElement>(null);

	const initialFocusValue = initialFocus != null ? initialFocus : contentRef;

	const { isMounted, status } = useTransitionStatus(context, {
		duration: 200,
	});

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

	if (!isMounted) return null;

	return (
		<FloatingPortal root={portalTargetRef}>
			<Overlay variant="dark" />
			<FloatingFocusManager
				initialFocus={initialFocusValue}
				returnFocus={false}
				context={context}
				modal
			>
				<div
					className={classNames(styles['dialog'], [className])}
					ref={refs.setFloating}
					style={{ ...floatingStyles, zIndex }}
					role="presentation"
				>
					<RemoveScroll enabled={removeScroll}>
						<div
							className={classNames(styles['content'], [contentClassName], mods)}
							style={style}
							ref={contentRef}
							aria-labelledby={labelId}
							aria-describedby={descriptionId}
							aria-modal={'true'}
							{...getFloatingProps()}
							{...(id != null && { id })}
						>
							{children}
						</div>
					</RemoveScroll>
				</div>
			</FloatingFocusManager>
		</FloatingPortal>
	);
};
