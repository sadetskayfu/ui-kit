import { ReactNode } from 'react'

export interface TabPanelProps {
    className?: string
    children: ReactNode
    id: string
    labelId: string
    isActive?: boolean
}

export const TabPanel = (props: TabPanelProps) => {

    const {className, children, id, labelId, isActive} = props

    return (
        <div className={className} role="tabpanel" id={id} aria-labelledby={labelId} hidden={!isActive}>
            {isActive && children}
        </div>
    )
}