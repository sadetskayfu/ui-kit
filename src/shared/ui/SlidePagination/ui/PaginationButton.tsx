import { memo, ReactNode } from "react"
import { classNames } from "@/shared/helpers/classNames"
import styles from './style.module.scss'

type PaginationButtonVariant = 'dot'

interface PaginationButtonProps {
    children?: ReactNode
    isActive: boolean
    variant?: PaginationButtonVariant
    index: number
    onClick: (index: number) => void
}

export const PaginationButton = memo((props: PaginationButtonProps) => {

    const {children, isActive, index, onClick, variant = 'dot'} = props

    const mods: Record<string, boolean | undefined> = {
        [styles['active']]: isActive
    }

    const additionalClasses: Array<string | undefined> = [
        styles[variant]
    ]

    return (
        <button onClick={() => onClick(index)} className={classNames(styles['button'], additionalClasses, mods)}>
            {children}
        </button>
    )
})