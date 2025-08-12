import { classNames } from "@/shared/helpers/class-names"
import { BaseSelect } from "../../base"
import { ArrowIcon } from "@/shared/ui/icons"
import styles from './select-icon.module.scss'

export const SelectIcon = () => {
    return (
        <BaseSelect.Icon  className={(state) => classNames(styles['icon'], [], {[styles['open']]: state.open})}>
            <ArrowIcon />
        </BaseSelect.Icon>
    )
}