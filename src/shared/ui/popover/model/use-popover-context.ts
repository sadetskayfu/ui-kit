import { useContext } from 'react';
import { PopoverContext } from './popover-context';

export const usePopoverContext = () => {
	const context = useContext(PopoverContext);

	if (context == null) {
		throw new Error('Popover components must be wrapped in <Popover />');
	}

	return context;
};
