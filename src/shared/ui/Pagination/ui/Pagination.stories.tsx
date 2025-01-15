import { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'
import { useState } from 'react'

const meta: Meta<typeof Pagination> = {
	title: 'shared/Pagination',
	component: Pagination,
	args: {
        borderRadius: 'circular',
        size: 'medium',
        color: 'secondary',
        infinity: false,
        maxDisplayedPages: 5,
        totalItems: 100,
        totalItemsOnPage: 10,
	},
}

export default meta

type Story = StoryObj<typeof Pagination>

const PaginationWrapper = (args: any) => {

    const [page, setPage] = useState<number>(1)

    const handleChange = (page: number) => {
        setPage(page)
    }

    return (
        <>
            <Pagination currentPage={page} onChange={handleChange} {...args}/>
        </>
    )
}

export const DefaultPagination: Story = {
	render: (args) => PaginationWrapper(args)
}
