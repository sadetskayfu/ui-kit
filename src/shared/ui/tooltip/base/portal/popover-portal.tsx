import { FloatingPortal } from '@floating-ui/react';
import { useTooltipRootContext } from '../root/tooltip-root-context';

export const TooltipPortal = ({ children, root }: TooltipPortal.Props) => {
    const { mounted } = useTooltipRootContext()

    if (!mounted) {
        return null
    }

	return <FloatingPortal root={root}>{children}</FloatingPortal>;
};

export namespace TooltipPortal {
	export interface Props {
		children?: React.ReactNode;
		root?: HTMLElement | React.RefObject<HTMLElement | null> | null;
	}
}
