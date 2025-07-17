import { Button } from '@/shared/ui/button';
import { Dialog, type DialogProps } from '../dialog';
import { DialogContent } from '../dialog-content';
import { DialogDescription } from '../dialog-description';
import { DialogHeading } from '../dialog-heading';
import {
	useCallback,
	useMemo,
	useRef,
	useState,
	type HTMLAttributes,
	type ReactElement,
} from 'react';
import { DialogClose } from '../dialog-close';
import { DialogTrigger } from '../dialog-trigger';
import styles from './confirm-dialog.module.scss'

type RenderConfirmButtonProps = {
	loading?: boolean;
	disabled?: boolean;
	onClick?: () => void;
};

interface ConfirmDialogProps extends Omit<DialogProps, 'children'> {
	children?: ReactElement<HTMLAttributes<HTMLElement>>; // children for dialog trigger
	title: string;
	description?: string;
	loadingAfterConfirm?: boolean;
	closeAfterConfirm?: boolean;
	renderConfirmButton?: (props: RenderConfirmButtonProps) => ReactElement;
	onConfirm: () => void;
}

export const ConfirmDialog = ({
	children,
	title,
	description,
	loadingAfterConfirm,
	closeAfterConfirm,
	initialFocus,
    initialOpen = false,
	open: controlledOpen,
	setOpen: setControlledOpen,
	renderConfirmButton,
	onConfirm,
	...otherProps
}: ConfirmDialogProps) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState<boolean>(initialOpen);

	const isOpen = controlledOpen ?? uncontrolledOpen;
	const setIsOpen = setControlledOpen ?? setUncontrolledOpen;

	const cancelButtonRef = useRef<HTMLButtonElement>(null);

	const handleConfirm = useCallback(() => {
		onConfirm();

		if (closeAfterConfirm) {
			setIsOpen(false);
		}
	}, [onConfirm, setIsOpen, closeAfterConfirm]);

	const renderedConfirmButton = useMemo(() => {
		if (renderConfirmButton) {
			return renderConfirmButton({
				loading: loadingAfterConfirm,
				disabled: loadingAfterConfirm,
				onClick: handleConfirm,
			});
		} else {
			return (
				<Button
					loading={loadingAfterConfirm}
					disabled={loadingAfterConfirm}
					onClick={handleConfirm}
					color="red"
					size="s"
				>
					Удалить
				</Button>
			);
		}
	}, [handleConfirm, renderConfirmButton, loadingAfterConfirm]);

	return (
		<Dialog
			open={isOpen}
			setOpen={setIsOpen}
            initialOpen={initialOpen}
			initialFocus={initialFocus ? initialFocus : cancelButtonRef}
			{...otherProps}
		>
			{children && <DialogTrigger>{children}</DialogTrigger>}
			<DialogContent contentClassName={styles['dialog-content']}>
				<DialogHeading>
					<span className='fz-5'>{title}</span>
				</DialogHeading>
				{description && (
					<DialogDescription>
						<span className='fc-soft'>{description}</span>
					</DialogDescription>
				)}
				<div className={styles['actions']}>
					<DialogClose>
						<Button ref={cancelButtonRef} variant="outlined" size="s">
							Отмена
						</Button>
					</DialogClose>
					{renderedConfirmButton}
				</div>
			</DialogContent>
		</Dialog>
	);
};
