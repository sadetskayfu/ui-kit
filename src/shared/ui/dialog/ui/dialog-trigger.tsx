import { cloneElement, type HTMLAttributes, type ReactElement } from 'react';
import { useDialogContext } from '../model/use-dialog-context';
import { useMergeRefs } from '@floating-ui/react';

interface DialogTriggerProps {
	children: ReactElement<HTMLAttributes<HTMLElement> & { 'data-open'?: string }>;
}

export const DialogTrigger = (props: DialogTriggerProps) => {
	const { children } = props;

	const { getReferenceProps, refs, open } = useDialogContext();

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
