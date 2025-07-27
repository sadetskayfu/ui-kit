import * as ReactDOM from 'react-dom';
import { FloatingPortalProps, useFloatingPortalNode } from '@floating-ui/react';

/**
 * `FloatingPortal` из floating-ui содержит логику по управлению фокусом.
 * Для компонентов, где нам не нужна логика фокуса, или мы ее реализовали сами, используем `FloatingPortalLite`.
 */
export const FloatingPortalLite = (props: FloatingPortalLite.Props) => {
	const node = useFloatingPortalNode({ root: props.root });

	return node && ReactDOM.createPortal(props.children, node);
};

export namespace FloatingPortalLite {
	export interface Props {
		children?: React.ReactNode;
		root?: FloatingPortalProps['root'];
	}
}
