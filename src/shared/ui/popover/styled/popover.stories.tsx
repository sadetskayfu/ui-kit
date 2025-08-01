import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from '../index';
import { Button } from '@/shared/ui/button';

const meta: Meta<typeof Popover.Root> = {
	title: 'shared/popover',
	component: Popover.Root,
	args: {
		removeScroll: false,
		returnFocus: true,
		initialOpen: false,
		modal: true,
		closeOnFocusOut: true,
		closeOnOutsidePress: true,
        flipPadding: 5,
        placement: 'bottom-start',
        offset: 5,
	},
};

export default meta;

type Story = StoryObj<typeof Popover.Root>;

const UncontrolledPopoverWrapper = (args: any) => {
	return (
		<Popover.Root {...args}>
			<Popover.Trigger render={<Button>Popover trigger</Button>} />
			<Popover.Popup
				contentStyle={{ padding: '15px' }}
			>
				<Popover.Title className="fz-5">Popover title</Popover.Title>
				<Popover.Description className="fc-soft">Popover description</Popover.Description>
				<Popover.Close
					render={
						<Button style={{ marginTop: '20px' }} size="s" color="secondary">
							Close
						</Button>
					}
				/>
                <Popover.Arrow />
			</Popover.Popup>
		</Popover.Root>
	);
};

const WithoutTriggerAndClosePopoverWrapper = (args: any) => {
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
				Open popover
			</Button>
			<Popover.Root
				{...args}
				open={open}
				setOpen={setOpen}
				initialFocus={closeButtonRef}
				returnFocus={openButtonRef}
                referenceRef={openButtonRef}
			>
				<Popover.Popup
					id={popupId}
					contentStyle={{ padding: '15px' }}
					style={{ width: '500px' }}
				>
					<Popover.Title className="fz-5">Popover title</Popover.Title>
					<Popover.Description className="fc-soft">Popover description</Popover.Description>
					<Button
						ref={closeButtonRef}
						onClick={() => setOpen(false)}
						style={{ marginLeft: 'auto' }}
						size="s"
						color="secondary"
					>
						Close
					</Button>
				</Popover.Popup>
			</Popover.Root>
		</>
	);
};

export const Uncontrolled: Story = {
	render: args => UncontrolledPopoverWrapper(args),
    args: {
        offset: 10
    }
};

export const WithoutTriggerAndClose: Story = {
	render: args => WithoutTriggerAndClosePopoverWrapper(args),
    args: {
        placement: 'bottom'
    }
};
