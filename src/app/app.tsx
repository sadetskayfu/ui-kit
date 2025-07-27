import { Header } from '@/widgets/header';
import { AlertSection } from '@/widgets/alert-section';

import './styles/main.scss';
import { VariablesSection } from '@/features/templates';
import { ToastSection } from '@/widgets/toast-section';


export function App() {
	return (
		<div>
			<Header />
			<div className="container" style={{paddingBottom: '30px'}}>
				<VariablesSection />
				<AlertSection />
				<ToastSection />
			</div>
		</div>
	);
}
