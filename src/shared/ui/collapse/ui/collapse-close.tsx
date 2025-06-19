import { cloneElement, useCallback, type HTMLAttributes, type ReactElement } from 'react';
import { useCollapseContext } from '../model/use-collapse-context';

export interface CollapseCloseProps {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}

export const CollapseClose = ({ children }: CollapseCloseProps) => {
	const { setIsOpen, referenceRef, externalReferenceRef } = useCollapseContext();

	const originalOnClick = children.props.onClick;

	const handleClose = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			setIsOpen(false);
			originalOnClick?.(event);
			
			if(externalReferenceRef) {
				externalReferenceRef.current?.focus()
			} else {
				referenceRef.current?.focus()
			}
		},
		[setIsOpen, originalOnClick, externalReferenceRef, referenceRef]
	);

	return cloneElement(children, {
		onClick: handleClose,
	});
};
