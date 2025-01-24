import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

type TypographyColor = 'hard' | 'soft' | 'onDark' | 'error'
type TypographyComponent =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'p'
	| 'span'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'text' | 'helper-text'

interface TypographyProps {
	className?: string
	id?: string
	color?: TypographyColor
	component?: TypographyComponent
	variant?: TypographyVariant
	children: string
}

export const Typography = (props: TypographyProps) => {
	const { className, id, component = 'p', variant = 'text', color = 'soft', children } = props

	const Tag = component

	const additionalClasses: Array<string | undefined> = [
		className,
		styles[variant],
		styles[color]
	]

	return (
        <Tag id={id} className={classNames(styles['typography'], additionalClasses)}>
            {children}
        </Tag>
    )
}
