import { useCallback, useEffect, useRef } from 'react';

export function useTimeout() {
	const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

	const clear = useCallback(() => {
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
			timeoutIdRef.current = null;
		}
	}, []);

	const start = useCallback(
		(delay: number, fn: () => void) => {
			clear();

			timeoutIdRef.current = setTimeout(() => {
				fn();
				timeoutIdRef.current = null;
			}, delay);
		},
		[clear]
	);

	const isStarted = useCallback(() => {
		return Boolean(timeoutIdRef.current);
	}, []);

	useEffect(() => {
		return () => {
			clear();
		};
	}, [clear]);

	return { start, clear, isStarted };
}
