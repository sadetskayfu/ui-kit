import { cloneElement, type HTMLAttributes, type ReactElement, useCallback } from 'react';
import { useDialogContext } from '../model/use-dialog-context';

export const DialogClose = ({
	children,
}: {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}) => {
	const { setOpen } = useDialogContext();

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			const originalOnClick = children.props.onClick;

			originalOnClick?.(event);
			setOpen(false);
		},
		[setOpen, children.props.onClick]
	);

	return cloneElement(children, { onClick: handleClick });
};
