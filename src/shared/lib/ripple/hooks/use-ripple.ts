import * as React from 'react'
import type { Ripple } from '../model/ripple';
import { useEventCallback } from '@/shared/hooks';
import { getTarget } from '@floating-ui/react/utils';

type UseRippleProps = {
	elementRef?: React.RefObject<HTMLElement | null>
	disableRipple?: boolean
	disableSpaceKey?: boolean
	centering?: boolean
}

export function useRipple({ elementRef, disableRipple, disableSpaceKey, centering }: UseRippleProps) {
	const [ripples, setRipples] = React.useState<Ripple[]>([]);

	const containerRef = React.useRef<HTMLSpanElement>(null);
	const hasKeyClickRef = React.useRef<boolean>(false)

	const hasInteractiveElement = React.useCallback((event: Event) => {
		if(!elementRef?.current) {
			return false
		}

		const target = getTarget(event);

		const interactiveElement =
			target instanceof Element
				? target.closest(
						`button,a,input,textarea,[role="button"]`
					)
				: null

		if (interactiveElement && interactiveElement !== elementRef.current) {
			return true
		}

		return false
	}, [elementRef])

	const markLastRippleAsEnding = useEventCallback(() => {
		if(ripples.length > 0) {
			setRipples(prev =>
				prev.map((ripple, index) =>
					index === prev.length - 1 ? { ...ripple, ending: true } : ripple
				)
			);
		}
	})

	const removeRipple = React.useCallback((rippleId: number) => {
		setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
	}, []);

	const createRipple = React.useCallback((event: React.PointerEvent | React.KeyboardEvent) => {
		const container = containerRef.current;

		if (!container) return;

		const rect = container.getBoundingClientRect();
		let x: number;
		let y: number;

		if ('clientX' in event && !centering) {
			x = event.clientX - rect.left;
			y = event.clientY - rect.top;
		} else {
			x = rect.width / 2;
			y = rect.height / 2;
		}

		const newRipple: Ripple = {
			id: Date.now(),
			x,
			y,
		};

		setRipples(prev => [...prev, newRipple]);
	}, [centering]);

	const handlePointerUp = React.useCallback(() => {
		if(!disableRipple) {
			markLastRippleAsEnding();
		}
	}, [markLastRippleAsEnding, disableRipple]);

	const handlePointerLeave = React.useCallback(() => {
		if(!disableRipple) {
			markLastRippleAsEnding();
		}
	}, [markLastRippleAsEnding, disableRipple]);

	const handlePointerDown = React.useCallback(
		(event: React.PointerEvent) => {
			if(disableRipple || hasInteractiveElement(event.nativeEvent)) {
				return
			}

			createRipple(event);
		},
		[createRipple, hasInteractiveElement, disableRipple]
	);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent) => {
			if(disableRipple || disableSpaceKey || event.key !== ' ' || hasKeyClickRef.current) {
				return
			}

			hasKeyClickRef.current = true

			if(hasInteractiveElement(event.nativeEvent)) {
				return
			}

			createRipple(event);
		},
		[createRipple, hasInteractiveElement, disableRipple, disableSpaceKey]
	);

	const handleKeyUp = React.useCallback(
		(event: React.KeyboardEvent) => {
			if(disableRipple || disableSpaceKey) {
				return
			}

			if (event.key === ' ') {
				hasKeyClickRef.current = false
				markLastRippleAsEnding();
			}
		},
		[markLastRippleAsEnding, disableRipple, disableSpaceKey]
	);

    const handleBlur = React.useCallback((event: React.FocusEvent) => {
		if(disableRipple || event.target !== elementRef?.current) {
			return
		}
		markLastRippleAsEnding();	
    }, [markLastRippleAsEnding, disableRipple, elementRef])

	return {
		ripples,
		containerRef,
		removeRipple,
		onPointerDown: handlePointerDown,
		onPointerLeave: handlePointerLeave,
		onPointerUp: handlePointerUp,
		onKeyDown: handleKeyDown,
		onKeyUp: handleKeyUp,
		onBlur: handleBlur,
	};
}
