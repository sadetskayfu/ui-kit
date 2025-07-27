import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useModernLayoutEffect } from './use-modern-layout-effect';
import { AnimationFrame } from './use-animation-frame';

export type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined;

export function useTransitionStatus(
	open: boolean,
	enableIdleState: boolean = false,
	deferEndingState: boolean = false
) {
	const [transitionStatus, setTransitionStatus] = React.useState<TransitionStatus>(undefined);
	const [mounted, setMounted] = React.useState<boolean>(open);

	if (open && !mounted) {
		setMounted(true);
		setTransitionStatus('starting');
	}

	if (!open && mounted && transitionStatus !== 'ending' && !deferEndingState) {
		setTransitionStatus('ending');
	}

	if (!open && !mounted && transitionStatus === 'ending') {
		setTransitionStatus(undefined);
	}

	useModernLayoutEffect(() => {
		if (!open && mounted && transitionStatus !== 'ending' && deferEndingState) {
			const frame = AnimationFrame.request(() => {
				setTransitionStatus('ending');
			});

			return () => {
				AnimationFrame.cancel(frame);
			};
		}

		return undefined;
	}, [open, mounted, transitionStatus, deferEndingState]);

	useModernLayoutEffect(() => {
		if (!open || enableIdleState) {
			return undefined;
		}

		const frame = AnimationFrame.request(() => {
			ReactDOM.flushSync(() => {
				setTransitionStatus(undefined);
			});
		});

		return () => {
			AnimationFrame.cancel(frame);
		};
	}, [enableIdleState, open]);

	useModernLayoutEffect(() => {
		if (!open || !enableIdleState) {
			return undefined;
		}

		if (open && mounted && transitionStatus !== 'idle') {
			setTransitionStatus('starting');
		}

		const frame = AnimationFrame.request(() => {
			setTransitionStatus('idle');
		});

		return () => {
			AnimationFrame.cancel(frame);
		};
	}, [enableIdleState, open, mounted, setTransitionStatus, transitionStatus]);

	return React.useMemo(
		() => ({
			mounted,
			setMounted,
			transitionStatus,
		}),
		[mounted, transitionStatus]
	);
}
