import { cloneElement, useCallback, type HTMLAttributes, type ReactElement } from 'react';
import { useCollapseContext } from '../model/use-collapse-context';
import { useMergeRefs } from '@floating-ui/react';

interface CollapseTriggerProps {
	children: ReactElement<HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement>, 'data-open'?: string }>;
}

export const CollapseTrigger = ({ children }: CollapseTriggerProps) => {
	const { isOpen, setIsOpen, isLazy, bodyId, labelId, referenceRef } = useCollapseContext();

	const childrenOnClick = children.props.onClick;
	const childrenRef = (children as any).ref
	const mergeRef = useMergeRefs([childrenRef, referenceRef])

	const handleToggle = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			setIsOpen(prev => !prev);
			childrenOnClick?.(event);
		},
		[setIsOpen, childrenOnClick]
	);

	return cloneElement(children, {
		onClick: handleToggle,
		ref: mergeRef,
		id: labelId,
		'aria-controls': isOpen ? bodyId : isLazy ? undefined : bodyId,
		'aria-expanded': isOpen ? 'true' : 'false',
		'data-open': isOpen ? '' : undefined,
	});
};
