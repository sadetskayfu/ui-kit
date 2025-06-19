import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from './use-timer';

const advanceTime = async (ms: number) => {
	await act(async () => {
		jest.advanceTimersByTime(ms);
	});
};

describe('useTimer', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	test('Иницилизируется с правильным начальным состоянием', () => {
		const { result } = renderHook(() =>
			useTimer({ startTime: 10, endTime: 0, variant: 'decr' })
		);

		expect(result.current.time).toBe(10);
		expect(result.current.isRunning).toBe(false);
		expect(result.current.isPaused).toBe(false);
	});

	test('Запускается, корректно обновляется спустя время', async () => {
		const onStart = jest.fn();

		const { result: decrResult } = renderHook(() =>
			useTimer({ startTime: 10, endTime: 0, variant: 'decr', onStart })
		);
		const { result: incrResult } = renderHook(() =>
			useTimer({ startTime: 0, endTime: 10, variant: 'incr' })
		);

		act(() => incrResult.current.startTimer());
		act(() => decrResult.current.startTimer());

		expect(onStart).toHaveBeenCalledTimes(1);
		expect(decrResult.current.isRunning).toBe(true);
		expect(decrResult.current.isPaused).toBe(false);

		expect(decrResult.current.time).toBe(10);
		expect(incrResult.current.time).toBe(0);

		await advanceTime(1000);

		expect(decrResult.current.time).toBe(9);
		expect(incrResult.current.time).toBe(1);
	});

	test('Завершается, когда истекает время', async () => {
		const onEnd = jest.fn();

		const { result: decrResult } = renderHook(() =>
			useTimer({ startTime: 2, endTime: 0, variant: 'decr', onEnd })
		);
		const { result: incrResult } = renderHook(() =>
			useTimer({ startTime: 0, endTime: 2, variant: 'incr' })
		);
		const { result: decrWithStepResult } = renderHook(() =>
			useTimer({ startTime: 3, endTime: 0, variant: 'decr', step: 2 })
		);
		const { result: incrWithStepResult } = renderHook(() =>
			useTimer({ startTime: 0, endTime: 3, variant: 'incr', step: 2 })
		);

		act(() => decrResult.current.startTimer());
		act(() => incrResult.current.startTimer());
		act(() => decrWithStepResult.current.startTimer());
		act(() => incrWithStepResult.current.startTimer());

		await advanceTime(3000);

		expect(onEnd).toHaveBeenCalledTimes(1);

		expect(decrResult.current.time).toBe(0);
		expect(decrResult.current.isRunning).toBe(false);
		expect(incrResult.current.time).toBe(2);
		expect(incrResult.current.isRunning).toBe(false);
		expect(decrWithStepResult.current.time).toBe(0);
		expect(decrWithStepResult.current.isRunning).toBe(false);
		expect(incrWithStepResult.current.time).toBe(3);
		expect(incrWithStepResult.current.isRunning).toBe(false);
	});

	test('Завершается обработчиком', () => {
		const onEnd = jest.fn();

		const { result } = renderHook(() =>
			useTimer({ startTime: 0, endTime: 100, variant: 'incr', onEnd })
		);

		act(() => result.current.startTimer());
		act(() => result.current.endTimer());

		expect(result.current.isRunning).toBe(false);
		expect(result.current.isPaused).toBe(false);
		expect(result.current.time).toBe(100);
		expect(onEnd).toHaveBeenCalledTimes(1);
	});

	test('Резетается', async () => {
		const onReset = jest.fn();

		const { result } = renderHook(() =>
			useTimer({ startTime: 0, endTime: 100, variant: 'incr', onReset })
		);

		act(() => result.current.startTimer());

		await advanceTime(2000);

		act(() => result.current.resetTimer());

		expect(result.current.isRunning).toBe(false);
		expect(result.current.isPaused).toBe(false);
		expect(result.current.time).toBe(0);
		expect(onReset).toHaveBeenCalledTimes(1);
	});

	test('Ставится на паузу', async () => {
		const onPause = jest.fn();

		const { result } = renderHook(() =>
			useTimer({ startTime: 5, endTime: 0, variant: 'decr', onPause, step: 2 })
		);

		act(() => result.current.startTimer());

		await advanceTime(1000);

		act(() => result.current.pauseTimer());

		expect(result.current.isPaused).toBe(true);
		expect(result.current.isRunning).toBe(true);
		expect(result.current.time).toBe(3);
		expect(onPause).toHaveBeenCalledTimes(1);
	});

	test('Возобновляется после паузы', async () => {
		const onResume = jest.fn();

		const { result } = renderHook(() =>
			useTimer({ startTime: 5, endTime: 0, variant: 'decr', onResume, step: 1 })
		);

		act(() => result.current.startTimer());

		await advanceTime(1000);

		act(() => result.current.pauseTimer());
		act(() => result.current.resumeTimer());

		expect(result.current.isPaused).toBe(false);
		expect(result.current.isRunning).toBe(true);
		expect(result.current.time).toBe(4);
		expect(onResume).toHaveBeenCalledTimes(1);

		await advanceTime(1000);

		expect(result.current.time).toBe(3);
	});

	test('Очищается интервал после размонтирования', () => {
		const { unmount } = renderHook(() =>
			useTimer({
				variant: 'incr',
				startTime: 0,
				endTime: 10,
				step: 1,
			})
		);

		act(() => {
			unmount();
		});

		expect(jest.getTimerCount()).toBe(0);
	});
});
