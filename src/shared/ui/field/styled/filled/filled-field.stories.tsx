import type { Meta, StoryObj } from '@storybook/react';
import { FilledField } from './index';
import { Button, ButtonVariantProvider } from '@/shared/ui/button';
import { BorderProvider } from '@/shared/ui/border-provider';

const meta: Meta<typeof FilledField.Root> = {
	title: 'shared/field/filled',
	component: FilledField.Root,
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

type Story = StoryObj<typeof FilledField.Root>;

const FilledFieldWrapper = (args: any) => {
	return (
		<BorderProvider borderRadius="m">
			<FilledField.Root {...args}>
				<FilledField.Label>Label</FilledField.Label>
				<FilledField.Field>
					<FilledField.StartAdornment>KG</FilledField.StartAdornment>
					<FilledField.Control />
					<FilledField.Actions offset="s">
						<ButtonVariantProvider
							variant="clear"
							iconButton
							color="secondary"
							size="s"
						>
							<BorderProvider borderRadius="circular">
								<FilledField.Action
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
								<FilledField.Action
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
					</FilledField.Actions>
				</FilledField.Field>
				<FilledField.HelperText>Helper text</FilledField.HelperText>
			</FilledField.Root>
		</BorderProvider>
	);
};

export const Default: Story = {
	render: args => FilledFieldWrapper(args),
};
