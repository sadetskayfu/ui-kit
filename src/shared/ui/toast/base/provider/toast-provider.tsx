import * as React from 'react';
import { useEventCallback } from '@/shared/hooks';
import { Timeout } from '@/shared/hooks/use-timeout';
import { activeElement, contains, matchesFocusVisible } from '@floating-ui/react/utils';
import { ownerDocument } from '@/shared/helpers/owner';
import { generateId } from '@/shared/helpers/generate-id';
import { ToastProviderContext } from './toast-provider-context';
import { ToastManager } from '../manager/create-toast-manager';
import { useToast } from '../use-toast';

interface TimerInfo {
	timeout?: Timeout;
	start: number;
	delay: number;
	remaining: number;
	callback: () => void;
}

export const ToastProvider = (props: ToastProvider.Props) => {
	const { children, timeout = 5000, limit = 3, toastManager } = props;

	const [toasts, setToasts] = React.useState<useToast.Toast[]>([]);
	const [hovering, setHovering] = React.useState(false);
	const [focused, setFocused] = React.useState(false);
	const [prevFocusElement, setPrevFocusElement] = React.useState<HTMLElement | null>(null);

	const timersRef = React.useRef(new Map<string, TimerInfo>());
	const viewportRef = React.useRef<HTMLElement>(null);
	const windowFocusedRef = React.useRef(true);
	const isPausedRef = React.useRef(false);

	const hasDifferingHeights = React.useMemo(() => {
		const heights = toasts.map(toast => toast.height).filter(height => height !== 0);

		return heights.length > 0 && new Set(heights).size > 1;
	}, [toasts]);

	if (toasts.length === 0) {
		if (hovering) {
			setHovering(false);
		}

		if (focused) {
			setFocused(false);
		}
	}

	// Перенос фокуса после закрытия тоста
	const handleFocusManagement = useEventCallback((toastId: string) => {
		const activeEl = activeElement(ownerDocument(viewportRef.current));

		if (
			!viewportRef.current ||
			!contains(viewportRef.current, activeEl) ||
			!matchesFocusVisible(activeEl)
		) {
			return;
		}

		const currentIndex = toasts.findIndex(toast => toast.id === toastId);
		let nextToast: useToast.Toast | null = null;

		// Ищем следущий тост для фокусировки
		let index = currentIndex + 1;

		for (index; index < toasts.length; index++) {
			if (toasts[index].transitionStatus !== 'ending') {
				nextToast = toasts[index];
				break;
			}
		}

		// Ищем предыдущий тост для фокусировки, если следущий не найден
		if (!nextToast) {
			index = currentIndex - 1;

			for (index; index >= 0; index--) {
				if (toasts[index].transitionStatus !== 'ending') {
					nextToast = toasts[index];
					break;
				}
			}
		}

		if (nextToast) {
			nextToast.ref?.current?.focus();
		} else {
			prevFocusElement?.focus({ preventScroll: true });
		}
	});

	const scheduleTimer = useEventCallback(
		(toastId: string, delay: number, callback: () => void) => {
			const start = Date.now();

			const shouldStart = windowFocusedRef.current && !hovering && !focused;

			const currentTimeout = shouldStart ? Timeout.create() : undefined;

			if (currentTimeout) {
				currentTimeout.start(delay, () => {
					timersRef.current.delete(toastId);
					callback();
				});
			}

			timersRef.current.set(toastId, {
				timeout: currentTimeout,
				start: shouldStart ? start : 0,
				remaining: delay,
				delay,
				callback,
			});
		}
	);

	const pauseTimers = React.useCallback(() => {
		if (isPausedRef.current) {
			return;
		}

		console.log('pause timer')

		isPausedRef.current = true;

		timersRef.current.forEach(timer => {
			if (timer.timeout) {
				timer.timeout.clear();

				const elapsed = Date.now() - timer.start;
				const remaining = timer.delay - elapsed;
				timer.remaining = remaining > 0 ? remaining : 0;
			}
		});
	}, []);

	const resumeTimers = React.useCallback(() => {
		if (!isPausedRef.current) {
			return;
		}

		console.log('resume timer')

		isPausedRef.current = false;

		timersRef.current.forEach((timer, id) => {
			if (timer.timeout) {
				timer.timeout ??= Timeout.create();
				timer.timeout.start(timer.remaining, () => {
					timersRef.current.delete(id);
					timer.callback();
				});
				timer.start = Date.now();
			}
		});
	}, []);

	const close = useEventCallback((toastId: string) => {
		setToasts(prev => {
			const activeToasts = prev.filter(
				toast => toast.transitionStatus !== 'ending' && toast.id !== toastId
			);

			return prev.map(toast => {
				if (toast.id === toastId) {
					return { ...toast, transitionStatus: 'ending' as const, height: 0 };
				}

				if (toast.transitionStatus === 'ending') {
					return toast;
				}

				const isToastLimited = activeToasts.indexOf(toast) >= limit;

				return { ...toast, limited: isToastLimited };
			});
		});

		const timer = timersRef.current.get(toastId);

		if (timer && timer.timeout) {
			timer.timeout.clear();
			timersRef.current.delete(toastId);
		}

		const toastToClose = toasts.find(toast => toast.id === toastId);

		toastToClose?.onClose?.();

		handleFocusManagement(toastId);

		if (toasts.length === 1) {
			setHovering(false);
			setFocused(false);
		}
	});

	const remove = useEventCallback((toastId: string) => {
		setToasts(prev => prev.filter(toast => toast.id !== toastId));

		const toastToRemove = toasts.find(t => t.id === toastId);

		toastToRemove?.onRemove?.();
	});

	const add = React.useCallback(
		(options: useToast.AddOptions) => {
			const id = options.id ?? generateId(`toast`);

			const toastToAdd: useToast.Toast = {
				...options,
				id,
				transitionStatus: 'starting',
			};

			setToasts(prev => {
				const updatedToasts = [toastToAdd, ...prev];
				const activeToasts = updatedToasts.filter(
					toast => toast.transitionStatus !== 'ending'
				);

				if (activeToasts.length > limit) {
					const oldestActiveToasts = activeToasts.slice(-(activeToasts.length - limit));

					return updatedToasts.map(toast => {
						if (
							oldestActiveToasts.some(
								oldActiveToast => oldActiveToast.id === toast.id
							)
						) {
							return { ...toast, limited: true };
						} else {
							return { ...toast, limited: false };
						}
					});
				}

				return updatedToasts.map(toast => ({ ...toast, limited: false }));
			});

			const duration = options.timeout ?? timeout;

			if (duration > 0) {
				scheduleTimer(id, duration, () => close(id));
			}

			return id;
		},
		[limit, timeout, scheduleTimer, close]
	);

	const update = useEventCallback((toastId: string, options: useToast.UpdateOptions) => {
		setToasts(prev =>
			prev.map(toast => (toast.id === toastId ? { ...toast, ...options } : toast))
		);
	});

	React.useEffect(() => {
		if (!toastManager) {
			return;
		}

		const unsubscribe = toastManager[' subscribe'](({ action, options }) => {
			const id = options.id;

			if (action === 'add') {
				add(options);
			} else if (action === 'update' && id) {
				update(id, options);
			} else if (action === 'close' && id) {
				close(id);
			}
		});

		return unsubscribe;
	}, [add, close, update, toastManager]);

	const contextValue: ToastProviderContext = React.useMemo(
		() => ({
			toasts,
			setToasts,
			hovering,
			setHovering,
			focused,
			setFocused,
			prevFocusElement,
			setPrevFocusElement,
			add,
			update,
			close,
			remove,
			pauseTimers,
			resumeTimers,
			scheduleTimer,
			hasDifferingHeights,
			viewportRef,
			windowFocusedRef,
		}),
		[
			toasts,
			setToasts,
			hovering,
			setHovering,
			focused,
			setFocused,
			prevFocusElement,
			setPrevFocusElement,
			add,
			update,
			close,
			remove,
			pauseTimers,
			resumeTimers,
			scheduleTimer,
			hasDifferingHeights,
			viewportRef,
			windowFocusedRef,
		]
	);

	return (
		<ToastProviderContext.Provider value={contextValue}>
			{children}
		</ToastProviderContext.Provider>
	);
};

export namespace ToastProvider {
	export interface Props {
		children?: React.ReactNode;
		/**
		 * Время до авто закрытия (мс). Передайте 0, чтобы отключить автозакрытие
		 * @default 5000
		 */
		timeout?: number;
		/**
		 * @default 3
		 */
		limit?: number;
		toastManager?: ToastManager;
	}
}
