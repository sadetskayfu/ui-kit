import { CollapseClose, type CollapseCloseProps } from '@/shared/ui/collapse';
import { useAccordionGroupContext } from './accordion-group/use-accordion-group-context';
import { cloneElement, useCallback } from 'react';

export const AccordionClose = ({ children }: CollapseCloseProps) => {
	const context = useAccordionGroupContext();

	const childrenOnClick = children.props.onClick;

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			context?.onClose();
			childrenOnClick?.(event);
		},
		[childrenOnClick, context]
	);

	return <CollapseClose>{cloneElement(children, { onClick: handleClick })}</CollapseClose>;
};
