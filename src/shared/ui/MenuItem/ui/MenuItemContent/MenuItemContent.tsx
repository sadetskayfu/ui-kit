import { memo, ReactElement } from 'react'
import { Typography } from '@/shared/ui/Typography'
import { classNames } from '@/shared/helpers/classNames'
import styles from './style.module.scss'

interface MenuItemContentProps {
	className?: string
	title?: string
	description?: string
	StartIcon?: ReactElement
	EndIcon?: ReactElement
}

export const MenuItemContent = memo((props: MenuItemContentProps) => {
	const { className, title, description, StartIcon, EndIcon } = props

	const mods: Record<string, boolean | undefined> = {
		[styles['with-start-icon']]: !!StartIcon,
		[styles['with-end-icon']]: !!EndIcon,
	}

	return (
		<div className={classNames(styles['content'], [className], mods)}>
			<div className={styles['header']}>
				{StartIcon && <span className={styles['start-icon']}>{StartIcon}</span>}
				{title}
				{EndIcon && <span className={styles['end-icon']}>{EndIcon}</span>}
			</div>
			{description && (
				<Typography className={styles['description']} variant="helper-text">
					{description}
				</Typography>
			)}
		</div>
	)
})
