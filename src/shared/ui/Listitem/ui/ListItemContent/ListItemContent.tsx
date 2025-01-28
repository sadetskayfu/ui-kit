import { memo, ReactElement } from 'react'
import styles from './style.module.scss'

interface ListItemContent {
	title?: string
	description?: string
	StartSlot?: ReactElement
	EndSlot?: ReactElement
}

export const ListItemContent = memo((props: ListItemContent) => {
	const { title, description, StartSlot, EndSlot } = props

	return (
		<div className={styles['content']}>
			{StartSlot && StartSlot}
			{(description || title) && (
				<div className={styles['text-wrapper']}>
					<span>{title}</span>
					{description && <p className={styles['description']}>{description}</p>}
				</div>
			)}
			{EndSlot && <span className={styles['end-slot']}>{EndSlot}</span>}
		</div>
	)
})
