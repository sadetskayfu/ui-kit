import { Header } from '@/widgets/header';
import { AlertSection } from '@/widgets/alert-section';

import './styles/main.scss';
import { ToastSection } from '@/widgets/toast-section';
import { FilledSelect } from '@/shared/ui/select/styled/filled-select/filled-select';


export function App() {
	return (
		<div>
			<Header />
			<div className="container" style={{paddingBottom: '30px'}}>
				
				<AlertSection />
				<ToastSection />
				<FilledSelect />
			</div>
		</div>
	);
}
