import * as React from 'react';
import { Button, ButtonVariantProvider } from '@/shared/ui/button';
import { Dialog } from '..';
import { useEventCallback } from '@/shared/hooks';
import { useConfirmationDialogRootContext } from './confirmation-dialog-root-context';
import { BorderProvider } from '@/shared/ui/border-provider';
import { classNames } from '@/shared/helpers/class-names';
import styles from './confirmation-dialog-popup.module.scss';

export const ConfirmationDialogPopup = (props: ConfirmationDialogPopup.Props) => {
	const {
		className,
		contentClassName,
		title,
		description,
		confirmButtonLabel,
		renderConfirmButton,
		...otherProps
	} = props;

	const { setOpen, onConfirm } = useConfirmationDialogRootContext();

	const handleConfirm = useEventCallback((event: React.MouseEvent) => {
		onConfirm?.(event);
		setOpen(false);
	});

	return (
		<Dialog.Popup
			className={classNames(styles['popup'], [className])}
			contentClassName={classNames(styles['content'], [contentClassName])}
			{...otherProps}
		>
			{title && <Dialog.Title render={<span className="fz-5 fc-hard">{title}</span>} />}
			{description && (
				<Dialog.Description className="fc-soft">{description}</Dialog.Description>
			)}
			<div className={styles['actions']}>
				<BorderProvider borderRadius="s">
					<ButtonVariantProvider size="s" variant="filled">
						<Dialog.Close render={<Button color="secondary">Отмена</Button>} />
						{renderConfirmButton ? (
							renderConfirmButton({ onClick: handleConfirm })
						) : (
							<Button onClick={handleConfirm} color="red">
								{confirmButtonLabel}
							</Button>
						)}
					</ButtonVariantProvider>
				</BorderProvider>
			</div>
		</Dialog.Popup>
	);
};

export namespace ConfirmationDialogPopup {
	export interface Props extends Dialog.Popup.Props {
		title?: string;
		description?: string;
		confirmButtonLabel?: string;
		renderConfirmButton?: (props: {
			onClick: (event: React.MouseEvent) => void;
		}) => React.ReactElement<HTMLElement>;
	}
}
