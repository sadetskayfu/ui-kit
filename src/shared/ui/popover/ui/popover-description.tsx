import {
	cloneElement,
	type HTMLAttributes,
	type ReactElement,
	useId,
	useLayoutEffect,
} from 'react';
import { usePopoverContext } from '../model/use-popover-context';

export const PopoverDescription = ({
	children,
}: {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}) => {
	const { setDescriptionId } = usePopoverContext();
	const id = useId();

	useLayoutEffect(() => {
		setDescriptionId(id);

		return () => {
			setDescriptionId(undefined);
		};
	}, [id, setDescriptionId]);

	return cloneElement(children, { id });
};
