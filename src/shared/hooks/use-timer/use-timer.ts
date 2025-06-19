import { useEffect, useState, useRef, useCallback } from 'react';

type UseTimerProps = {
    time?: number,
    setTime?: React.Dispatch<React.SetStateAction<number>>,
	variant: 'incr' | 'decr';
	step?: number;
	startTime: number;
	endTime: number;
	onEnd?: () => void;
	onStart?: () => void;
	onPause?: () => void;
	onResume?: () => void;
	onReset?: () => void;
};

export const useTimer = (props: UseTimerProps) => {
	const {
        time: externalTime,
        setTime: setExternalTime,
		variant,
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

	const [localTime, setLocalTime] = useState(startTime);
    const [isRunning, setIsRunning] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

    const time = externalTime ?? localTime
    const setTime = setExternalTime ?? setLocalTime

	const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

	const clear = useCallback(() => {
		if (intervalIdRef.current) {
			clearInterval(intervalIdRef.current);
		}
	}, []);

	const endTimer = useCallback(() => {
		clear();
		setTime(endTime);
		setIsRunning(false);
		setIsPaused(false);
		onEnd?.();
	}, [endTime, onEnd, clear, setTime]);

	const createInterval = useCallback(() => {
		intervalIdRef.current = setInterval(() => {
			setTime(prev => {
				if (variant === 'incr' && prev + step > endTime) {
					endTimer();
					return endTime;
				}
				if (variant === 'decr' && prev + step < endTime) {
					endTimer();
					return endTime;
				}
				return prev + step;
			});
		}, 1000);
	}, [endTimer, setTime, step, endTime, variant]);

	const resetTimer = useCallback(() => {
		clear();
		setTime(startTime);
		setIsPaused(false);
		setIsRunning(false);
		onReset?.();
	}, [clear, onReset, setTime, startTime]);

	const pauseTimer = useCallback(() => {
		if (!isRunning || isPaused) return;

		clear();
		setIsPaused(true);
		onPause?.();
	}, [onPause, clear, isRunning, isPaused]);

	const resumeTimer = useCallback(() => {
		if (!isPaused) return;

		createInterval();
		setIsPaused(false);
		onResume?.();
	}, [onResume, createInterval, isPaused]);

	const startTimer = useCallback(() => {
		if (isRunning || isPaused) return;

		clear();
		setIsRunning(true);
		setIsPaused(false);
		setTime(startTime);
		onStart?.();
		createInterval();
	}, [setTime, onStart, clear, createInterval, isRunning, isPaused, startTime]);

	useEffect(() => {
		return () => {
			clear();
		};
	}, [clear]);

	return { time, isRunning, isPaused, startTimer, endTimer, pauseTimer, resumeTimer, resetTimer };
};
