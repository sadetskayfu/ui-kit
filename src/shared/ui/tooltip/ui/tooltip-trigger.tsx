import { cloneElement, type ReactElement, type HTMLAttributes, forwardRef } from 'react';
import { useTooltipContext } from '../model/use-tooltip-context';
import { useMergeRefs } from '@floating-ui/react';

interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {
	children: ReactElement<HTMLAttributes<HTMLElement> & { 'data-open'?: string }>;
}

export const TooltipTrigger = forwardRef((props: TooltipTriggerProps, ref: React.ForwardedRef<HTMLElement>) => {
	const { children, ...otherProps } = props;

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
	const mergeRef = useMergeRefs([refs.setReference, childrenRef, ref]);

	const childAriaDescribedby = children.props['aria-describedby'];
	const ariaDescribedby: string | undefined =
		describeChild && open
			? childAriaDescribedby
				? `${childAriaDescribedby} ${tooltipId}`
				: tooltipId
			: childAriaDescribedby;

	return cloneElement(children, {
		...getReferenceProps({
			...otherProps,
			...children.props,
			ref: mergeRef,
			onTouchStart: handleTouchStart,
			onTouchEnd: handleTouchEnd,
			'aria-describedby': ariaDescribedby,
		}),
		'data-open': open ? '' : undefined,
	});
});
