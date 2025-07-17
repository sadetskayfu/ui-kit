import { useCallback, useRef, useState } from 'react';
import type { Ripple } from '../model/ripple';

type UseRippleProps = {
	disableRipple?: boolean
	disableSpaceKey?: boolean
	onBlur?: React.FocusEventHandler
	onKeyDown?: React.KeyboardEventHandler
	onKeyUp?: React.KeyboardEventHandler
	onMouseDown?: React.MouseEventHandler
	onMouseUp?: React.MouseEventHandler
	onMouseLeave?: React.MouseEventHandler
}

export function useRipple({ disableRipple, disableSpaceKey, onBlur, onKeyDown, onKeyUp, onMouseDown, onMouseLeave, onMouseUp }: UseRippleProps) {
	const [ripples, setRipples] = useState<Ripple[]>([]);
	const containerRef = useRef<HTMLSpanElement>(null);

	const markLastRippleAsRemoved = useCallback(() => {
		if(ripples.length > 0) {
			setRipples(prev =>
				prev.map((ripple, index) =>
					index === prev.length - 1 ? { ...ripple, isRemove: true } : ripple
				)
			);
		}
	}, [ripples.length]);

	const removeRipple = useCallback((rippleId: number) => {
		setRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
	}, []);

	const createRipple = useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
		const container = containerRef.current;

		if (!container) return;

		const rect = container.getBoundingClientRect();
		let x: number;
		let y: number;

		if ('clientX' in event) {
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
	}, []);

	const handleMouseUp = useCallback((event: React.MouseEvent) => {
		onMouseUp?.(event)

		if(!disableRipple) {
			markLastRippleAsRemoved();
		}
	}, [markLastRippleAsRemoved, onMouseUp, disableRipple]);

	const handleMouseLeave = useCallback((event: React.MouseEvent) => {
		onMouseLeave?.(event)

		if(!disableRipple) {
			markLastRippleAsRemoved();
		}
	}, [markLastRippleAsRemoved, onMouseLeave, disableRipple]);

	const handleKeyUp = useCallback(
		(event: React.KeyboardEvent) => {
			onKeyUp?.(event)

			if (!disableRipple && !disableSpaceKey && event.key === ' ') {
				markLastRippleAsRemoved();
			}
			
		},
		[markLastRippleAsRemoved, onKeyUp, disableRipple, disableSpaceKey]
	);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			onMouseDown?.(event)

			if(!disableRipple) {
				createRipple(event);
			}
		},
		[createRipple, onMouseDown, disableRipple]
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			onKeyDown?.(event)

			if(!disableRipple && !disableSpaceKey && event.key === ' ') {
				if(ripples.length > 0 && !ripples[ripples.length - 1].isRemove) return

				createRipple(event);
			}
		},
		[createRipple, onKeyDown, ripples, disableRipple, disableSpaceKey]
	);

    const handleBlur = useCallback((event: React.FocusEvent) => {
		onBlur?.(event)

        if(!disableRipple) {
			markLastRippleAsRemoved();	
		}
    }, [markLastRippleAsRemoved, onBlur, disableRipple])

	return {
		ripples,
		containerRef,
		removeRipple,
		onMouseDown: handleMouseDown,
		onMouseLeave: handleMouseLeave,
		onMouseUp: handleMouseUp,
		onKeyDown: handleKeyDown,
		onKeyUp: handleKeyUp,
		onBlur: handleBlur,
	};
}
