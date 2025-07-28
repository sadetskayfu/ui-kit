import * as React from 'react';
import { Button } from '@/shared/ui/button';
import { Section } from '@/shared/ui/section';
import { Toast, useToast } from '@/shared/ui/toast';
import { Alert } from '@/shared/ui/alert';
import styles from './toast-section.module.scss';

export const ToastSection = () => {
	const countRef = React.useRef(0);

	const { toasts, add } = useToast();

	return (
		<Section title="Toast" contentClassName={styles['list']}>
			<Button
				onClick={() =>
					add({
						title: `Info toast ${++countRef.current}`,
						description: 'Description',
						severity: 'info',
					})
				}
			>
				Add info toast
			</Button>
			<Button
				onClick={() =>
					add({
						title: `Warning toast ${++countRef.current}`,
						description: 'Description',
						severity: 'warning',
					})
				}
			>
				Add warning toast
			</Button>
			<Button
				onClick={() =>
					add({
						title: `Error toast ${++countRef.current}`,
						description: 'Description',
						severity: 'error',
					})
				}
			>
				Add error toast
			</Button>
			<Button
				onClick={() =>
					add({
						title: `Success toast ${++countRef.current}`,
						description: 'Description',
						severity: 'success',
					})
				}
			>
				Add Success toast
			</Button>
			<Toast.Viewport position='top-center'>
				{toasts.map(toast => (
					<Toast.Toast
						key={toast.id}
						toast={toast}
						render={<Alert title={toast.title!} description={toast.description} severity={toast.severity}/>}
					/>
				))}
			</Toast.Viewport>
		</Section>
	);
};
