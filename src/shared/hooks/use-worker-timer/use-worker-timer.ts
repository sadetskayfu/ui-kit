import { useEffect, useState, useRef, useCallback } from 'react';
import type { WorkerMessageData, WorkerResponse } from './worker-timer';

type UseTimerProps = {
	variant: 'incr' | 'decr';
	enabled?: boolean;
	step?: number;
	startTime: number;
	endTime: number;
	onEnd?: () => void;
	onStart?: () => void;
	onPause?: () => void;
	onResume?: () => void;
    onReset?: () => void
};

export const useWorkerTimer = (props: UseTimerProps) => {
	const {
		variant,
		enabled = true,
		step: externalStep = 1,
		startTime,
		endTime,
		onEnd,
		onStart,
		onPause,
		onResume,
        onReset,
	} = props;

	const step = variant === 'incr' ? externalStep : externalStep * -1;

	const [time, setTime] = useState(startTime);
	const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const workerRef = useRef<Worker | null>(null);

	useEffect(() => {
		if (!enabled) return;

		workerRef.current = new Worker(new URL('./worker-timer', import.meta.url));

		workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
			const { time: newTime, isRunning: workerRunning } = event.data;

			setTime(newTime);

			if (workerRunning === false) {
				setIsRunning(false);
				onEnd?.();
			}
		};

		return () => {
			if (workerRef.current) {
				workerRef.current.postMessage({ command: 'end' } as WorkerMessageData);
				workerRef.current.terminate();
				workerRef.current = null;
			}
		};
	}, [enabled, onEnd]);

	const startTimer = useCallback(
		(_: any, localStartTime?: number, localEndTime?: number) => {
			if (!enabled) return;

			if (workerRef.current) {
				setTime(localStartTime ?? startTime);
				setIsRunning(true);
				onStart?.();

				workerRef.current.postMessage({
					command: 'start',
					startTime: localStartTime ?? startTime,
					endTime: localEndTime ?? endTime,
					step,
				} as WorkerMessageData);
			}
		},
		[startTime, endTime, step, enabled, onStart]
	);

	const endTimer = useCallback(() => {
		if (!enabled) return;

		if (workerRef.current) {
			workerRef.current.postMessage({ command: 'end' } as WorkerMessageData);

            setTime(endTime)
			setIsRunning(false);
			setIsPaused(false);
			onEnd?.();
		}
	}, [enabled, endTime, onEnd]);

	const pauseTimer = useCallback(() => {
		if (!enabled) return;

		if (workerRef.current) {
			workerRef.current.postMessage({ command: 'pause' } as WorkerMessageData);

			setIsPaused(true);
			onPause?.();
		}
	}, [enabled, onPause]);

	const resumeTimer = useCallback(() => {
        if (!enabled) return;

		if (workerRef.current) {
			workerRef.current.postMessage({ command: 'resume' } as WorkerMessageData);

			setIsPaused(false);
			onResume?.();
		}
	}, [onResume, enabled]);

    const resetTimer = useCallback(() => {
        if (!enabled) return;

        if(workerRef.current) {
            workerRef.current.postMessage({command: 'reset'} as WorkerMessageData)

            setIsPaused(false)
            setIsRunning(false)
            setTime(startTime)
            onReset?.()
        }
    }, [startTime, enabled, onReset])

	return { time, isRunning, isPaused, startTimer, endTimer, pauseTimer, resumeTimer, resetTimer };
};
