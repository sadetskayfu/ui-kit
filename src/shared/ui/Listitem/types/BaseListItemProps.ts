import { AriaRole, ReactNode } from "react"

type AriaAttributes = {
	'aria-label'?: string
}

export interface BaseListItemProps extends AriaAttributes {
    className?: string
    children: ReactNode
    role?: AriaRole
    style?: React.CSSProperties
}