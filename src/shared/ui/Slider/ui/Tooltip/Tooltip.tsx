import { classNames } from '@/shared/lib/classNames/classNames'
import { memo } from 'react'
import styles from './style.module.scss'

export type TooltipPosition = 'bottom' | 'top' | 'left' | 'right'

interface TooltipProps {
    className?: string
    label: string | number
    position: TooltipPosition
}

const Tooltip = memo((props: TooltipProps) => {

    const {className, label, position = 'top'} = props

    const additionalClasses: Array<string | undefined> = [
        className,
        styles[position]
    ]

    return (
        <div className={classNames(styles['tooltip'], additionalClasses)}>
            <div className={styles['content']}>
                {label}
            </div>
        </div>
    )
})

export default Tooltip