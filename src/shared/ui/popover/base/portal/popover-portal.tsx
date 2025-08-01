import { FloatingPortal } from '@floating-ui/react';
import { usePopoverRootContext } from '../root/popover-root-context';

export const PopoverPortal = ({ children, root }: PopoverPortal.Props) => {
    const { mounted } = usePopoverRootContext()

    if (!mounted) {
        return null
    }

	return <FloatingPortal root={root}>{children}</FloatingPortal>;
};

export namespace PopoverPortal {
	export interface Props {
		children?: React.ReactNode;
		root?: HTMLElement | React.RefObject<HTMLElement | null> | null;
	}
}
