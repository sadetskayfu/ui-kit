import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

type SkeletonVariant = 'circular' | 'rounded' | 'rectangular'

interface SkeletonProps {
    className?: string
    variant?: SkeletonVariant
    width?: string
    height?: string
}

export const Skeleton = (props: SkeletonProps) => {

    const {className, variant = 'rounded', width, height} = props

    const additionalClasses: Array<string | undefined> = [
        className,
        styles[variant]
    ]

    return (
        <span style={{width, height}} className={classNames(styles['skeleton'], additionalClasses)}>
        </span>
    )
}