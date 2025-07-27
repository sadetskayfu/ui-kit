import * as React from 'react'
import { useToastProviderContext } from './provider/toast-provider-context';

export function useToast() {
	const context = useToastProviderContext()

	const { toasts, add, close, update } = context

	return React.useMemo(() => ({ toasts, add, close, update }), [toasts, add, close, update])
}

export namespace useToast {
	export interface Toast {
		id: string;
        ref?: React.RefObject<HTMLElement | null>
        title?: string;
		description?: string;
        severity?: 'info' | 'warning' | 'error' | 'success';
		icon?: React.ReactElement
        height?: number
        transitionStatus?: 'starting' | 'ending' | undefined
        /**
         * Если тост удален из за превышения лимита
         */
        limited?: boolean
		/**
		 * Время до авто закрытия (мс). Передайте 0, чтобы отключить автозакрытие
		 * @default 5000
		 */
		timeout?: number;
		/**
		 * - `low` - role = `dialog`
		 * - `high` - role = `alertdialog`
		 * @default 'low'
		 */
		priority?: 'low' | 'high';
		/**
		 * Функция обратного вызова, которая будет вызвана при закрытии тоста.
		 */
		onClose?: () => void;
		/**
		 * Функция обратного вызова, которая вызывается, когда тост удаляется из списка после завершения всех анимаций при закрытии.
		 */
		onRemove?: () => void;
        data?: any
	}
    export interface AddOptions extends Omit<Toast, 'id' | 'ref' | 'height' | 'transitionStatus' | 'limited'> {
        id?: string
    }
    export interface UpdateOptions extends Partial<AddOptions> {}
}


