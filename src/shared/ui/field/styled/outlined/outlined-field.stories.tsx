import type { Meta, StoryObj } from '@storybook/react';
import { OutlinedField } from './index';
import { Button, ButtonVariantProvider } from '@/shared/ui/button';
import { BorderProvider } from '@/shared/ui/border-provider';

const meta: Meta<typeof OutlinedField.Root> = {
	title: 'shared/field/outlined',
	component: OutlinedField.Root,
	args: {
		disabled: false,
		errored: false,
		readOnly: false,
		required: false,
		fullWidth: false,
		size: 'm',
	},
	argTypes: {
		size: {
			control: 'radio',
			options: ['m', 'l'],
		},
	},
};

export default meta;

type Story = StoryObj<typeof OutlinedField.Root>;

const OutlinedFieldWrapper = (args: any) => {
	return (
		<BorderProvider borderRadius="m">
			<OutlinedField.Root {...args}>
				<OutlinedField.Field>
					<OutlinedField.Label>Label</OutlinedField.Label>
					<OutlinedField.StartAdornment>KG</OutlinedField.StartAdornment>
					<OutlinedField.Control />
					<OutlinedField.Actions offset="s">
						<ButtonVariantProvider
							variant="clear"
							iconButton
							color="secondary"
							size="s"
						>
							<BorderProvider borderRadius="circular">
								<OutlinedField.Action
									render={(props, state) => (
										<Button
											{...props}
											onClick={() => {
												if (!state.readOnly) {
													console.log('decrement');
												}
											}}
											disableRipple={state.readOnly}
										>
											-
										</Button>
									)}
								/>
								<OutlinedField.Action
									render={(props, state) => (
										<Button
											{...props}
											onClick={() => {
												if (!state.readOnly) {
													console.log('increment');
												}
											}}
											disableRipple={state.readOnly}
										>
											+
										</Button>
									)}
								/>
							</BorderProvider>
						</ButtonVariantProvider>
					</OutlinedField.Actions>
				</OutlinedField.Field>
				<OutlinedField.HelperText>Helper text</OutlinedField.HelperText>
			</OutlinedField.Root>
		</BorderProvider>
	);
};

export const Default: Story = {
	render: args => OutlinedFieldWrapper(args),
};
