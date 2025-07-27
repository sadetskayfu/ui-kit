import { useLazyRef, useOnMount } from "../hooks";

const EMPTY = null;

class Scheduler {
	callbacks = [] as (FrameRequestCallback | null)[];

	callbacksCount = 0;

	nextId = 0;

	startId = 0;

	isScheduled = false;

	tick(timestamp: number) {
		this.isScheduled = false;

		const currentCallbacks = this.callbacks;
		const currentCallbacksCount = this.callbacksCount;

		this.callbacks = [];
		this.callbacksCount = 0;
		this.startId = this.nextId;

		if (currentCallbacksCount > 0) {
			for (let i = 0; i < currentCallbacks.length; i += 1) {
				currentCallbacks[i]?.(timestamp);
			}
		}
	}

	request(fn: FrameRequestCallback) {
		const id = this.nextId;
		this.nextId += 1;
		this.callbacks.push(fn);
		this.callbacksCount += 1;

		if (!this.isScheduled) {
			requestAnimationFrame(this.tick);
			this.isScheduled = true;
		}

		return id;
	}

	cancel(id: number) {
		const index = id - this.startId;

		if (index < 0 || index >= this.callbacks.length) {
			return;
		}
		this.callbacks[index] = null;
		this.callbacksCount -= 1;
	}
}

const scheduler = new Scheduler();

export class AnimationFrame {
	static create() {
		return new AnimationFrame();
	}

	static request(fn: FrameRequestCallback) {
		return scheduler.request(fn);
	}

	static cancel(id: number) {
		return scheduler.cancel(id);
	}

	currentId: number | null = EMPTY;

	request(fn: Function) {
		this.cancel();
		this.currentId = scheduler.request(() => {
			this.currentId = EMPTY;
			fn();
		});
	}

	cancel = () => {
		if (this.currentId !== EMPTY) {
			scheduler.cancel(this.currentId);
			this.currentId = EMPTY;
		}
	};

	disposeEffect = () => {
		return this.cancel;
	};
}

export function useAnimationFrame() {
    const timeout = useLazyRef(AnimationFrame.create).current

    useOnMount(timeout.disposeEffect)

    return timeout
}

