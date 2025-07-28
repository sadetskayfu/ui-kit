import * as React from 'react'

export interface PaginationRootContext {
    totalPages: number
    maxDisplayedPages: number
    loop: boolean
    currentPage: number
    onChange: (page: number) => void
}

export const PaginationRootContext = React.createContext<PaginationRootContext | undefined>(undefined)

export function usePaginationRootContext() {
    const context = React.useContext(PaginationRootContext)

    if (!context) {
        throw new Error('PaginationRootContext is missing. Pagination parts must be used within <Pagination.Root>.')
    }

    return context
}