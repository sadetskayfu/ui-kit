import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './pagination';
import { BorderProvider } from '@/shared/ui/border-provider';

const meta: Meta<typeof Pagination> = {
	title: 'shared/pagination',
	component: Pagination,
	args: {
        "aria-label": 'Pagination',
        loop: false,
	},
};

export default meta;

type Story = StoryObj<typeof Pagination>;

const PaginationWrapper = (args: any) => {
    const [page, setPage] = React.useState<number>(1)

    return (
        <BorderProvider borderRadius='s'>
            <Pagination page={page} onChange={setPage} {...args}/>
        </BorderProvider>
    )
}

export const Default: Story = {
    render: (args) => PaginationWrapper(args),
    args: {
        maxDisplayedPages: 5,
        totalItems: 300,
        totalItemsOnPage: 10,
    }
};




