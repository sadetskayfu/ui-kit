import { cloneElement, type HTMLAttributes, type ReactElement } from 'react';
import { usePopoverContext } from '../model/use-popover-context';
import { useMergeRefs } from '@floating-ui/react';

interface PopoverTriggerProps {
	children: ReactElement<HTMLAttributes<HTMLElement> & { 'data-open'?: string }>;
}

export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
	const { getReferenceProps, refs, open } = usePopoverContext();

	const childrenRef = (children as any).ref;
	const ref = useMergeRefs([refs.setReference, childrenRef]);

	return cloneElement(children, {
		...getReferenceProps({
			...children.props,
			ref,
		}),
		'data-open': open ? '' : undefined,
	});
};
