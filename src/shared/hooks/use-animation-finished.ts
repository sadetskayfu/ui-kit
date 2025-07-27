import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useAnimationFrame } from './use-animation-frame';
import { useEventCallback } from './use-event-callback';

/**
 * @param ref - The element to watch for animations.
 * @param waitForNextTick - Whether to wait for the next tick before checking for animations.
 */
export function useAnimationsFinished(
	ref: React.RefObject<HTMLElement | null>,
	waitForNextTick = false
) {
	const frame = useAnimationFrame();

	return useEventCallback(
		(
			fnToExecute: () => void,
			/**
			 * @default null
			 */
			signal: AbortSignal | null = null
		) => {
			frame.cancel();

			const element = ref.current;

			if (!element) {
				return;
			}

			if (typeof element.getAnimations !== 'function') {
				fnToExecute();
			} else {
				frame.request(() => {
					function exec() {
						if (!element) {
							return;
						}

						Promise.allSettled(element.getAnimations().map(anim => anim.finished)).then(
							() => {
								if (signal != null && signal.aborted) {
									return;
								}

								ReactDOM.flushSync(fnToExecute);
							}
						);
					}

					if (waitForNextTick) {
						frame.request(exec);
					} else {
						exec();
					}
				});
			}
		}
	);
}
