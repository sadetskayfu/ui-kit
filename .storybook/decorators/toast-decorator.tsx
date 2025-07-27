import { toastManager, ToastProvider } from '@/shared/ui/toast';
import { type Decorator } from '@storybook/react';

export const ToastDecorator: Decorator = Story => {
	return (
		<ToastProvider toastManager={toastManager}>
			<Story />
		</ToastProvider>
	);
};
