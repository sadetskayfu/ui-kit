export interface WorkerMessageData {
	command: 'start' | 'end' | 'pause' | 'resume' | 'reset';
	startTime: number;
	endTime: number;
	step?: number;
}

export interface WorkerResponse {
	time: number;
	isRunning?: boolean;
	isPaused?: boolean;
}

let intervalId: NodeJS.Timeout | null = null;

// @ts-ignore
const workerSelf = self as DedicatedWorkerGlobalScope;

workerSelf.onmessage = (event: MessageEvent<WorkerMessageData>) => {
	const { command, startTime, endTime, step = 1 } = event.data;

	let currentTime = startTime;

	const resetTime = () => {
		currentTime = startTime;
	};

	const customClearInterval = () => {
		if (intervalId) {
			clearInterval(intervalId);
		}
		intervalId = null;
	};

	const endTimer = () => {
		customClearInterval();
		workerSelf.postMessage({ time: endTime, isRunning: false } as WorkerResponse);
	};

	if (command === 'start') {
		customClearInterval();
		resetTime();

		intervalId = setInterval(() => {
			currentTime += step;

			workerSelf.postMessage({ time: currentTime, isRunning: true } as WorkerResponse);

			if (currentTime === endTime) {
				endTimer();
			}
		}, 1000);
	} else if (command === 'end') {
		endTimer();
	} else if (command === 'pause') {
		if (intervalId) {
			customClearInterval();
			workerSelf.postMessage({
				time: currentTime,
				isRunning: true,
				isPaused: true,
			} as WorkerResponse);
		}
	} else if (command === 'resume') {
		intervalId = setInterval(() => {
			currentTime += step;

			workerSelf.postMessage({
				time: currentTime,
				isPaused: false,
				isRunning: true,
			} as WorkerResponse);

			if (currentTime === endTime) {
				endTimer();
			}
		}, 1000);
	} else if (command === 'reset') {
		customClearInterval();
		resetTime();
		workerSelf.postMessage({ time: startTime, isRunning: false } as WorkerResponse);
	}
};
