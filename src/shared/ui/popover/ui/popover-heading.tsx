import {
	cloneElement,
	type HTMLAttributes,
	type ReactElement,
	useId,
	useLayoutEffect,
} from 'react';
import { usePopoverContext } from '../model/use-popover-context';

export const PopoverHeading = ({
	children,
}: {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}) => {
	const { setLabelId } = usePopoverContext();
	const id = useId();

	useLayoutEffect(() => {
		setLabelId(id);

		return () => {
			setLabelId(undefined);
		};
	}, [id, setLabelId]);

	return cloneElement(children, { id });
};
