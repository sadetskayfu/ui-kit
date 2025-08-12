import type { Meta, StoryObj } from '@storybook/react';
import { FilledSelect } from './index';
import { BorderProvider } from '@/shared/ui/border-provider';
import { Button } from '@/shared/ui/button';
import { XMarkIcon } from '@/shared/ui/icons';
import { Chip } from '@/shared/ui/chip';

const meta: Meta<typeof FilledSelect.Root> = {
	title: 'shared/select/filled-select',
	component: FilledSelect.Root,
	args: {
		disabled: false,
		readOnly: false,
		required: false,
		size: 'm',
	},
};

export default meta;

type Story = StoryObj<typeof FilledSelect.Root>;

const SingleSelectWrapper = (args: any) => {
	return (
		<div style={{ width: '300px' }}>
			<BorderProvider borderRadius="m">
				<FilledSelect.Root
					{...args}
					label="Single select"
					placeholder="Select one options"
					availableHeight
					placement="bottom"
					defaultValue="2"
					helperText="Helper text"
				>
					<FilledSelect.Popup>
						<FilledSelect.List>
							{Array.from({ length: 50 }, (_, index) => (
								<FilledSelect.Item value={`${index + 1}`} key={index + 1}>
									{index + 1}
								</FilledSelect.Item>
							))}
						</FilledSelect.List>
					</FilledSelect.Popup>
				</FilledSelect.Root>
			</BorderProvider>
		</div>
	);
};

const MultiSelectWrapper = (args: any) => {
	return (
		<div style={{ width: '300px' }}>
			<BorderProvider borderRadius="m">
				<FilledSelect.Root
					{...args}
					label="Multi select"
					placeholder="Select one options"
					availableHeight
					placement="bottom"
					defaultValue={['23', '14']}
					helperText="Helper text"
					multiple
					actions={
						<FilledSelect.Clear
							render={props => (
								<BorderProvider borderRadius="circular">
									<Button size="xs" color="secondary" iconButton {...props}>
										<XMarkIcon />
									</Button>
								</BorderProvider>
							)}
						/>
					}
				>
					<FilledSelect.Popup>
						<FilledSelect.List>
							<FilledSelect.Group>
								<FilledSelect.GroupLabel>Group A</FilledSelect.GroupLabel>
								{Array.from({ length: 50 }, (_, index) => (
									<FilledSelect.Item value={`${index + 1}`} key={index + 1}>
										{index + 1}
									</FilledSelect.Item>
								))}
							</FilledSelect.Group>
							<FilledSelect.Group>
								<FilledSelect.GroupLabel>Group B</FilledSelect.GroupLabel>
								{Array.from({ length: 50 }, (_, index) => (
									<FilledSelect.Item
										value={`${index + 50 + 1}`}
										key={index + 50 + 1}
									>
										{index + 50 + 1}
									</FilledSelect.Item>
								))}
							</FilledSelect.Group>
						</FilledSelect.List>
					</FilledSelect.Popup>
				</FilledSelect.Root>
			</BorderProvider>
		</div>
	);
};

const MultiSelectWithChipsWrapper = (args: any) => {
	return (
		<div style={{ width: '300px' }}>
			<BorderProvider borderRadius="m">
				<FilledSelect.Root
					{...args}
					label="Multi select"
					placeholder="Select one options"
					availableHeight
					placement="bottom"
					defaultValue={['23', '14']}
					helperText="Helper text"
					multiple
					renderValue={(props, state) => (
						<div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
							{(state.selectedValue as string[]).map(value => (
								<Chip.Root
									{...props}
									size="s"
									nativeButton={false}
									interactive={false}
									disableRipple
									tabIndex={-1}
									onClose={() => state.onDelete(value)}
									render={<div />}
								>
									<Chip.Label>{value}</Chip.Label>
									<Chip.Close onMouseDown={event => event.preventDefault()} />
								</Chip.Root>
							))}
						</div>
					)}
					actions={
						<FilledSelect.Clear
							render={props => (
								<BorderProvider borderRadius="circular">
									<Button size="xs" color="secondary" iconButton {...props}>
										<XMarkIcon />
									</Button>
								</BorderProvider>
							)}
						/>
					}
				>
					<FilledSelect.Popup>
						<FilledSelect.List>
							<FilledSelect.Group>
								<FilledSelect.GroupLabel>Group A</FilledSelect.GroupLabel>
								{Array.from({ length: 50 }, (_, index) => (
									<FilledSelect.Item value={`${index + 1}`} key={index + 1}>
										{index + 1}
									</FilledSelect.Item>
								))}
							</FilledSelect.Group>
							<FilledSelect.Group>
								<FilledSelect.GroupLabel>Group B</FilledSelect.GroupLabel>
								{Array.from({ length: 50 }, (_, index) => (
									<FilledSelect.Item
										value={`${index + 50 + 1}`}
										key={index + 50 + 1}
									>
										{index + 50 + 1}
									</FilledSelect.Item>
								))}
							</FilledSelect.Group>
						</FilledSelect.List>
					</FilledSelect.Popup>
				</FilledSelect.Root>
			</BorderProvider>
		</div>
	);
};

export const Single: Story = {
	render: args => SingleSelectWrapper(args),
};

export const Multi: Story = {
	render: args => MultiSelectWrapper(args),
};

export const WithChips: Story = {
	render: args => MultiSelectWithChipsWrapper(args),
};
