import { ArrowIcon as Arrow } from "@/shared/ui/icons"
import { memo } from "react"
import styles from './arrow-icon.module.scss'

export const ArrowIcon = memo(({isOpen}: { isOpen: boolean }) => {
    return (
        <span className={styles['arrow-icon']}>
            <Arrow direction={isOpen ? 'top' : 'bottom'} />
        </span>
    )
})