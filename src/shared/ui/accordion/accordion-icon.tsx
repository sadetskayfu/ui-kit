import { classNames, type Mods } from "@/shared/helpers/class-names"
import { memo } from "react"
import styles from './accordion-icon.module.scss'

export const AccordionIcon = memo(({open: isOpen}: { open: boolean }) => {
    const mods: Mods = {
        [styles['open']]: isOpen
    }

    return (
        <span className={classNames(styles['accordion-icon'], [], mods)}></span>
    )
})