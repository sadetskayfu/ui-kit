import { forwardRef } from "react"
import styles from './style.module.scss'

export const RippleWrapper = forwardRef((_, ref: React.ForwardedRef<HTMLSpanElement>) => {
    return (
        <span ref={ref} className={styles['ripple-wrapper']}>

        </span>
    )
})