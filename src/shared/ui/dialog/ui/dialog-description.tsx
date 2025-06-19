import {
	cloneElement,
	type HTMLAttributes,
	type ReactElement,
	useId,
	useLayoutEffect,
} from 'react';
import { useDialogContext } from '../model/use-dialog-context';

export const DialogDescription = ({
	children,
}: {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}) => {
	const { setDescriptionId } = useDialogContext();
	const id = useId();

	useLayoutEffect(() => {
		setDescriptionId(id);

		return () => {
			setDescriptionId(undefined);
		};
	}, [id, setDescriptionId]);

	return cloneElement(children, { id });
};
