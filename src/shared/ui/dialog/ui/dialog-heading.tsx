import {
	cloneElement,
	type HTMLAttributes,
	type ReactElement,
	useId,
	useLayoutEffect,
} from 'react';
import { useDialogContext } from '../model/use-dialog-context';

export const DialogHeading = ({
	children,
}: {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}) => {
	const { setLabelId } = useDialogContext();
	const id = useId();

	useLayoutEffect(() => {
		setLabelId(id);

		return () => {
			setLabelId(undefined);
		};
	}, [id, setLabelId]);

	return cloneElement(children, { id });
};
