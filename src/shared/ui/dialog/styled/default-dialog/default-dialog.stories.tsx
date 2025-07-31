import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from '../index';
import { Button } from '@/shared/ui/button';

const meta: Meta<typeof Dialog.Root> = {
	title: 'shared/dialog/default-dialog',
	component: Dialog.Root,
	args: {
		removeScroll: true,
		role: 'dialog',
		returnFocus: true,
		initialOpen: false,
		modal: true,
		closeOnFocusOut: true,
		closeOnOutsidePress: true,
	},
};

export default meta;

type Story = StoryObj<typeof Dialog.Root>;

const UncontrolledDialogWrapper = (args: any) => {
	return (
		<Dialog.Root {...args}>
			<Dialog.Trigger render={<Button>Dialog trigger</Button>} />
			<Dialog.Popup
				contentStyle={{ padding: '15px' }}
				style={{ maxWidth: '400px', width: '100%' }}
			>
				<Dialog.Title className="fz-5">Dialog title</Dialog.Title>
				<Dialog.Description className="fc-soft">Dialog description</Dialog.Description>
				<Dialog.Close
					render={
						<Button style={{ marginLeft: 'auto' }} size="s" color="secondary">
							Close
						</Button>
					}
				/>
			</Dialog.Popup>
		</Dialog.Root>
	);
};

const WithoutTriggerAndCloseDialogWrapper = (args: any) => {
	const [open, setOpen] = React.useState<boolean>(false);
	const popupId = React.useId();

	const closeButtonRef = React.useRef<HTMLButtonElement>(null);
	const openButtonRef = React.useRef<HTMLButtonElement>(null);

	return (
		<>
			<Button
				ref={openButtonRef}
				aria-haspopup="dialog"
				aria-controls={open ? popupId : undefined}
				aria-expanded={open ? 'true' : 'false'}
				onClick={() => setOpen(true)}
			>
				Open dialog
			</Button>
			<Dialog.Root
				{...args}
				open={open}
				setOpen={setOpen}
				initialFocus={closeButtonRef}
				returnFocus={openButtonRef}
			>
				<Dialog.Popup
					id={popupId}
					contentStyle={{ padding: '15px' }}
					style={{ maxWidth: '400px', width: '100%' }}
				>
					<Dialog.Title className="fz-5">Dialog title</Dialog.Title>
					<Dialog.Description className="fc-soft">Dialog description</Dialog.Description>
					<Button
						ref={closeButtonRef}
						onClick={() => setOpen(false)}
						style={{ marginLeft: 'auto' }}
						size="s"
						color="secondary"
					>
						Close
					</Button>
				</Dialog.Popup>
			</Dialog.Root>
		</>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledDialogWrapper(args),
};

export const WithoutTriggerAndClose: Story = {
	render: args => WithoutTriggerAndCloseDialogWrapper(args),
};
