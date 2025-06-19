import { cloneElement, type ReactElement, type HTMLAttributes } from 'react';
import { useTooltipContext } from '../model/use-tooltip-context';
import { useMergeRefs } from '@floating-ui/react';

interface TooltipTriggerProps {
	children: ReactElement<HTMLAttributes<HTMLElement> & { 'data-open'?: string }>;
}

export const TooltipTrigger = (props: TooltipTriggerProps) => {
	const { children } = props;

	const {
		getReferenceProps,
		handleTouchStart,
		handleTouchEnd,
		refs,
		open,
		tooltipId,
		describeChild,
	} = useTooltipContext();

	const childrenRef = (children as any).ref;
	const ref = useMergeRefs([refs.setReference, childrenRef]);

	return cloneElement(children, {
		...getReferenceProps({
			...children.props,
			ref,
			onTouchStart: handleTouchStart,
			onTouchEnd: handleTouchEnd,
			'aria-describedby': describeChild && open ? tooltipId : undefined,
		}),
		'data-open': open ? '' : undefined,
	});
};
