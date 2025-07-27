import { useLazyRef } from "./use-lazy-ref";
import { useOnMount } from "./use-on-mount";

type TimeoutId = number;

const EMPTY = 0 as TimeoutId;

export class Timeout {
  static create() {
    return new Timeout();
  }

  currentId: TimeoutId = EMPTY;

  start(delay: number, fn: Function) {
    this.clear();
    this.currentId = setTimeout(() => {
      this.currentId = EMPTY;
      fn();
    }, delay) as unknown as number;
  }

  isStarted() {
    return this.currentId !== EMPTY;
  }

  clear = () => {
    if (this.currentId !== EMPTY) {
      clearTimeout(this.currentId as TimeoutId);
      this.currentId = EMPTY;
    }
  };

  disposeEffect = () => {
    return this.clear;
  };
}

/**
 * A `setTimeout` with automatic cleanup and guard.
 */
export function useTimeout() {
  const timeout = useLazyRef(Timeout.create).current;

  useOnMount(timeout.disposeEffect);

  return timeout;
}