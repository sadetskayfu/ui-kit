import { FloatingPortal } from '@floating-ui/react';
import { useDrawerRootContext } from '../root/drawer-root-context';

export const DrawerPortal = ({ children, root }: DrawerPortal.Props) => {
    const { mounted } = useDrawerRootContext()

    if (!mounted) {
        return null
    }

	return <FloatingPortal root={root}>{children}</FloatingPortal>;
};

export namespace DrawerPortal {
	export interface Props {
		children?: React.ReactNode;
		root?: HTMLElement | React.RefObject<HTMLElement | null> | null;
	}
}
