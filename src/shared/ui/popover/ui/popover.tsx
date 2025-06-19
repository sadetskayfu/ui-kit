import { PopoverContext } from '../model/popover-context';
import { type UsePopoverProps, usePopover } from '../model/use-popover';
import { type ReactNode } from 'react';

export interface PopoverProps extends UsePopoverProps {
	children: ReactNode;
}

export const Popover = (props: PopoverProps) => {
	const { children, ...usePopoverProps } = props;

	const popover = usePopover(usePopoverProps);

	return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
};
