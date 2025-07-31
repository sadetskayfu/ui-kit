import { FloatingPortal } from '@floating-ui/react';
import { useAsideMenuRootContext } from '../root/aside-menu-root-context';

export const AsideMenuPortal = ({ children, root }: AsideMenuPortal.Props) => {
    const { mounted } = useAsideMenuRootContext()

    if (!mounted) {
        return null
    }

	return <FloatingPortal root={root}>{children}</FloatingPortal>;
};

export namespace AsideMenuPortal {
	export interface Props {
		children?: React.ReactNode;
		root?: HTMLElement | React.RefObject<HTMLElement | null> | null;
	}
}
