import { forwardRef } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import styles from './style.module.scss'

export type FloatingIndicatorPosition = 'top' | 'right' | 'bottom' | 'left'

interface FloatingIndicatorProps {
    position?: FloatingIndicatorPosition
}

export const FloatingIndicator = forwardRef((props: FloatingIndicatorProps, ref: React.ForwardedRef<HTMLSpanElement>) => {

    const {position = 'bottom'} = props

    const additionalClasses: Array<string | undefined> = [
        styles[position]
    ]

    return (
        <span ref={ref} className={classNames(styles['indicator'], additionalClasses)}>

        </span>
    )
})