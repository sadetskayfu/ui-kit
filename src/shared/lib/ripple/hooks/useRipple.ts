import { useCallback, useRef, useState } from 'react';
import type { Ripple } from '../model/ripple';

export function useRipple(duration: number = 1000) {
	const [ripples, setRipples] = useState<Ripple[]>([]);
	const containerRef = useRef<HTMLSpanElement>(null);

	const removeRipple = useCallback((id: number) => {
		setRipples(prev => prev.filter(ripple => ripple.id !== id));
	}, []);

	const createRipple = useCallback(
		(event: React.MouseEvent | React.KeyboardEvent, container: HTMLSpanElement) => {
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

			return newRipple.id;
		},
		[]
	);

	const handleMouseUp = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			const container = containerRef.current;

			if (container) {
				const rippleId = createRipple(event, container);
				setTimeout(() => removeRipple(rippleId), duration);
			}
		},
		[createRipple, removeRipple, duration]
	);

	const handleKeyUp = useCallback(
		(event: React.KeyboardEvent<HTMLElement>) => {
			if (event.key !== ' ' && event.key !== 'Enter') return;

			const container = containerRef.current;

			if (container) {
				const rippleId = createRipple(event, container);
				setTimeout(() => removeRipple(rippleId), duration);
			}
		},
		[createRipple, removeRipple, duration]
	);

	return { ripples, containerRef, handleMouseUp, handleKeyUp };
}
