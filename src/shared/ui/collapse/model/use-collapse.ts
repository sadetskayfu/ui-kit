import { applyStyles } from '@/shared/helpers/apply-styles';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

export interface UseCollapseProps {
	initialOpen?: boolean;
	open?: boolean;
	setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	lazy?: boolean;
	fade?: boolean;
	duration?: number;
	labelId?: string; // If we don't using CollapseTrigger, we can provider labelId for aria-labelledby
	bodyId?: string; // If we dont't using CollapseTrigger, we can provider bodyId for body
	referenceRef?: React.RefObject<HTMLElement | null> // If we don't using CollapseTrigger and we want return focus on reference after close with CollapseClose
}

export function useCollapse(props: UseCollapseProps) {
	const {
		initialOpen: isInitialOpen = false,
		open: controlledOpen,
		setOpen: setControlledOpen,
		lazy: isLazy,
		fade: isFade,
		duration = 300,
		labelId: externalLabelId,
		bodyId: externalBodyId,
		referenceRef: externalReferenceRef
	} = props;

	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(isInitialOpen);
	const [isMounted, setIsMounted] = useState<boolean>(isInitialOpen);

	const isOpen = controlledOpen ?? uncontrolledOpen;
	const setIsOpen = setControlledOpen ?? setUncontrolledOpen;

	const id = useId();
	const labelId = externalLabelId ?? `${id}-label`;
	const bodyId = externalBodyId ?? `${id}-body`;

	const elementRef = useRef<HTMLDivElement>(null);
	const referenceRef = useRef<HTMLElement>(null)
	const hasFirstRenderRef = useRef<boolean>(false);

	const setTransition = useCallback(() => {
		const element = elementRef.current;

		if (element) {
			applyStyles(element, {
				transition: isFade
					? `height ${duration}ms, opacity ${duration}ms`
					: `height ${duration}ms`,
			});
		}
	}, [duration, isFade]);

	const handleTransitionEnd = useCallback(
		(event: TransitionEvent) => {
			const element = elementRef.current;

			if (element && event.propertyName === 'height') {
				if (isOpen) {
					element.style.height = 'auto';
				} else {
					if (isLazy) {
						setIsMounted(false);
					} else {
						element.style.visibility = 'hidden';
					}
				}
			}
		},
		[isLazy, isOpen]
	);

	useEffect(() => {
		const element = elementRef.current;
		const hasFirstRender = hasFirstRenderRef.current;

		if (element) {
			element.addEventListener('transitionend', handleTransitionEnd);
		}

		if (isOpen) {
			if (isLazy && !isMounted) {
				setIsMounted(true);
			}

			if (element) {
				if (hasFirstRender) {
					const contentHeight = element.scrollHeight + 'px';

					setTransition();

					applyStyles(element, {
						visibility: 'visible',
						height: contentHeight,
						opacity: isFade ? '1' : undefined,
					});
				} else {
					applyStyles(element, {
						visibility: 'visible',
						height: 'auto',
						opacity: isFade ? '1' : undefined,
					});
					hasFirstRenderRef.current = true;
				}
			} else {
				hasFirstRenderRef.current = true;
			}
		} else {
			if (element) {
				if (hasFirstRender) {
					const contentHeight = element.scrollHeight + 'px';

					element.style.height = contentHeight;

					setTransition();

					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							applyStyles(element, {
								height: '0px',
								opacity: isFade ? '0' : undefined,
							});
						});
					});
				} else {
					applyStyles(element, {
						height: '0px',
						visibility: 'hidden',
						opacity: isFade ? '0' : undefined,
					});

					hasFirstRenderRef.current = true;
				}
			} else {
				hasFirstRenderRef.current = true;
			}
		}

		return () => {
			if (element) {
				element.removeEventListener('transitionend', handleTransitionEnd);
			}
		};
	}, [isOpen, isLazy, isFade, isMounted, handleTransitionEnd, setTransition]);

	return useMemo(
		() => ({
			isMounted,
			isOpen,
			setIsOpen,
			elementRef,
			referenceRef,
			externalReferenceRef,
			isLazy,
			isFade,
			labelId,
			bodyId,
		}),
		[isMounted, isOpen, setIsOpen, isLazy, isFade, elementRef, referenceRef, externalReferenceRef, labelId, bodyId]
	);
}
