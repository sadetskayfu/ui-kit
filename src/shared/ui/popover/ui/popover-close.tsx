import { cloneElement, type HTMLAttributes, type ReactElement, useCallback } from 'react';
import { usePopoverContext } from '../model/use-popover-context';

export const PopoverClose = ({
	children,
}: {
	children: ReactElement<HTMLAttributes<HTMLElement>>;
}) => {
	const { setOpen } = usePopoverContext();

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
