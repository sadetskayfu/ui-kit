import * as React from 'react';
import { Dialog } from '..';
import { ConfirmationDialogRootContext } from './confirmation-dialog-root-context';

export const ConfirmationDialogRoot = (props: ConfirmationDialogRoot.Props) => {
	const {
		children,
		open: externalOpen,
		setOpen: externalSetOpen,
		initialOpen = false,
		onConfirm,
		role = 'alertdialog',
		closeOnOutsidePress = false,
		...otherProps
	} = props;

	const [internalOpen, internalSetOpen] = React.useState<boolean>(initialOpen);

	const open = externalOpen ?? internalOpen;
	const setOpen = externalSetOpen ?? internalSetOpen;

	const contextValue: ConfirmationDialogRootContext = React.useMemo(
		() => ({ setOpen, onConfirm }),
		[setOpen, onConfirm]
	);

	return (
		<Dialog.Root
			open={open}
			setOpen={setOpen}
			role={role}
			closeOnOutsidePress={closeOnOutsidePress}
			{...otherProps}
		>
			<ConfirmationDialogRootContext.Provider value={contextValue}>
				{children}
			</ConfirmationDialogRootContext.Provider>
		</Dialog.Root>
	);
};

export namespace ConfirmationDialogRoot {
	export interface Props extends Dialog.Root.Props {
		onConfirm?: (event: React.MouseEvent) => void;
	}
}
