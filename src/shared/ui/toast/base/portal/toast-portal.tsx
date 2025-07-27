import { FloatingPortalLite } from '@/shared/ui/floating-portal-lite';

export const ToastPortal = ({ children, root }: ToastPortal.Props) => {
	return <FloatingPortalLite root={root}>{children}</FloatingPortalLite>;
};

export namespace ToastPortal {
	export interface Props {
		children?: React.ReactNode;
		root?: HTMLElement | React.RefObject<HTMLElement | null> | null;
	}
}
