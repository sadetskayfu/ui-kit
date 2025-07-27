import { generateId } from '@/shared/helpers/generate-id';
import { useToast } from '../use-toast';

export interface ToastManagerEvent {
	action: 'add' | 'close' | 'update' | 'promise';
	options: useToast.AddOptions | useToast.UpdateOptions;
}

export interface ToastManager {
	' subscribe': (listener: (data: ToastManagerEvent) => void) => () => void;
	add: (options: useToast.AddOptions) => string;
	close: (id: string) => void;
	update: (id: string, options: useToast.UpdateOptions) => void;
}

export function createToastManager(): ToastManager {
	const listeners = new Set<(data: ToastManagerEvent) => void>();

	function emit(data: ToastManagerEvent) {
		listeners.forEach(listener => listener(data));
	}

	return {
		' subscribe': function subscribe(listener: (data: ToastManagerEvent) => void) {
			listeners.add(listener);

			return () => {
				listeners.delete(listener);
			};
		},
		add(options: useToast.AddOptions): string {
			const id = options.id ?? generateId('toast');

			emit({ action: 'add', options: { ...options, id } });

			return id;
		},
		close(id: string): void {
			emit({ action: 'close', options: { id } });
		},
		update(id: string, options: useToast.UpdateOptions): void {
			emit({ action: 'update', options: { ...options, id } });
		},
	};
}
