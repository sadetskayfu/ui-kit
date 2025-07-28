import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/shared/ui/toggle';
import { BorderProvider } from './border-provider';
import { Button } from '@/shared/ui/button';
import { Alert } from '@/shared/ui/alert';

const meta: Meta<typeof BorderProvider> = {
	title: 'shared/border-provider',
	component: BorderProvider,
	args: {
		borderRadius: 'm',
		borderRadiusPlacement: 'all',
	},
    argTypes: {
        borderRadius: {
            control: 'radio',
            options: ['s', 'm', 'full', 'circular', 'none']
        },
        borderRadiusPlacement: {
            control: { type: 'check', disable: false },
            options: ['all', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
            description: 'Border radius placement (single value or array)',
          },
    }
};

export default meta;

type Story = StoryObj<typeof Toggle>;

const BorderProviderWrapper = (args: any) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
			<BorderProvider {...args}>
                <Button>Button</Button>
				<Toggle value="1">Toggle button</Toggle>
                <Alert title='Alert' description='Description'/>
			</BorderProvider>
		</div>
	);
};

export const Default: Story = {
	render: args => BorderProviderWrapper(args),
};
