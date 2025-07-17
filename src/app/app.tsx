import { VariablesSection } from '@/features/templates';
import './styles/main.scss';
import { Header } from '@/widgets/header';

export function App() {
	return (
		<div>
			<Header />
			<div className="container">
				<VariablesSection />
			</div>
		</div>
	);
}
