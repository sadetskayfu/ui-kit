import { useContext } from 'react';
import { CollapseContext } from './collapse-context';

export function useCollapseContext() {
	const context = useContext(CollapseContext);

	if (context == null) {
		throw new Error('Collapse components must be wrapped in <Collapse />');
	}

	return context;
}
