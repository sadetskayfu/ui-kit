import { FloatingPortal } from '@floating-ui/react';
import { useDialogRootContext } from '../root/dialog-root-context';

export const DialogPortal = ({ children, root }: DialogPortal.Props) => {
    const { mounted } = useDialogRootContext()

    if (!mounted) {
        return null
    }

	return <FloatingPortal root={root}>{children}</FloatingPortal>;
};

export namespace DialogPortal {
	export interface Props {
		children?: React.ReactNode;
		root?: HTMLElement | React.RefObject<HTMLElement | null> | null;
	}
}
