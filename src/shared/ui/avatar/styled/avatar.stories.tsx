import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
	title: 'shared/avatar',
	component: Avatar,
	args: {
        skeleton: false,
        width: undefined,
        height: undefined
	},
    argTypes: {
        size: {
            control: 'radio',
            options: ['s'],
        }
    }
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    args: {
        fallback: 'YI',
        alt: 'Yaroslaw Isakow',
        src: 'https://avatars.mds.yandex.net/i?id=11d6fa77d91c24b56fd69300f1fc2c1a0490a998-5134183-images-thumbs&n=13',
        size: 's'
    }
};


