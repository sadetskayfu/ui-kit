import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';
import { ThemeProvider } from './providers/theme-provider/theme-provider.tsx';
import { ToastProvider } from '@/shared/ui/toast/index.ts';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<ToastProvider>
				<App />
			</ToastProvider>
		</ThemeProvider>
	</StrictMode>
);
