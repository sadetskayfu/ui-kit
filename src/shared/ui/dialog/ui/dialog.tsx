import { DialogContext } from '../model/dialog-context';
import { type UseDialogProps, useDialog } from '../model/use-dialog';
import { type ReactNode } from 'react';

export interface DialogProps extends UseDialogProps {
	children: ReactNode;
}

export const Dialog = (props: DialogProps) => {
	const { children, ...useDialogProps } = props;

	const dialog = useDialog(useDialogProps);

	return <DialogContext.Provider value={dialog}>{children}</DialogContext.Provider>;
};
