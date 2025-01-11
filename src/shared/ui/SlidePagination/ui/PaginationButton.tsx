import { memo, ReactNode } from "react"
import { classNames } from "@/shared/lib/classNames/classNames"
import styles from './style.module.scss'

type PaginationButtonVariant = 'dot'

interface PaginationButtonProps {
    children?: ReactNode
    isActive: boolean
    variant?: PaginationButtonVariant
    onClick: (index: number) => void
    index: number
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