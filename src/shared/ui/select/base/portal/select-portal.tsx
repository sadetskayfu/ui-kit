import { FloatingPortal } from '@floating-ui/react';
import { useSelectRootContext } from '../root/select-root-context';
import { useStore } from '@/shared/lib/store';
import { selectors } from '../store';

export const SelectPortal = ({ children, root }: SelectPortal.Props) => {
    const { store } = useSelectRootContext()

    const mounted = useStore(store, selectors.mounted)

    if (!mounted) {
        return null
    }

	return <FloatingPortal root={root}>{children}</FloatingPortal>;
};

export namespace SelectPortal {
	export interface Props {
		children?: React.ReactNode;
		root?: HTMLElement | React.RefObject<HTMLElement | null> | null;
	}
}
