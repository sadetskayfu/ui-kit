import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmationDialog } from '../index';
import { Button } from '@/shared/ui/button';

const meta: Meta<typeof ConfirmationDialog.Root> = {
	title: 'shared/dialog/confirmation-dialog',
	component: ConfirmationDialog.Root,
	args: {
		removeScroll: true,
		role: 'alertdialog',
		returnFocus: true,
		initialOpen: false,
	},
};

export default meta;

type Story = StoryObj<typeof ConfirmationDialog.Root>;

const ConfirmationDialogWrapper = (args: any) => {
	return (
        <ConfirmationDialog.Root onConfirm={() => console.log('Удаление')} {...args}>
            <ConfirmationDialog.Trigger render={<Button>Удалить</Button>} />
            <ConfirmationDialog.Popup title='Удаление' description='Вы уверены, что ухотите удалить?' confirmButtonLabel='Удалить'/>
        </ConfirmationDialog.Root>
	);
};

export const Default: Story = {
	render: args => ConfirmationDialogWrapper(args),
};
